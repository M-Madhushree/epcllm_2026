import json
import os
import faiss
import requests
from sentence_transformers import SentenceTransformer

# ==============================
# CONFIG (MATCH YOUR REAL FILES)
# ==============================
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "phi3:mini"
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"

DATA_DIR = r"D:\Personal Files\Projects\EPC MODEL TRAINING\pre_construction"
FAISS_INDEX_DIR = os.path.join(DATA_DIR, "faiss_index")

# ==============================
# LOAD EMBEDDING MODEL
# ==============================
embedder = SentenceTransformer(EMBED_MODEL_NAME)

# ==============================
# LOAD TEXT DOCUMENTS (pc_*.txt)
# ==============================
documents = []
doc_names = []

for file in sorted(os.listdir(DATA_DIR)):
    if file.startswith("pc_") and file.endswith(".txt"):
        with open(os.path.join(DATA_DIR, file), "r", encoding="utf-8") as f:
            documents.append(f.read())
            doc_names.append(file)

# ==============================
# LOAD FAISS INDEX
# ==============================
index = faiss.read_index(os.path.join(FAISS_INDEX_DIR, "index.faiss"))

# ==============================
# RETRIEVE CONTEXT
# ==============================
def retrieve_context(query, k=1):
    query_embedding = embedder.encode([query])
    _, indices = index.search(query_embedding, k)

    contexts = []
    for idx in indices[0]:
        if idx < len(documents):
            contexts.append(documents[idx])

    return "\n\n".join(contexts)

# ==============================
# QUERY LLM (SAFE & LIMITED)
# ==============================
def query_llama(prompt):
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": True,
            "options": {
                "num_predict": 250
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
# FULL RAG PIPELINE
# ==============================
def run_rag(question):
    context = retrieve_context(question)

    prompt = f"""
You are an EPC construction assistant.
Answer conservatively and professionally.

Context:
{context}

Question:
{question}

Answer:
"""

    return query_llama(prompt)
