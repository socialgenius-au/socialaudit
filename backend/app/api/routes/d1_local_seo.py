from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def d1_local_seo():
    return {"dimension": "D1 Local SEO", "status": "active"}
