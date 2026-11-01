.PHONY: install test lint format run help up build down clean ps logs api-logs db-upgrade db-migration db-current frontend-install frontend-dev frontend-lint frontend-format frontend-check frontend-test frontend-test-e2e frontend-build check-all

BACKEND_DIR := backend
NPM := npm --prefix frontend
POETRY := poetry -C $(BACKEND_DIR)
PYTEST:= $(POETRY) run pytest
UVICORN:= $(POETRY) run uvicorn --app-dir src
RUFF:= $(POETRY) run ruff
COMPOSE:= docker compose

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

db-upgrade:
	$(POETRY) run alembic upgrade head

db-migration:
	$(POETRY) run alembic revision --autogenerate -m "$(msg)"

db-current:
	$(POETRY) run alembic current

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

check-all: 
	lint test frontend-check frontend-test frontend-build frontend-test-e2e

help:
	@echo "Comandos disponíveis:"
	@echo "  make install  - instala dependências"	
	@echo "  make test     - executa testes"
	@echo "  make test-verbose - executa testes mostrando mais informações dos resultados"
	@echo "  make lint     - verifica o código"
	@echo "  make format   - formata o código"
	@echo "  make run      - inicia o servidor"
	@echo "	 make up	   - sobre os containeres"
	@echo "	 make build    - faz o build a imagem dos containeres"
	@echo "	 make down     - para e remove os containeres"
	@echo "	 make clean    - derruba os containers e limpa os volumes"
	@echo "	 make ps       - mostra os status dos containeres"
	@echo "	 make logs     - mostra os logs do compose"
	@echo "	 make api-logs - mostra os logs do container da api"