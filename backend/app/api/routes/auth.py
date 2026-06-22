from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
import uuid
from app.db.database import get_db
from app.models.models import User
from app.core.auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter()

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    is_consultant: bool

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

@router.post("/register", response_model=TokenResponse)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        id=str(uuid.uuid4()),
        email=data.email,
        hashed_password=get_password_hash(data.password),
        full_name=data.full_name,
        phone=data.phone,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_access_token({"sub": user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(id=user.id, email=user.email, full_name=user.full_name, is_consultant=user.is_consultant),
    )

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = create_access_token({"sub": user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(id=user.id, email=user.email, full_name=user.full_name, is_consultant=user.is_consultant),
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(id=current_user.id, email=current_user.email, full_name=current_user.full_name, is_consultant=current_user.is_consultant)
