from fastapi.testclient import TestClient

from app.main import app


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


def create(client, name="Cafe", price=12.5):
    return client.post("/items/", json={"name": name, "price": price})


def test_list_items_empty(client):
    response = client.get("/items/")

    assert response.status_code == 200
    assert response.json() == []


def test_create_item(client):
    response = create(client)

    assert response.status_code == 201
    assert response.json() == {"id": 1, "name": "Cafe", "price": 12.5}


def test_create_item_invalid(client):
    response = client.post("/items/", json={"price": 1.0})

    assert response.status_code == 422


def test_create_item_duplicate_name(client):
    create(client)
    response = create(client)

    assert response.status_code == 409


def test_list_items_after_create(client):
    create(client, "Cafe")
    create(client, "Cha")

    response = client.get("/items/")

    assert response.status_code == 200
    assert [i["name"] for i in response.json()] == ["Cafe", "Cha"]


def test_get_item_by_id(client):
    item_id = create(client).json()["id"]

    response = client.get(f"/items/{item_id}")

    assert response.status_code == 200
    assert response.json()["name"] == "Cafe"


def test_get_item_not_found(client):
    response = client.get("/items/9999")

    assert response.status_code == 404


def test_get_item_invalid_id(client):
    response = client.get("/items/abc")

    assert response.status_code == 422


def test_replace_item(client):
    item_id = create(client).json()["id"]

    response = client.put(f"/items/{item_id}", json={"name": "Novo", "price": 1.0})

    assert response.status_code == 200
    assert response.json() == {"id": item_id, "name": "Novo", "price": 1.0}


def test_replace_item_not_found(client):
    response = client.put("/items/9999", json={"name": "X", "price": 1.0})

    assert response.status_code == 404


def test_patch_item_keeps_other_fields(client):
    item_id = create(client).json()["id"]

    response = client.patch(f"/items/{item_id}", json={"price": 20.0})

    assert response.status_code == 200
    assert response.json() == {"id": item_id, "name": "Cafe", "price": 20.0}


def test_delete_item(client):
    item_id = create(client).json()["id"]

    response = client.delete(f"/items/{item_id}")

    assert response.status_code == 204
    assert client.get(f"/items/{item_id}").status_code == 404


def test_delete_item_not_found(client):
    response = client.delete("/items/9999")

    assert response.status_code == 404


def soma(a, b):
    return a + b


def test_soma():
    assert soma(2, 3) == 5
