from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.dependencies import require_admin
from bson import ObjectId
import csv
from fastapi.responses import StreamingResponse
import io

router = APIRouter()
db = AsyncIOMotorClient(settings.MONGO_URI).ecommerce

# === PRODUCTS CRUD ===
@router.post("/products")
async def create_product(product: dict, user = Depends(require_admin)):
    product["stock"] = int(product.get("stock", 0))
    product["price"] = float(product["price"])
    result = await db.products.insert_one(product)
    return {"id": str(result.inserted_id)}

@router.get("/products")
async def list_products(user = Depends(require_admin)):
    products = await db.products.find().to_list(100)
    return [
        {
            "_id": str(p["_id"]),
            "name": p["name"],
            "category": p["category"],
            "price": p["price"],
            "stock": p["stock"],
            "tags": p.get("tags", []),
            "image": p.get("image", ""),
            "description": p.get("description", "")
        } for p in products
    ]

@router.put("/products/{id}")
async def update_product(id: str, product: dict, user = Depends(require_admin)):
    try:
        obj_id = ObjectId(id)
    except:
        raise HTTPException(400, "Invalid ID")
    
    update_data = {
        "name": product["name"],
        "category": product["category"],
        "price": float(product["price"]),
        "stock": int(product["stock"]),
        "tags": product.get("tags", []),
        "image": product.get("image", ""),
        "description": product.get("description", "")
    }
    result = await db.products.update_one({"_id": obj_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(404, "Product not found")
    return {"message": "Updated"}

@router.delete("/products/{id}")
async def delete_product(id: str, user = Depends(require_admin)):
    try:
        obj_id = ObjectId(id)
    except:
        raise HTTPException(400, "Invalid ID")
    
    result = await db.products.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Product not found")
    return {"message": "Deleted"}

# === ORDERS ===
@router.get("/orders")
async def list_orders(user = Depends(require_admin)):
    orders = await db.orders.find().sort("created_at", -1).to_list(100)
    return [
        {
            "_id": str(o["_id"]),
            "user_id": o["user_id"],
            "total": o["total"],
            "status": o["status"],
            "items": o["items"],
            "address": o["address"],
            "date": o["created_at"].isoformat()
        } for o in orders
    ]

@router.post("/orders/{id}/status")
async def update_order_status(id: str, data: dict, user = Depends(require_admin)):
    try:
        obj_id = ObjectId(id)
    except:
        raise HTTPException(400, "Invalid ID")
    
    result = await db.orders.update_one(
        {"_id": obj_id},
        {"$set": {"status": data["status"]}}
    )
    if result.modified_count == 0:
        raise HTTPException(404, "Order not found")
    return {"message": "Status updated"}

# === STATS & EXPORT ===
@router.get("/stats")
async def admin_stats(user = Depends(require_admin)):
    total_orders = await db.orders.count_documents({})
    total_revenue = sum([o["total"] async for o in db.orders.find()])
    low_stock = await db.products.count_documents({"stock": {"$lte": 5}})
    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "low_stock_count": low_stock
    }

@router.get("/export-orders")
async def export_orders(user = Depends(require_admin)):
    orders = await db.orders.find().to_list(1000)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Order ID", "User ID", "Total", "Status", "Date"])
    for o in orders:
        writer.writerow([str(o["_id"]), o["user_id"], o["total"], o["status"], o["created_at"]])
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=orders.csv"}
    )