import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, engine
from models import Base, QA
from utils import extractText, pdfPrepare
from fireBaseAuth import verifyToken

