from fastapi import APIRouter
router = APIRouter()
@router.get("/")
async def root(): return {"module": "dimensions", "status": "coming in next sprint"}
