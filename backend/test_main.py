import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from database import Base, get_db

import os

TEST_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Crislino123@localhost:5432/job_tracker_test")

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_and_teardown():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_register_user():
    response = client.post("/register", json={"email": "teste@teste.com", "password": "senha123"})
    assert response.status_code == 200
    assert response.json()["message"] == "Usuário criado com sucesso"


def test_register_duplicate_email():
    client.post("/register", json={"email": "teste@teste.com", "password": "senha123"})
    response = client.post("/register", json={"email": "teste@teste.com", "password": "outrasenha"})
    assert response.status_code == 400


def test_login_success():
    client.post("/register", json={"email": "teste@teste.com", "password": "senha123"})
    response = client.post("/login", json={"email": "teste@teste.com", "password": "senha123"})
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password():
    client.post("/register", json={"email": "teste@teste.com", "password": "senha123"})
    response = client.post("/login", json={"email": "teste@teste.com", "password": "errada"})
    assert response.status_code == 401


def get_auth_token():
    client.post("/register", json={"email": "teste@teste.com", "password": "senha123"})
    response = client.post("/login", json={"email": "teste@teste.com", "password": "senha123"})
    return response.json()["access_token"]


def test_create_application():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/applications", headers=headers, json={
        "company": "Empresa Teste",
        "role": "Dev Júnior",
        "status": "aplicado",
        "applied_date": "2026-08-22"
    })
    assert response.status_code == 200
    assert response.json()["company"] == "Empresa Teste"


def test_list_applications():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    client.post("/applications", headers=headers, json={
        "company": "Empresa Teste",
        "role": "Dev Júnior",
        "status": "aplicado",
        "applied_date": "2026-08-22"
    })
    response = client.get("/applications", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_create_application_without_auth():
    response = client.post("/applications", json={
        "company": "Empresa Teste",
        "role": "Dev Júnior",
        "status": "aplicado",
        "applied_date": "2026-08-22"
    })
    assert response.status_code == 401