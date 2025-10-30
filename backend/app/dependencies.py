from fastapi import Depends, HTTPException, Header
from jose import jwt, JWTError
from app.core.config import settings

async def get_current_user(Authorization: str = Header(None, convert_underscores=False)):
    if not Authorization or not Authorization.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = Authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return {"user_id": str(payload["user_id"]), "role": payload["role"]}
    except JWTError:
        raise HTTPException(401, "Invalid token")

async def require_admin(user = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(403, "Admin access required")
    return user