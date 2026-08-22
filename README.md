\# Job Application Tracker



Aplicação fullstack para gerenciar candidaturas de emprego, com backend em FastAPI e frontend em React + TypeScript.



\## Funcionalidades

\- Cadastro e login de usuário com autenticação JWT

\- CRUD completo de candidaturas (criar, listar, editar status, deletar)

\- Senhas protegidas com hash bcrypt



\## Stack



\*\*Backend\*\*

\- Python + FastAPI

\- PostgreSQL + SQLAlchemy

\- JWT (python-jose) + Passlib/bcrypt



\*\*Frontend\*\*

\- React + TypeScript

\- Vite

\- Axios + React Router



\## Estrutura do projeto



job-tracker/

├── backend/ # API FastAPI

└── frontend/ # Interface React





\## Como rodar localmente



\### Backend

1\. `cd backend`

2\. `python -m venv venv` e ative com `venv\\Scripts\\activate`

3\. `pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose passlib bcrypt python-multipart email-validator`

4\. Configure sua conexão com o PostgreSQL no `database.py`

5\. `python create\_tables.py`

6\. `uvicorn main:app --reload`



\### Frontend

1\. `cd frontend`

2\. `npm install`

3\. `npm run dev`



\## Status

Em desenvolvimento — próximos passos: Docker Compose, testes automatizados e deploy.

