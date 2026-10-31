import pytest
from fastapi.testclient import TestClient

from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

"""
testes antigos
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
"""

def test_list_items(client):
    response = client.get("/items/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.parametrize("item_id", [1, 2, 3])
def test_get_item_by_id(client, item_id):
    response = client.get(f"/items/{item_id}")

    assert response.status_code == 200
    assert response.json()["id"] == item_id


def test_create_item(client):
    payload = {"name": "Café", "price": 10.0}
    response = client.post("/items/", json=payload)

    assert response.status_code == 200
    assert response.json()["name"] == "Café"

def test_delete_item(client):
    response = client.delete("/items/5")

    assert response.status_code == 200

def test_replace_item(client):
    payload = {"name": "Café", "price": 12.5}
    response = client.put("/items/5", json=payload)

    assert response.status_code == 200
    assert response.json() == {"id": 5, "name": "Café", "price": 12.5}

def test_patch_item(client):
    payload = {"name": "Café", "price": 1.0}
    response = client.patch("/items/5/20.5", json=payload)

    assert response.status_code == 200
    assert response.json() == {"id": 5, "name": "Café", "price": 20.5}


def soma(a, b):
    return a + b


def test_soma():
    assert soma(2, 3) == 5
