\# Job Application Tracker



API REST para gerenciar candidaturas de emprego, feita com FastAPI + PostgreSQL.



\## Funcionalidades

\- Cadastro e login de usuário com autenticação JWT

\- CRUD completo de candidaturas (criar, listar, editar, deletar)

\- Senhas protegidas com hash bcrypt



\## Stack

\- Python + FastAPI

\- PostgreSQL + SQLAlchemy

\- JWT (python-jose) + Passlib/bcrypt

\- Pydantic



\## Como rodar localmente

1\. Clone o repositório

2\. Crie o ambiente virtual: `python -m venv venv`

3\. Ative: `venv\\Scripts\\activate`

4\. Instale as dependências: `pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose passlib bcrypt python-multipart email-validator`

5\. Configure sua conexão com o PostgreSQL no `database.py`

6\. Crie as tabelas: `python create\_tables.py`

7\. Rode: `uvicorn main:app --reload`

8\. Acesse a documentação em `http://127.0.0.1:8000/docs`



\## Status

Em desenvolvimento — próximos passos: frontend em React, Docker Compose e deploy.

