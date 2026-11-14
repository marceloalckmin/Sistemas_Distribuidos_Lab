.PHONY: install test lint format run help up up-build build down clean ps logs api-logs db-upgrade db-migration db-current frontend-install frontend-dev frontend-lint frontend-format frontend-check frontend-test frontend-test-e2e frontend-build e2e check-all

BACKEND_DIR := backend
NPM := npm --prefix frontend
POETRY := poetry -C $(BACKEND_DIR)
PYTEST:= $(POETRY) run pytest
UVICORN:= $(POETRY) run uvicorn --app-dir src
RUFF:= $(POETRY) run ruff
COMPOSE:= docker compose
E2E_COMPOSE:= $(COMPOSE) -p lab-e2e

install:
	$(POETRY) install

test:
	$(PYTEST) -v

lint:
	$(RUFF) check .

format:
	$(RUFF) format .

run:
	$(UVICORN) app.main:app --reload

up:
	$(COMPOSE) up -d

up-build:
	$(COMPOSE) up -d --build

build:
	$(COMPOSE) build

down:
	$(COMPOSE) down

clean:
	$(COMPOSE) down -v

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f

api-logs:
	$(COMPOSE) logs -f api

# Alembic roda DENTRO do contêiner da api (lá o banco é acessível como "db")
db-upgrade:
	$(COMPOSE) exec -T api alembic upgrade head

db-current:
	$(COMPOSE) exec -T api alembic current

# Gera a migration no host (o arquivo precisa ir para o seu repositório),
# acessando o banco pela porta publicada em localhost
db-migration:
	DATABASE_URL=postgresql+psycopg://app:app@localhost:5432/app $(POETRY) run alembic revision --autogenerate -m "$(msg)"

frontend-install:
	$(NPM) ci

frontend-dev:
	$(NPM) run dev

frontend-lint:
	$(NPM) run lint

frontend-format:
	$(NPM) run format

frontend-check:
	$(NPM) run lint
	$(NPM) run format:check

frontend-test:
	$(NPM) run test

frontend-test-e2e:
	$(NPM) run test:e2e

frontend-build:
	$(NPM) run build

# E2E full-stack em uma stack ISOLADA da de desenvolvimento:
# projeto Compose próprio (lab-e2e), outras portas e volume próprio do banco.
# Ao final, "down -v" apaga tudo; o banco de desenvolvimento nunca é tocado.
e2e: export PORT_API := 8001
e2e: export FRONTEND_PORT := 5174
e2e: export POSTGRES_PORT := 5433
e2e: export E2E_BASE_URL := http://localhost:5174
e2e:
	$(E2E_COMPOSE) up -d --build --wait && \
	$(E2E_COMPOSE) exec -T api alembic upgrade head && \
	$(NPM) run test:e2e; \
	status=$$?; $(E2E_COMPOSE) down -v; exit $$status

# Exige Docker (por causa do e2e)
check-all: lint test frontend-check frontend-test frontend-build e2e

help:
	@echo "Comandos disponíveis:"
	@echo "  make install  - instala dependências"	
	@echo "  make test     - executa testes"
	@echo "  make test-verbose - executa testes mostrando mais informações dos resultados"
	@echo "  make lint     - verifica o código"
	@echo "  make format   - formata o código"
	@echo "  make run      - inicia o servidor"
	@echo "	 make up	   - sobe os containeres"
	@echo "	 make up-build - rebuilda as imagens e sobe db, api e frontend"
	@echo "	 make build    - faz o build a imagem dos containeres"
	@echo "	 make down     - para e remove os containeres"
	@echo "	 make clean    - derruba os containers e limpa os volumes"
	@echo "	 make ps       - mostra os status dos containeres"
	@echo "	 make logs     - mostra os logs do compose"
	@echo "	 make api-logs - mostra os logs do container da api"
	@echo "	 make db-upgrade - aplica as migrations (Alembic)"
	@echo "	 make e2e      - testes E2E full-stack em stack isolada"
	@echo "	 make check-all - lint, testes, build e E2E (exige Docker)"
