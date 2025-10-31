# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, products, cart, ai, admin, orders

app = FastAPI(title="AI Recommender E-Commerce")

# CORS – ALLOW VERCEL + LOCALHOST
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://shopora-ai-driven-e-commerce-platfo.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTERS
app.include_router(auth.router, prefix="/api/auth")
app.include_router(products.router, prefix="/api/products")
app.include_router(cart.router, prefix="/api/cart")
app.include_router(ai.router, prefix="/api/ai")
app.include_router(admin.router, prefix="/api/admin")
app.include_router(orders.router, prefix="/api/orders")

# ROOT ENDPOINT – FIXES 404
@app.get("/")
async def root():
    return {
        "message": "Shopora Backend is LIVE!",
        "docs": "/docs",
        "health": "/health",
        "api_prefix": "/api"
    }

# HEALTH CHECK
@app.get("/health")
async def health():
    return {"status": "healthy"}