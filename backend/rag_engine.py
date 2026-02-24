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

GUIDELINES:
• Use provided context as the primary basis for reasoning.
• When context is limited, respond conservatively using EPC reasoning.
• Focus on risks, trade-offs, constructability, durability, and decision readiness.
• Avoid introducing hazards not supported by context.
• Do NOT invent codes, numbers, or regulations.
• Do NOT provide construction procedures.

RESPONSE STYLE:
• One clear paragraph.
• Explain cause → effect → downstream impact.
• Highlight risks and trade-offs.
• Suggest mitigation considerations where appropriate.
• Use professional engineering language.
"""

# ==============================
# LOAD EMBEDDINGS
# ==============================
print("Loading embedding model...")
embedding_model = HuggingFaceEmbeddings(model_name=EMBED_MODEL_NAME)

# ==============================
# LOAD FAISS INDEX
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
                    "num_predict": 220,
                },
            },
            timeout=180,
        )
        return response.json().get("response", "").strip()
    except Exception as e:
        print("LLM query error:", e)
        return ""

# ==============================
# MAIN RAG PIPELINE
# ==============================
def run_rag(question: str) -> str:

    # 🚫 block execution guidance
    forbidden_inputs = [
        "how to pour",
        "construction steps",
        "execution method",
        "site procedure",
        "step by step",
    ]

    if any(term in question.lower() for term in forbidden_inputs):
        return (
            "This system supports EPC pre-construction decision reasoning "
            "and does not provide construction execution guidance."
        )

    # 🔎 retrieve context
    context = retrieve_context(question)

    if not context:
        context = "Limited pre-construction context available. Provide a cautious engineering assessment."

    final_prompt = f"""{SYSTEM_PROMPT}

CONTEXT:
{context}

QUESTION:
{question}

ANSWER:"""

    answer = query_llm(final_prompt)

    if not answer:
        return "The system could not generate a response based on available context."

    # 🔒 hallucination guard
    forbidden_terms = [
        "permit",
        "regulation",
        "authority approval",
        "legal requirement",
        "compliance",
    ]

    if any(term in answer.lower() for term in forbidden_terms):
        return (
            "This system provides pre-construction decision insights and does not address regulatory compliance."
        )

    return answer