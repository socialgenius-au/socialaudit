from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.database import create_tables
from app.api.routes import (
    auth, businesses, onboarding, dashboard, dimensions,
    d1_local_seo,
    d2_reputation, d3_conversion, d4_advertising,
    d5_audience, d6_discoverability, d7_viral_trends,
    d8_content_strategy, d9_influencer,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(
    title="SocialGenius API",
    description="From Invisible to Unstoppable — Social Media Intelligence for Sydney SMBs",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ── Routes ──────────────────────────────────────────────────────────
app.include_router(auth.router,                  prefix="/api/auth",       tags=["Auth"])
app.include_router(onboarding.router,            prefix="/api/onboarding", tags=["Onboarding"])
app.include_router(businesses.router,            prefix="/api/businesses", tags=["Businesses"])
app.include_router(dashboard.router,             prefix="/api/dashboard",  tags=["Dashboard"])
app.include_router(dimensions.router,            prefix="/api/dimensions", tags=["Dimensions"])
app.include_router(d1_local_seo.router,          prefix="/api/d1",         tags=["D1 Local SEO"])
app.include_router(d2_reputation.router,         prefix="/api/d2",         tags=["D2 Reputation"])
app.include_router(d3_conversion.router,         prefix="/api/d3",         tags=["D3 Conversion"])
app.include_router(d4_advertising.router,        prefix="/api/d4",         tags=["D4 Advertising"])
app.include_router(d5_audience.router,           prefix="/api/d5",         tags=["D5 Audience"])
app.include_router(d6_discoverability.router,    prefix="/api/d6",         tags=["D6 Discoverability"])
app.include_router(d7_viral_trends.router,       prefix="/api/d7",         tags=["D7 Viral Trends"])
app.include_router(d8_content_strategy.router,   prefix="/api/d8",         tags=["D8 Content"])
app.include_router(d9_influencer.router,         prefix="/api/d9",         tags=["D9 Influencer"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "product": "SocialGenius",
        "tagline": "From Invisible to Unstoppable",
        "version": "2.0.0",
        "sprint": 2,
        "status": "operational",
        "d1_engine": "active",
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
