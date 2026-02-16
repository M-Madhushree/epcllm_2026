import os
import requests
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

# ==============================
# OFFLINE MODE (prevents downloads)
# ==============================
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

# ==============================
# PATHS
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAISS_INDEX_DIR = os.path.join(BASE_DIR, "faiss_index")

# ==============================
# MODEL CONFIG
# ==============================
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "phi3:mini"
EMBED_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# ==============================
# SYSTEM PROMPT (STRICT EPC MODE)
# ==============================
SYSTEM_PROMPT = """
You are an EPC pre-construction reasoning assistant for low- to mid-rise residential RCC buildings.

INSTRUCTIONS:
• Base your response primarily on the provided context.
• If the context is limited, respond conservatively using general EPC reasoning.
• Do NOT provide construction procedures or step-by-step methods.
• Focus on risks, trade-offs, planning implications, and decision readiness.
• Use calm professional EPC language.
• Write one clear paragraph suitable for pre-construction review.
"""


# ==============================
# LOAD EMBEDDING MODEL
# ==============================
print("Loading embedding model...")
embedding_model = HuggingFaceEmbeddings(model_name=EMBED_MODEL_NAME)

# ==============================
# LOAD FAISS VECTORSTORE
# ==============================
print("Loading FAISS index...")
vectorstore = FAISS.load_local(
    FAISS_INDEX_DIR,
    embedding_model,
    allow_dangerous_deserialization=True
)
print("FAISS index loaded successfully")

# ==============================
# RETRIEVE CONTEXT
# ==============================
def retrieve_context(query: str, k: int = 4) -> str:
    try:
        docs = vectorstore.similarity_search(query, k=k)

        if not docs:
            return ""

        return "\n\n".join([d.page_content for d in docs])

    except Exception as e:
        print("Context retrieval error:", e)
        return ""


# ==============================
# QUERY LOCAL LLM (OLLAMA)
# ==============================
def query_llm(prompt: str) -> str:
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.2,
                    "num_predict": 200,
                },
            },
            timeout=120,
        )

        return response.json().get("response", "").strip()

    except Exception as e:
        print("LLM query error:", e)
        return ""


# ==============================
# MAIN RAG PIPELINE
# ==============================
def run_rag(question: str) -> str:
    print("QUESTION RECEIVED:", repr(question))


    # 🚫 block execution / how-to questions
    forbidden_inputs = [
        "how to pour",
        "construction steps",
        "execution method",
        "on site procedure",
        "step by step",
    ]

    if any(term in question.lower() for term in forbidden_inputs):
        return (
            "This system supports EPC pre-construction decision reasoning and does not provide construction execution guidance."
        )

    # 🔎 retrieve context
    context = retrieve_context(question)

    if not context:
        return "No relevant pre-construction context found."

    final_prompt = f"""
{SYSTEM_PROMPT}

Context:
{context}

User Question:
{question}
"""

    answer = query_llm(final_prompt)

    print("\n===== LLM RAW OUTPUT =====")
    print(answer)
    print("==========================\n")

    if not answer:
        return "The system could not generate a response based on available context."

    # 🔒 hallucination guard
    forbidden_terms = [
        "code",
        "codes",
        "seismic",
        "earthquake",
        "solar",
        "green energy",
        "sustainability",
        "regulation",
        "compliance",
        "authority",
    ]

    violations = sum(term in answer.lower() for term in forbidden_terms)

    if violations >= 2:
        return (
            "Based on the available pre-construction information, the decision should be approached conservatively, "
            "as introducing unstated assumptions at this stage may increase downstream risk."
        )

    return answer
