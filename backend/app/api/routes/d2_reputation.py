from fastapi import APIRouter
router = APIRouter()
@router.get("/")
async def root(): return {"module": "d2_reputation", "status": "coming in next sprint"}
