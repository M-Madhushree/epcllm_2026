from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from rag_engine import run_rag

app = FastAPI(title="EPC LLM Backend")

# ==============================
# CORS CONFIGURATION
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# REQUEST / RESPONSE MODELS
# ==============================
class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str

# ==============================
# API ENDPOINT
# ==============================
@app.post("/ask", response_model=QueryResponse)
def ask_epc_ai(request: QueryRequest):
    answer = run_rag(request.question)
    return {"answer": answer}

@app.get("/")
def health_check():
    return {"status": "EPC backend running"}
