import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, engine
from models import Base, QA
from utils import extractText, generateText
from fireBaseAuth import verifyToken

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

userPdf = {}

@app.post("/upload_pdf")
def upload(file: UploadFile = File(...), authorization: str = Header(...)):
    """Endpoint to upload a PDF file."""
    uid = verifyToken(authorization)  

   
    if uid in userPdf:
        try:
            os.remove(userPdf[uid])  # Delete old file
        except FileNotFoundError:
            pass

  
    filepath = os.path.join(UPLOAD_DIR, f"{uid}.pdf")
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    userPdf[uid] = filepath  
    return {"message": "File uploaded successfully"}

@app.post("/ask")
def ask(question: str = Form(...), authorization: str = Header(...), db: Session = Depends(get_db)):
    """Endpoint to ask a question and get an answer from the uploaded PDF."""
    uid = verifyToken(authorization)  
    if uid not in userPdf:
        raise HTTPException(status_code=400, detail="No PDF uploaded")

   
    filePath = userPdf[uid]
    extracted_text = extractText(filePath)
    
 
    answer = generateText(question, extracted_text)

   
    qa = QA(userId=uid, question=question, answer=answer)
    db.add(qa)
    db.commit()
    db.refresh(qa)
    print(answer)
    return {"response": answer}