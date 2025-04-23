from sqlalchemy import column, Integer, String,Text
from sqlalchemy.sql import func
from database import Base

class QA(Base):
    __tablename__ = "questions_answers"
    id=column(Integer, primary_key=True, index=True)
    userId=column(String, index=True)
    question=column(Text, index=True)
    answer=column(Text, index=True)
    