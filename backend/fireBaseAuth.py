import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, status
data="backend/firebaseServiceAccount.json"
cred = credentials.Certificate("firebaseServiceAccount.json")
firebase_admin.initialize_app(cred)

def verifyToken(token:str):
    try:
        decodedToken=auth.verify_id_token(token)
        return decodedToken["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    