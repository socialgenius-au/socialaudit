from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.models.models import Business, User
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/status")
async def onboarding_status(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    r = await db.execute(select(Business).where(Business.owner_id == current_user.id).order_by(Business.created_at.desc()))
    businesses = r.scalars().all()
    if not businesses:
        return {"has_business": False, "onboarding_completed": False, "redirect": "/onboarding"}
    latest = businesses[0]
    return {
        "has_business": True, "business_id": latest.id, "business_name": latest.name,
        "onboarding_completed": latest.onboarding_completed, "onboarding_step": latest.onboarding_step,
        "redirect": "/dashboard" if latest.onboarding_completed else "/onboarding",
    }

@router.patch("/step/{business_id}")
async def update_step(business_id: str, step: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if step < 1 or step > 4:
        raise HTTPException(400, "Step must be 1-4")
    r = await db.execute(select(Business).where(Business.id == business_id, Business.owner_id == current_user.id))
    biz = r.scalar_one_or_none()
    if not biz:
        raise HTTPException(404, "Business not found")
    biz.onboarding_step = step
    if step == 4:
        biz.onboarding_completed = True
    await db.commit()
    return {"business_id": business_id, "step": step, "onboarding_completed": biz.onboarding_completed}
