import json
import os
import faiss
import requests
from sentence_transformers import SentenceTransformer

# ==============================
# OFFLINE MODE
# ==============================
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

# ==============================
# PATHS (BACKEND-LOCAL)
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
# STRICT SYSTEM PROMPT
# ==============================
SYSTEM_PROMPT = """
You are an EPC pre-construction reasoning assistant for low- to mid-rise residential RCC buildings.

STRICT RULES:
- Use ONLY the provided context
- Do NOT introduce assumptions or site conditions
- Decision support only (no execution guidance)
- Conservative, safety-first reasoning
- No numerical calculations
- Keep responses concise and engineering-focused

Respond using EXACTLY this format:

Project Context:
Design Analysis:
Safety Considerations:
Cost Implications:
Risks Identified:
Recommendation:
"""

# ==============================
# LOAD EMBEDDING MODEL
# ==============================
embedder = SentenceTransformer(EMBED_MODEL_NAME)

# ==============================
# LOAD FAISS INDEX
# ==============================
index = faiss.read_index(os.path.join(FAISS_INDEX_DIR, "index.faiss"))

# ==============================
# LOAD STORED DOCUMENT TEXTS
# (ORDER MUST MATCH INDEX BUILD)
# ==============================
documents = []
for file in sorted(os.listdir(FAISS_INDEX_DIR)):
    if file.endswith(".txt"):
        with open(os.path.join(FAISS_INDEX_DIR, file), "r", encoding="utf-8") as f:
            documents.append(f.read())

# ==============================
# CONTEXT RETRIEVAL
# ==============================
def retrieve_context(query, k=2):
    query_embedding = embedder.encode([query])
    _, indices = index.search(query_embedding, k)

    contexts = []
    for idx in indices[0]:
        if 0 <= idx < len(documents):
            contexts.append(documents[idx])

    return "\n\n".join(contexts)

# ==============================
# LLM QUERY (CONTROLLED)
# ==============================
def query_llama(prompt):
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": True,
            "options": {
                "num_predict": 220
            }
        },
        stream=True,
        timeout=120
    )

    answer = ""

    for line in response.iter_lines():
        if not line:
            continue

        data = json.loads(line.decode("utf-8"))

        if "response" in data:
            answer += data["response"]

        if data.get("done", False):
            break

    return answer.strip()

# ==============================
# FULL RAG PIPELINE (GUARDED)
# ==============================
def run_rag(question: str) -> str:
    # ---- HARD SAFETY GUARD ----
    forbidden_keywords = [
        "how to", "pour", "pouring", "on site", "site",
        "execute", "execution", "procedure", "steps",
        "construction method", "pcc", "rcc work"
    ]

    q_lower = question.lower()

    if any(word in q_lower for word in forbidden_keywords):
        return (
            "Project Context:\n"
            "This system is limited to EPC pre-construction decision support.\n\n"
            "Design Analysis:\n"
            "Execution-level construction methods fall outside the defined scope.\n\n"
            "Safety Considerations:\n"
            "Providing on-site construction instructions may introduce safety and liability risks.\n\n"
            "Cost Implications:\n"
            "Execution guidance depends on contractor methods, approvals, and site conditions.\n\n"
            "Risks Identified:\n"
            "Responding to execution questions could lead to unsafe or non-compliant practices.\n\n"
            "Recommendation:\n"
            "Please reframe the question to focus on pre-construction decisions, assumptions, or risks."
        )

    # ---- NORMAL RAG FLOW ----
    context = retrieve_context(question)

    final_prompt = f"""
{SYSTEM_PROMPT}

Context:
{context}

User Question:
{question}

Answer ONLY using the provided context and required format.
"""

    return query_llama(final_prompt)
