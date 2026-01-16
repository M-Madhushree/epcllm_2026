export async function askEpcBackend(question: string): Promise<string> {
    const response = await fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
  
    if (!response.ok) {
      throw new Error("Backend error");
    }
  
    const data = await response.json();
    return data.answer;
  }
  