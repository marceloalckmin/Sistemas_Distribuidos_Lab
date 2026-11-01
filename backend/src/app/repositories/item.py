from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.item import Item


class ItemRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, price: float | None) -> Item:
        item = Item(name=name, price=price)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def get_by_id(self, item_id: int) -> Item | None:
        return self.db.get(Item, item_id)

    def get_by_name(self, name: str) -> Item | None:
        return self.db.scalar(select(Item).where(Item.name == name))

    def get_items(self) -> list[Item]:
        statement = select(Item).order_by(Item.id)
        return list(self.db.scalars(statement))

    def update(self, item: Item, changes: dict) -> Item:
        for field, value in changes.items():
            setattr(item, field, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item: Item) -> None:
        self.db.delete(item)
        self.db.commit()
