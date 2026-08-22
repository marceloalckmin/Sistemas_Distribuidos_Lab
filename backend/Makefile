.PHONY: install test lint format run help 

PYTEST:= poetry run pytest
UVICORN:= poetry run uvicorn
RUFF:= poetry run ruff

install:
	poetry install

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