import os
import json
import faiss
import requests
from sentence_transformers import SentenceTransformer

# ==============================
# OFFLINE MODE (optional)
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
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"

# ==============================
# SYSTEM PROMPT (FINAL OPTIMIZED)
# ==============================
SYSTEM_PROMPT = """
You are an EPC pre-construction reasoning assistant for low- to mid-rise residential RCC buildings.

GUIDELINES:
• Use the provided context as the primary basis for reasoning.
• Provide conservative engineering reasoning when context is limited.
• Focus on decision readiness, risk awareness, trade-offs, and downstream impacts.
• Avoid introducing hazards, forces, or risks not present in the context.
• Do NOT invent numerical values, codes, standards, or regulations.
• Do NOT provide construction procedures or site execution guidance.
• Maintain a practical EPC decision-support perspective.

RESPONSE STYLE:
• Write one clear paragraph suitable for engineering decision review.
• Explain cause → effect → downstream impact.
• Highlight risks and trade-offs.
• Suggest mitigation considerations where appropriate.
• Use clear, professional engineering language.
"""

# ==============================
# LOAD EMBEDDING MODEL
# ==============================
print("Loading embedding model...")
embedder = SentenceTransformer(EMBED_MODEL_NAME)

# ==============================
# LOAD FAISS INDEX
# ==============================
index = faiss.read_index(os.path.join(FAISS_INDEX_DIR, "index.faiss"))

# ==============================
# LOAD DOCUMENT TEXTS
# ==============================
documents = []
for file in sorted(os.listdir(FAISS_INDEX_DIR)):
    if file.endswith(".txt"):
        with open(os.path.join(FAISS_INDEX_DIR, file), "r", encoding="utf-8") as f:
            documents.append(f.read())

# ==============================
# CONTEXT RETRIEVAL
# ==============================
def retrieve_context(query, k=3, threshold=0.08):
    query_embedding = embedder.encode([query])
    distances, indices = index.search(query_embedding, k)

    contexts = []
    for score, idx in zip(distances[0], indices[0]):
        if 0 <= idx < len(documents):
            similarity = 1 / (1 + score)
            if similarity >= threshold:
                contexts.append(documents[idx])

    return "\n\n".join(contexts)

# ==============================
# LLM QUERY
# ==============================
def query_llama(prompt):
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_predict": 260,   # prevents incomplete sentences
                "temperature": 0.15   # keeps responses stable
            }
        },
        timeout=120
    )

    result = response.json()
    return result.get("response", "").strip()

# ==============================
# MAIN RAG PIPELINE
# ==============================
def run_rag(question: str) -> str:

    q_lower = question.lower()

    # ---- BLOCK EXECUTION GUIDANCE ----
    execution_terms = [
        "pour concrete", "concrete pour", "slab pour",
        "construction steps", "construction method",
        "execution procedure", "site execution",
        "accelerate construction", "speed up construction",
        "reduce construction time", "expedite construction",
        "crew productivity", "equipment operators"
    ]

    if any(term in q_lower for term in execution_terms):
        return (
            "This system supports EPC pre-construction decision evaluation "
            "and does not provide construction execution guidance."
        )

    # ---- RETRIEVE CONTEXT ----
    context = retrieve_context(question)

    # ---- IF CONTEXT IS LIMITED ----
    if not context.strip():
        context = "Limited relevant pre-construction context is available. Provide a cautious engineering assessment."

    final_prompt = f"""{SYSTEM_PROMPT}

CONTEXT:
{context}

QUESTION:
{question}

ANSWER:"""

    answer = query_llama(final_prompt)

    # ---- SAFETY FILTER ----
    forbidden_output_terms = [
        "building code",
        "must comply",
        "permit approval",
        "legal requirement",
        "step-by-step procedure"
    ]

    if any(term in answer.lower() for term in forbidden_output_terms):
        return (
            "This system provides pre-construction decision insights "
            "and does not address regulatory compliance or execution procedures."
        )

    return answer