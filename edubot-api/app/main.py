from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models import FAQ, Disciplina
from schemas import QuestionResponse
from services import query_llm

app = FastAPI()

def get_db():    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def classify_question(pergunta: str) -> str:
    prompt = f"Classifique a seguinte pergunta em uma das seguintes categorias: 'disciplinas', 'horários', 'procedimentos', 'geral'. Pergunta: {pergunta}"
    resposta = query_llm(prompt)  
    return resposta.strip()

@app.get("/perguntar", response_model=QuestionResponse)
def perguntar(pergunta: str, db: Session = Depends(get_db)):
    
    categoria = classify_question(pergunta)

    if categoria == "disciplinas":
        curso = extract_curso(pergunta)  # Implementar lógica para extrair o curso
        disciplinas = db.query(Disciplina).filter(Disciplina.curso == curso).all()
        return {"disciplinas": [d.nome for d in disciplinas]}
    
    elif categoria == "horários":
        # Implementar a lógica para buscar horários
        horarios = ... 
        return {"horários": horarios}
    
    elif categoria == "procedimentos":
        faq = db.query(FAQ).filter(FAQ.question.ilike(f"%{pergunta}%")).first()
        if faq:
            return {"resposta": faq.answer}
        else:
            return {"resposta": "Desculpe, não consegui encontrar informações sobre procedimentos."}
    
    else:
        # Se a pergunta não se encaixar, pedir negativa de retorno do LLM
        resposta = query_llm(pergunta)
        return {"pergunta": pergunta, "resposta": resposta}