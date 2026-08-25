# Job Application Tracker

![Tests](https://github.com/joaovitorlinoferreira-ui/job-application-tracker/actions/workflows/tests.yml/badge.svg)

Aplicacao fullstack para gerenciar candidaturas de emprego, com backend em FastAPI e frontend em React + TypeScript. Totalmente containerizada com Docker e publicada em producao.

**[Acesse o projeto ao vivo](https://job-application-tracker-virid-five.vercel.app)**

## Funcionalidades

- Cadastro e login de usuario com autenticacao JWT
- CRUD completo de candidaturas (criar, listar, editar status, deletar)
- Senhas protegidas com hash bcrypt
- Testes automatizados (Pytest)

## Stack

**Backend**
- Python + FastAPI
- PostgreSQL + SQLAlchemy
- JWT (python-jose) + Passlib/bcrypt
- Pytest

**Frontend**
- React + TypeScript
- Vite
- Axios + React Router

**Infra**
- Docker + Docker Compose
- Deploy: Render (backend + PostgreSQL) e Vercel (frontend)

## Estrutura do projeto

job-tracker/
├── backend/ # API FastAPI
├── frontend/ # Interface React
└── docker-compose.yml # Orquestracao dos containers


## Como rodar localmente

### Com Docker (recomendado)

```bash
docker compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

### Sem Docker

**Backend**
1. `cd backend`
2. `python -m venv venv` e ative com `venv\Scripts\activate`
3. `pip install -r requirements.txt`
4. Configure sua conexao com o PostgreSQL no `database.py`
5. `uvicorn main:app --reload`

**Frontend**
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Status

- Backend, frontend, banco de dados e Docker Compose funcionando end-to-end
- Deploy em producao (Render + Vercel)
- Proximos passos: testes E2E, refinamento de UI
