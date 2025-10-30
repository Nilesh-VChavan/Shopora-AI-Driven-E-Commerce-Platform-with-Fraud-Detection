from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

router = APIRouter()
db = AsyncIOMotorClient(settings.MONGO_URI).ecommerce

@router.get("/")
async def list_products(
    search: str = "", 
    category: str = "", 
    min_price: float = 0, 
    max_price: float = 10000,
    tags: str = ""
):
    query = {"price": {"$gte": min_price, "$lte": max_price}}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    if category:
        query["category"] = category
    if tags:
        query["tags"] = {"$in": [t.strip() for t in tags.split(",") if t.strip()]}

    products = await db.products.find(query).to_list(100)
    return [
        {
            "_id": str(p["_id"]),
            "name": p["name"],
            "category": p["category"],
            "price": p["price"],
            "tags": p.get("tags", []),
            "description": p.get("description", ""),
            "image": p.get("image", ""),
            "stock": p.get("stock", 0)
        } for p in products
    ]