from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.dependencies import get_current_user
import random

router = APIRouter()
db = AsyncIOMotorClient(settings.MONGO_URI).ecommerce

@router.get("/personalized")
async def personalized_recommendations(user = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": user["user_id"]})
    orders = await db.orders.find({"user_id": user["user_id"]}).to_list(10)

    interacted_ids = []
    if cart:
        interacted_ids.extend([item.get("product_id") for item in cart.get("items", [])])
    for order in orders:
        interacted_ids.extend([item.get("product_id") for item in order.get("items", [])])

    if interacted_ids:
        pipeline = [
            {"$match": {"_id": {"$nin": interacted_ids}}},
            {"$lookup": {
                "from": "products",
                "localField": "category",
                "foreignField": "category",
                "as": "same_cat"
            }},
            {"$match": {"same_cat": {"$ne": []}}},
            {"$limit": 6}
        ]
        recs = await db.products.aggregate(pipeline).to_list(6)
    else:
        recs = await db.products.find().limit(6).to_list(None)

    random.shuffle(recs)
    return {"recommendations": [
        {
            "_id": str(p["_id"]),
            "name": p["name"],
            "price": p["price"],
            "image": p.get("image", ""),
            "category": p["category"]
        } for p in recs
    ]}