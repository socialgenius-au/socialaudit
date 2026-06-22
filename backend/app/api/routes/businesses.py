from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
import uuid, enum
from app.db.database import get_db
from app.models.models import Business, BusinessType, User
from app.core.auth import get_current_user

router = APIRouter()

class BusinessTypeEnum(str, enum.Enum):
    RESTAURANT="restaurant"; CAFE="cafe"; BEAUTY_SALON="beauty_salon"; HAIR_SALON="hair_salon"
    NAIL_SALON="nail_salon"; REAL_ESTATE="real_estate"; MEDICAL_CENTRE="medical_centre"
    DENTAL="dental"; PHYSIOTHERAPY="physiotherapy"; NDIS_PROVIDER="ndis_provider"
    TUTORING="tutoring"; EDUCATION="education"; GROCERY="grocery"; RETAIL="retail"
    GYM_FITNESS="gym_fitness"; OTHER="other"

class BusinessCreate(BaseModel):
    name: str; business_type: BusinessTypeEnum; description: Optional[str] = None
    suburb: str; address: Optional[str] = None; postcode: Optional[str] = None
    website: Optional[str] = None; phone: Optional[str] = None
    email: Optional[str] = None; whatsapp: Optional[str] = None
    instagram_username: Optional[str] = None; tiktok_username: Optional[str] = None
    youtube_channel_id: Optional[str] = None
    ubereats_business_id: Optional[str] = None; doordash_business_id: Optional[str] = None
    hungrypanda_business_id: Optional[str] = None; fantuan_business_id: Optional[str] = None
    easi_business_id: Optional[str] = None; deliveroo_business_id: Optional[str] = None

    @field_validator("instagram_username", "tiktok_username", mode="before")
    @classmethod
    def strip_at(cls, v):
        return v.lstrip("@").strip() or None if v and isinstance(v, str) else v

class BusinessUpdate(BaseModel):
    name: Optional[str] = None; business_type: Optional[BusinessTypeEnum] = None
    description: Optional[str] = None; suburb: Optional[str] = None
    address: Optional[str] = None; postcode: Optional[str] = None
    website: Optional[str] = None; phone: Optional[str] = None
    email: Optional[str] = None; whatsapp: Optional[str] = None
    instagram_username: Optional[str] = None; tiktok_username: Optional[str] = None
    youtube_channel_id: Optional[str] = None

class BusinessSummary(BaseModel):
    id: str; name: str; business_type: str; suburb: str
    onboarding_completed: bool; instagram_username: Optional[str]
    tiktok_username: Optional[str]; gmb_connected: bool; created_at: datetime
    model_config = {"from_attributes": True}

class BusinessResponse(BaseModel):
    id: str; name: str; business_type: str; description: Optional[str]; suburb: str
    address: Optional[str]; postcode: Optional[str]; state: str
    website: Optional[str]; phone: Optional[str]; email: Optional[str]; whatsapp: Optional[str]
    instagram_username: Optional[str]; tiktok_username: Optional[str]
    youtube_channel_id: Optional[str]; gmb_place_id: Optional[str]
    instagram_connected: bool; tiktok_connected: bool; gmb_connected: bool; youtube_connected: bool
    onboarding_completed: bool; onboarding_step: int
    created_at: datetime; updated_at: Optional[datetime]
    model_config = {"from_attributes": True}

async def get_biz(business_id, owner_id, db):
    r = await db.execute(select(Business).where(Business.id == business_id, Business.owner_id == owner_id))
    biz = r.scalar_one_or_none()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    return biz

@router.post("/", response_model=BusinessResponse, status_code=201)
async def create_business(data: BusinessCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    r = await db.execute(select(Business).where(Business.owner_id == current_user.id))
    if len(r.scalars().all()) >= 10:
        raise HTTPException(400, "Maximum 10 businesses per account")
    biz = Business(
        id=str(uuid.uuid4()), owner_id=current_user.id,
        name=data.name, business_type=BusinessType(data.business_type.value),
        description=data.description, suburb=data.suburb,
        address=data.address, postcode=data.postcode,
        website=data.website, phone=data.phone, email=data.email, whatsapp=data.whatsapp,
        instagram_username=data.instagram_username, tiktok_username=data.tiktok_username,
        youtube_channel_id=data.youtube_channel_id,
        ubereats_business_id=data.ubereats_business_id,
        doordash_business_id=data.doordash_business_id,
        onboarding_completed=False, onboarding_step=3,
    )
    db.add(biz); await db.commit(); await db.refresh(biz)
    return biz

@router.get("/", response_model=list[BusinessSummary])
async def list_businesses(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    r = await db.execute(select(Business).where(Business.owner_id == current_user.id).order_by(Business.created_at.desc()))
    return r.scalars().all()

@router.get("/{business_id}", response_model=BusinessResponse)
async def get_business(business_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await get_biz(business_id, current_user.id, db)

@router.patch("/{business_id}", response_model=BusinessResponse)
async def update_business(business_id: str, data: BusinessUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    biz = await get_biz(business_id, current_user.id, db)
    for field, value in data.model_dump(exclude_unset=True).items():
        if field in ("instagram_username", "tiktok_username") and isinstance(value, str):
            value = value.lstrip("@").strip() or None
        setattr(biz, field, value)
    await db.commit(); await db.refresh(biz)
    return biz

@router.delete("/{business_id}", status_code=204)
async def delete_business(business_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    biz = await get_biz(business_id, current_user.id, db)
    await db.delete(biz); await db.commit()

@router.post("/{business_id}/complete-onboarding", response_model=BusinessResponse)
async def complete_onboarding(business_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    biz = await get_biz(business_id, current_user.id, db)
    biz.onboarding_completed = True; biz.onboarding_step = 4
    await db.commit(); await db.refresh(biz)
    return biz
