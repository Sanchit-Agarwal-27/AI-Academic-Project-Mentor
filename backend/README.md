# AI Academic Project Mentor Backend

## Setup

From the `backend` directory:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create the MySQL database:

```sql
CREATE DATABASE mentor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `SECRET_KEY`. Run the migration, start the server, and run tests:

```powershell
Copy-Item .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
pytest
```

## API examples

Register:

```powershell
curl.exe -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test Student\",\"email\":\"student@example.com\",\"password\":\"password123\"}"
```

Login:

```powershell
curl.exe -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"student@example.com\",\"password\":\"password123\"}"
```

Use the returned access token:

```powershell
curl.exe http://localhost:8000/api/auth/me -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
