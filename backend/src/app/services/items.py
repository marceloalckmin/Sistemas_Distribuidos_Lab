from app.models.item import Item
from app.repositories.item import ItemRepository
from app.schemas.item import ItemCreate, ItemUpdate


class ItemNotFoundError(Exception):
    pass


class ItemAlreadyExistsError(Exception):
    pass


class ItemService:
    def __init__(self, repository: ItemRepository):
        self.repository = repository

    def list_items(self) -> list[Item]:
        return self.repository.get_items()

    def get_item(self, item_id: int) -> Item:
        item = self.repository.get_by_id(item_id)
        if item is None:
            raise ItemNotFoundError
        return item

    def create_item(self, data: ItemCreate) -> Item:
        if self.repository.get_by_name(data.name):
            raise ItemAlreadyExistsError
        return self.repository.create(data.name, data.price)

    def replace_item(self, item_id: int, data: ItemCreate) -> Item:
        item = self.get_item(item_id)
        self._check_if_name_free(item, data.name)
        return self.repository.update(item, {"name": data.name, "price": data.price})

    def update_item(self, item_id: int, data: ItemUpdate) -> Item:
        item = self.get_item(item_id)
        changes = data.model_dump(exclude_unset=True)
        if "name" in changes:
            self._check_if_name_free(item, changes["name"])
        return self.repository.update(item, changes)

    def delete_item(self, item_id: int) -> None:
        item = self.get_item(item_id)
        self.repository.delete(item)

    def _check_if_name_free(self, item: Item, name: str) -> None:
        other = self.repository.get_by_name(name)
        if other is not None and other.id != item.id:
            raise ItemAlreadyExistsError
