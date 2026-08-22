from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List

from database import get_db, engine, Base
import models
import schemas
import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Job Application Tracker")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_access_token(credentials.credentials)

    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    user = db.query(models.User).filter(models.User.email == payload.get("sub")).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return user


@app.get("/")
def home():
    return {"status": "API rodando, mermão"}


@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    new_user = models.User(email=user.email, password_hash=auth.hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Usuário criado com sucesso", "id": new_user.id}


@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    token = auth.create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/applications", response_model=schemas.ApplicationOut)
def create_application(app_data: schemas.ApplicationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_app = models.Application(**app_data.dict(), user_id=current_user.id)
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app


@app.get("/applications", response_model=List[schemas.ApplicationOut])
def list_applications(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Application).filter(models.Application.user_id == current_user.id).all()


@app.put("/applications/{app_id}", response_model=schemas.ApplicationOut)
def update_application(app_id: int, app_data: schemas.ApplicationUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    application = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == current_user.id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    for field, value in app_data.dict(exclude_unset=True).items():
        setattr(application, field, value)
    db.commit()
    db.refresh(application)
    return application


@app.delete("/applications/{app_id}")
def delete_application(app_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    application = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == current_user.id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    db.delete(application)
    db.commit()
    return {"message": "Vaga deletada com sucesso"}