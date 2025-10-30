import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from passlib.context import CryptContext
from datetime import datetime


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


client = AsyncIOMotorClient(settings.MONGO_URI)
db = client.ecommerce


products = [
    {
        "name": "Wireless Headphones",
        "category": "Electronics",
        "price": 89.99,
        "stock": 50,
        "tags": ["wireless", "bluetooth", "audio"],
        "description": "Premium noise-cancelling wireless headphones with 30-hour battery.",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    {
        "name": "Smart Watch",
        "category": "Electronics",
        "price": 199.99,
        "stock": 30,
        "tags": ["fitness", "smart", "wearable"],
        "description": "Track fitness, receive notifications, and monitor heart rate.",
        "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500"
    },
    {
        "name": "Yoga Mat",
        "category": "Fitness",
        "price": 29.99,
        "stock": 100,
        "tags": ["yoga", "exercise", "mat"],
        "description": "Non-slip, eco-friendly yoga mat for home or gym.",
        "image": "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500"
    },
    {
        "name": "Coffee Maker",
        "category": "Home",
        "price": 79.99,
        "stock": 25,
        "tags": ["kitchen", "coffee", "appliance"],
        "description": "Programmable 12-cup coffee maker with auto shut-off.",
        "image": "https://images.unsplash.com/photo-1559058777-68b6d6d7d9b4?w=500"
    },
    {
        "name": "LED Desk Lamp",
        "category": "Home",
        "price": 39.99,
        "stock": 60,
        "tags": ["lighting", "desk", "led"],
        "description": "Adjustable brightness and color temperature LED lamp.",
        "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"
    },
    {
        "name": "Running Shoes",
        "category": "Fitness",
        "price": 119.99,
        "stock": 40,
        "tags": ["running", "sports", "shoes"],
        "description": "Lightweight, cushioned running shoes for all terrains.",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },
    {
        "name": "Bluetooth Speaker",
        "category": "Electronics",
        "price": 49.99,
        "stock": 75,
        "tags": ["portable", "speaker", "music"],
        "description": "Waterproof portable speaker with 12-hour playtime.",
        "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"
    },
    {
        "name": "Throw Pillow Set",
        "category": "Home",
        "price": 24.99,
        "stock": 120,
        "tags": ["decor", "pillow", "living room"],
        "description": "Set of 2 soft decorative throw pillows.",
        "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"
    }
]

async def seed():
    
    await db.products.drop()
    await db.users.drop()
    await db.carts.drop()
    await db.orders.drop()

    # Seed Products
    result = await db.products.insert_many(products)
    print(f"Seeded {len(result.inserted_ids)} products")

    # Seed Admin User
    admin_user = {
        "email": "admin@example.com",
        "password": pwd_context.hash("admin123"),
        "role": "admin",
        "created_at": datetime.utcnow()
    }
    admin_result = await db.users.insert_one(admin_user)
    print(f"Admin created: {admin_result.inserted_id}")

    # Seed Regular User
    user = {
        "email": "user@example.com",
        "password": pwd_context.hash("user123"),
        "role": "user",
        "created_at": datetime.utcnow()
    }
    user_result = await db.users.insert_one(user)
    print(f"User created: {user_result.inserted_id}")

    print("\nSEEDING COMPLETE!")
    print("Login Credentials:")
    print("   Admin: admin@example.com / admin123")
    print("   User:  user@example.com  / user123")

if __name__ == "__main__":
    asyncio.run(seed())