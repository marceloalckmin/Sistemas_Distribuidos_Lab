.PHONY: install test lint format run help 

BACKEND_DIR := backend
POETRY := poetry -C $(BACKEND_DIR)
PYTEST:= $(POETRY) run pytest
UVICORN:= $(POETRY) run uvicorn
RUFF:= $(POETRY) run ruff

install:
	$(POETRY) install

test:
	$(PYTEST)
	
lint:
	$(RUFF) check .

format:
	$(RUFF) format .

run:
	$(UVICORN) main:app --reload

help:
	@echo "Comandos disponíveis:"
	@echo "  make install  - instala dependências"
	@echo "  make test     - executa testes"
	@echo "  make lint     - verifica o código"
	@echo "  make format   - formata o código"
	@echo "  make run      - inicia o servidor"