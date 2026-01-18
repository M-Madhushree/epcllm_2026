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
# SYSTEM PROMPT (LOCKED – NO STRUCTURE)
# ==============================
SYSTEM_PROMPT = """
You are an EPC pre-construction reasoning assistant for low- to mid-rise residential RCC buildings.

STRICT RULES:
- Use ONLY the provided context.
- Do NOT introduce assumptions, site conditions, codes, standards, regulations, or external engineering knowledge.
- Do NOT discuss execution methods, construction steps, permits, materials procurement, schedules, or site readiness.
- Do NOT explain what you cannot do or mention limitations or knowledge bases.
- Avoid references to compliance, specifications, quality assurance, or safety standards.
- Focus only on decision readiness, assumption clarity, risk awareness, and trade-offs.
- Use calm, conservative, professional EPC language.
- Write a single clear paragraph suitable for pre-construction decision review.
- Prefer concise sentences; avoid dramatic or academic wording.

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
def retrieve_context(query, k=4):
    query_embedding = embedder.encode([query])
    _, indices = index.search(query_embedding, k)

    contexts = []
    for idx in indices[0]:
        if 0 <= idx < len(documents):
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
            "stream": True,
            "options": {"num_predict": 300}
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
# MAIN RAG PIPELINE
# ==============================
def run_rag(question: str) -> str:

    # ---- INPUT SAFETY GUARD (NARROWED) ----
    forbidden_terms = [
        "how to pour",
        "pour concrete",
        "construction steps",
        "construction method",
        "execution procedure",
        "on site"
    ]

    if any(term in question.lower() for term in forbidden_terms):
        return (
            "This system is limited to EPC pre-construction decision support and does not provide site execution or construction method guidance."
        )

    # ---- RETRIEVE CONTEXT ----
    context = retrieve_context(question)

    final_prompt = f"""
{SYSTEM_PROMPT}

Context:
{context}

User Question:
{question}
"""

    raw_answer = query_llama(final_prompt)

    # ---- HARD OUTPUT FILTER ----
    forbidden_output_terms = [
        "code", "codes", "standard", "standards",
        "seismic", "earthquake",
        "regulation", "compliance",
        "permit", "authority",
        "material", "procurement",
        "schedule", "timeline",
        "important:", "knowledge base",
        "site condition", "site conditions"

    ]

    violations = sum(term in raw_answer.lower() for term in forbidden_output_terms)
    if violations >= 2:
        return (
            "Based on the available pre-construction information, the decision should be approached conservatively, as introducing unstated assumptions or external considerations at this stage may increase downstream risk."
        )

    return raw_answer
