.PHONY: install test lint format run help 

BACKEND_DIR := backend
POETRY := poetry -C $(BACKEND_DIR)
PYTEST:= $(POETRY) run pytest
UVICORN:= $(POETRY) run uvicorn --app-dir src
RUFF:= $(POETRY) run ruff
COMPOSE:= docker compose

install:
	$(POETRY) install

test:
	$(PYTEST)
	
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

help:
	@echo "Comandos disponíveis:"
	@echo "  make install  - instala dependências"	
	@echo "  make test     - executa testes"
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