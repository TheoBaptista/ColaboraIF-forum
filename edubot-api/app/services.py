from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY_LLM")

client = OpenAI(base_url="http://localhost:1234/v1", api_key=API_KEY)

def query_llm(question: str) -> str:
    history = [
        {
            "role": "system",
            "content": (
                "Você é um assistente do IFRS (Instituto Federal do Rio Grande do Sul) e vai ajudar outros estudantes com dúvidas sobre procedimentos do IFRS."
                "Respondendo em português brasileiro, com uma linguagem clara e amigável."
            ),
        },
        {"role": "user", "content": question}
    ]
    
    completion = client.chat.completions.create(
        model="model-identifier",  
        messages=history,
        temperature=0.5,  
        top_p=0.9, 
        max_tokens=150,
    )

    return completion.choices[0].message["content"]