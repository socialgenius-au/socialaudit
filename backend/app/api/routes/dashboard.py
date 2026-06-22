from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.models.models import Business, DimensionScore, User
from app.core.auth import get_current_user

router = APIRouter()

DIMENSION_META = [
    {"number":1,"name":"Local SEO & Presence Intelligence","short_name":"Local SEO"},
    {"number":2,"name":"Reputation & Trust Intelligence","short_name":"Reputation"},
    {"number":3,"name":"Conversion & Monetisation Intelligence","short_name":"Conversion"},
    {"number":4,"name":"Paid & Advertising Intelligence","short_name":"Advertising"},
    {"number":5,"name":"Audience & Platform Intelligence","short_name":"Audience"},
    {"number":6,"name":"Discoverability & Content Intelligence","short_name":"Discoverability"},
    {"number":7,"name":"Viral Trend Intelligence","short_name":"Viral Trends"},
    {"number":8,"name":"Content Strategy & Production","short_name":"Content"},
    {"number":9,"name":"Influencer & Partnership Intelligence","short_name":"Influencers"},
]

async def build_overview(biz, db):
    r = await db.execute(select(DimensionScore).where(DimensionScore.business_id == biz.id).order_by(DimensionScore.audited_at.desc()))
    scores = r.scalars().all()
    latest = {}
    for s in scores:
        if s.dimension_number not in latest:
            latest[s.dimension_number] = s
    dims = []
    completed = []
    for m in DIMENSION_META:
        row = latest.get(m["number"])
        if row:
            completed.append(row.score)
            dims.append({"dimension_number":m["number"],"dimension_name":m["name"],"short_name":m["short_name"],"score":row.score,"grade":row.grade.value if row.grade else None,"audited_at":row.audited_at.isoformat() if row.audited_at else None,"quick_wins":row.quick_wins or [],"status":"audited"})
        else:
            dims.append({"dimension_number":m["number"],"dimension_name":m["name"],"short_name":m["short_name"],"score":None,"grade":None,"audited_at":None,"quick_wins":[],"status":"not_audited"})
    overall = round(sum(completed)/len(completed),1) if completed else None
    return overall, len(completed), dims

@router.get("/overview")
async def overview(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    r = await db.execute(select(Business).where(Business.owner_id == current_user.id).order_by(Business.created_at.desc()))
    businesses = r.scalars().all()
    if not businesses:
        return {"redirect": "/onboarding", "has_business": False}
    biz = businesses[0]
    overall, completed, dims = await build_overview(biz, db)
    return {
        "has_business": True,
        "business": {"id":biz.id,"name":biz.name,"business_type":biz.business_type.value if biz.business_type else None,"suburb":biz.suburb,"instagram_username":biz.instagram_username,"tiktok_username":biz.tiktok_username,"gmb_connected":biz.gmb_connected,"youtube_channel_id":biz.youtube_channel_id,"onboarding_completed":biz.onboarding_completed,"created_at":biz.created_at.isoformat() if biz.created_at else None},
        "all_businesses": [{"id":b.id,"name":b.name,"suburb":b.suburb,"business_type":b.business_type.value if b.business_type else None} for b in businesses],
        "overall_score": overall, "completed_dimensions": completed, "total_dimensions": 9, "dimensions": dims,
        "next_recommended_action": "Run your D1 Local SEO audit to get your first score" if completed == 0 else "Keep auditing your remaining dimensions",
        "estimated_revenue_opportunity": "$5,000–$15,000/month estimated opportunity (run audits to refine)",
    }

@router.get("/overview/{business_id}")
async def overview_by_id(business_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    r = await db.execute(select(Business).where(Business.id == business_id, Business.owner_id == current_user.id))
    biz = r.scalar_one_or_none()
    if not biz:
        raise HTTPException(404, "Business not found")
    overall, completed, dims = await build_overview(biz, db)
    return {"business_id": business_id, "overall_score": overall, "completed_dimensions": completed, "dimensions": dims}
