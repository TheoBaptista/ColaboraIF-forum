from db import SessionLocal, engine
from models import FAQ
from sqlalchemy.orm import Session

# Dados de exemplo (perguntas e respostas da página de dúvidas)
faq_data = [
    {"question": "Como realizar a matrícula?", "answer": "Você deve acessar o portal de matrículas e seguir as instruções..."},
    {"question": "Qual é o prazo para entregar os documentos?", "answer": "O prazo para entregar os documentos é até o dia..."},
    # Adicione mais perguntas aqui
]

def seed_data(db: Session):
    for item in faq_data:
        faq = FAQ(question=item["question"], answer=item["answer"])
        db.add(faq)
    db.commit()

if __name__ == "__main__":
    db = SessionLocal()
    seed_data(db)
    db.close()