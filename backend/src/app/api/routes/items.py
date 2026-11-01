from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories.item import ItemRepository
from app.schemas.item import ItemCreate, ItemRead, ItemUpdate
from app.services.items import (
    ItemAlreadyExistsError,
    ItemNotFoundError,
    ItemService,
)

router = APIRouter(prefix="/items", tags=["Items"])


def get_service(db: Session = Depends(get_db)) -> ItemService:
    return ItemService(ItemRepository(db))


NOT_FOUND = HTTPException(status_code=404, detail="Item não encontrado")
CONFLICT = HTTPException(status_code=409, detail="Já existe um item com esse nome")


@router.get("/", response_model=list[ItemRead])
def list_items(service: ItemService = Depends(get_service)):
    return service.list_items()


@router.get("/{item_id}", response_model=ItemRead)
def get_item(item_id: int, service: ItemService = Depends(get_service)):
    try:
        return service.get_item(item_id)
    except ItemNotFoundError:
        raise NOT_FOUND


@router.post("/", response_model=ItemRead, status_code=201)
def create_item(item: ItemCreate, service: ItemService = Depends(get_service)):
    try:
        return service.create_item(item)
    except ItemAlreadyExistsError:
        raise CONFLICT


@router.put("/{item_id}", response_model=ItemRead)
def replace_item(
    item_id: int, item: ItemCreate, service: ItemService = Depends(get_service)
):
    try:
        return service.replace_item(item_id, item)
    except ItemNotFoundError:
        raise NOT_FOUND
    except ItemAlreadyExistsError:
        raise CONFLICT


@router.patch("/{item_id}", response_model=ItemRead)
def update_item(
    item_id: int, item: ItemUpdate, service: ItemService = Depends(get_service)
):
    try:
        return service.update_item(item_id, item)
    except ItemNotFoundError:
        raise NOT_FOUND
    except ItemAlreadyExistsError:
        raise CONFLICT


@router.delete("/{item_id}", status_code=204)
def delete_item(item_id: int, service: ItemService = Depends(get_service)):
    try:
        service.delete_item(item_id)
    except ItemNotFoundError:
        raise NOT_FOUND
