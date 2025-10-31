from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from datetime import datetime, timedelta
import jwt

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"])
db = AsyncIOMotorClient(settings.MONGO_URI).ecommerce

class RegisterData(BaseModel):
    email: str
    password: str

class LoginData(BaseModel):
    email: str
    password: str

# ADD THIS FUNCTION – TRUNCATE PASSWORD TO 72 BYTES (BCRYPT LIMIT)
def safe_hash_password(password: str) -> str:
    # Bcrypt fails if password > 72 bytes
    if len(password.encode('utf-8')) > 72:
        password = password[:72]  # Truncate safely
    return pwd_context.hash(password)

@router.post("/register")
async def register(data: RegisterData):
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(400, "Email already registered")
    
    # USE SAFE HASH FUNCTION
    hashed = safe_hash_password(data.password)
    
    result = await db.users.insert_one({
        "email": data.email, 
        "password": hashed, 
        "role": "user", 
        "created_at": datetime.utcnow()
    })
    return {"message": "Registered successfully"}

@router.post("/login")
async def login(data: LoginData):
    user = await db.users.find_one({"email": data.email})
    if not user or not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(401, "Invalid email or password")
    token = jwt.encode({
        "user_id": str(user["_id"]), "role": user["role"],
        "exp": datetime.utcnow() + timedelta(days=1)
    }, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return {"token": token, "role": user["role"]}