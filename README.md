# Lab — Prática 7 (Full-stack: React + FastAPI + PostgreSQL)

## Subir a stack

```bash
cp .env.example .env     # primeira vez
make up-build            # db + api + frontend
make db-upgrade          # aplica as migrations (Alembic)
```

- Frontend: <http://localhost:5173>
- API / Swagger: <http://localhost:8000/docs>

## Qualidade

| Comando | Função |
| --- | --- |
| `make test` | testes do backend (Pytest) |
| `make frontend-test` | Vitest (unitários e integração, `fetch` mockado) |
| `make e2e` | E2E full-stack em stack isolada (`lab-e2e`, portas 8001/5174) |
| `make check-all` | lint, testes, build e E2E (exige Docker) |
