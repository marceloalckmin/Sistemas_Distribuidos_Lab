from fastapi import APIRouter
from backend.src.app.api.schemas.item import Item

router = APIRouter(prefix="/items", tags=["Items"])

@router.get("/")
def get_items():
    return [{"id": 1, "name": "Monster Branco", "price": 10.0}]

@router.get("/{id}")
def get_item(id: int):
    return {"id": id, "name": f"Item {id}", "price": 10.0}

@router.post("/")
def create_item(item: Item):
    return item

@router.patch("/{item_id}/{price}")
def replace_item(item_id: int, item: Item, price: float):
    return {"id": item_id, "name": item.name, "price": price}

@router.put("/{item_id}")
def replace_item(item_id: int, item: Item):
    return {"id": item_id, "name": item.name, "price": item.price}

@router.delete("/{item_id}")
def delete_item(item_id: int):
    return {"message": f"Item {item_id} deletado com sucesso!"}