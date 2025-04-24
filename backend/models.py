from sqlalchemy import Column, Integer, String,Text
from sqlalchemy.sql import func
from database import Base

class QA(Base):
    __tablename__ = "questions_answers"
    id=Column(Integer, primary_key=True, index=True)
    userId=Column(String, index=True)
    question=Column(Text, index=True)
    answer=Column(Text, index=True)
    