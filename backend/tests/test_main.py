import pytest
from fastapi.testclient import TestClient

from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_home_retorna_200(client):
    response = client.get("/")
 
    assert response.status_code == 200
 
 
def test_home_retorna_mensagem(client):
    response = client.get("/")
 
    assert response.json() == {"message": "Olá, Sistemas Distribuídos!"}
 
 
@pytest.mark.parametrize("nome", ["Marcelo", "Maria", "João"])
def test_hello_com_nome(client, nome):
    response = client.get(f"/hello/{nome}")
 
    assert response.status_code == 200
    assert response.json() == {"message": f"Olá, {nome}!"}
 
 
def test_status_online(client):
    response = client.get("/status")
 
    assert response.status_code == 200
    assert response.json() == {"status": "online"}

def test_rotas_inexistentes_retornam_404(client):
    response = client.get("/sadfasdfsadfasdfasfqw")
 
    assert response.status_code == 404

def soma(a, b):
    return a + b


def test_soma():
    assert soma(2, 3) == 5
