from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.dependencies import get_current_user
from datetime import datetime
import joblib  
import numpy as np  

router = APIRouter()
db = AsyncIOMotorClient(settings.MONGO_URI).ecommerce

# Load model ###
model = joblib.load('models/fraud_model.pkl')
scaler = joblib.load('models/scaler.pkl')

@router.post("/place")
async def place_order(order_data: dict, user = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": user["user_id"]})
    if not cart or not cart.get("items"):
        raise HTTPException(400, "Cart is empty")

    # FRAUD DETECTION ###
    order_value = sum(i["price"] * i["quantity"] for i in cart["items"])
    features = np.array([[order_value, 30, 5, 2, 0]]).reshape(1, -1)  
    features_scaled = scaler.transform(features)
    fraud_prob = model.predict_proba(features_scaled)[0][1]  

    if fraud_prob > 0.7:
        raise HTTPException(400, f"Suspicious order detected (Fraud probability: {fraud_prob:.2f}). Contact support.")

    order = {
        "user_id": user["user_id"],
        "items": cart["items"],
        "total": order_value,
        "address": order_data["address"],
        "status": "pending",
        "fraud_score": fraud_prob,
        "created_at": datetime.utcnow()
    }
    result = await db.orders.insert_one(order)
    await db.carts.delete_one({"user_id": user["user_id"]})
    return {"order_id": str(result.inserted_id), "message": "Order placed!", "fraud_prob": fraud_prob}

@router.get("/history")
async def order_history(user = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": user["user_id"]}).sort("created_at", -1).to_list(50)
    return [
        {
            "_id": str(o["_id"]),
            "total": o["total"],
            "status": o["status"],
            "fraud_score": o.get("fraud_score", 0),
            "items": o["items"],
            "date": o["created_at"].isoformat(),
            "address": o["address"]
        } for o in orders
    ]