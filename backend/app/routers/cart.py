from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.dependencies import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter()
db = AsyncIOMotorClient(settings.MONGO_URI).ecommerce

@router.post("/add")
async def add_to_cart(item: dict, user = Depends(get_current_user)):
    
    try:
        product_id = ObjectId(item["product_id"])
    except:
        raise HTTPException(400, "Invalid product ID")

    product = await db.products.find_one({"_id": product_id})
    if not product or product.get("stock", 0) <= 0:
        raise HTTPException(400, "Out of stock")

    
    cart = await db.carts.find_one({"user_id": user["user_id"]})
    if cart:
        for i in cart["items"]:
            if ObjectId(i["product_id"]) == product_id:
                if i["quantity"] >= product["stock"]:
                    raise HTTPException(400, "Not enough stock")
                await db.carts.update_one(
                    {"user_id": user["user_id"], "items.product_id": item["product_id"]},
                    {"$inc": {"items.$.quantity": 1}}
                )
                await db.products.update_one({"_id": product_id}, {"$inc": {"stock": -1}})
                return {"message": "Quantity updated"}

    
    await db.carts.update_one(
        {"user_id": user["user_id"]},
        {"$push": {"items": {**item, "quantity": 1}}},
        upsert=True
    )
    await db.products.update_one({"_id": product_id}, {"$inc": {"stock": -1}})
    return {"message": "Added to cart"}

@router.post("/update-qty")
async def update_qty(data: dict, user = Depends(get_current_user)):
    try:
        product_id = ObjectId(data["product_id"])
    except:
        raise HTTPException(400, "Invalid product ID")

    product = await db.products.find_one({"_id": product_id})
    if data["quantity"] > product["stock"]:
        raise HTTPException(400, "Not enough stock")


    cart_item = await db.carts.find_one(
        {"user_id": user["user_id"], "items.product_id": data["product_id"]},
        {"items.$": 1}
    )
    old_qty = cart_item["items"][0]["quantity"] if cart_item else 0
    diff = data["quantity"] - old_qty

    await db.carts.update_one(
        {"user_id": user["user_id"], "items.product_id": data["product_id"]},
        {"$set": {"items.$.quantity": data["quantity"]}}
    )
    await db.products.update_one(
        {"_id": product_id},
        {"$inc": {"stock": -diff}}
    )
    return {"message": "Updated"}

@router.get("/")
async def get_cart(user = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": user["user_id"]})
    items = cart.get("items", []) if cart else []
    total = sum(i["price"] * i["quantity"] for i in items)
    return {"items": items, "total": total, "count": len(items)}