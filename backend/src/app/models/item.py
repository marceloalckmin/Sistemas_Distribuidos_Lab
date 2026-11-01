from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base

class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    price: Mapped[float | None] = mapped_column(default=None)