"""SocialGenius — Complete Database Models (Sprint 2)"""
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text,
    ForeignKey, JSON, Enum as SAEnum, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid
from app.db.database import Base

def gen_uuid():
    return str(uuid.uuid4())

class BusinessType(str, enum.Enum):
    RESTAURANT = "restaurant"
    CAFE = "cafe"
    BEAUTY_SALON = "beauty_salon"
    HAIR_SALON = "hair_salon"
    NAIL_SALON = "nail_salon"
    REAL_ESTATE = "real_estate"
    MEDICAL_CENTRE = "medical_centre"
    DENTAL = "dental"
    PHYSIOTHERAPY = "physiotherapy"
    NDIS_PROVIDER = "ndis_provider"
    TUTORING = "tutoring"
    EDUCATION = "education"
    GROCERY = "grocery"
    RETAIL = "retail"
    GYM_FITNESS = "gym_fitness"
    OTHER = "other"

class Platform(str, enum.Enum):
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    GOOGLE_MY_BUSINESS = "google_my_business"
    YOUTUBE = "youtube"
    FACEBOOK = "facebook"

class ScoreGrade(str, enum.Enum):
    CRITICAL = "critical"
    NEEDS_WORK = "needs_work"
    STRONG = "strong"

class RoadmapStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    OVERDUE = "overdue"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_consultant = Column(Boolean, default=False)
    google_id = Column(String, nullable=True, unique=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    businesses = relationship("Business", back_populates="owner")

class Business(Base):
    __tablename__ = "businesses"
    id = Column(String, primary_key=True, default=gen_uuid)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    business_type = Column(SAEnum(BusinessType), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(String, nullable=True)
    suburb = Column(String, nullable=False)
    postcode = Column(String, nullable=True)
    state = Column(String, default="NSW")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    website = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)
    instagram_connected = Column(Boolean, default=False)
    tiktok_connected = Column(Boolean, default=False)
    gmb_connected = Column(Boolean, default=False)
    youtube_connected = Column(Boolean, default=False)
    instagram_username = Column(String, nullable=True)
    tiktok_username = Column(String, nullable=True)
    gmb_place_id = Column(String, nullable=True)
    youtube_channel_id = Column(String, nullable=True)
    instagram_access_token = Column(Text, nullable=True)
    tiktok_access_token = Column(Text, nullable=True)
    gmb_access_token = Column(Text, nullable=True)
    youtube_access_token = Column(Text, nullable=True)
    ubereats_business_id = Column(String, nullable=True)
    doordash_business_id = Column(String, nullable=True)
    hungrypanda_business_id = Column(String, nullable=True)
    fantuan_business_id = Column(String, nullable=True)
    easi_business_id = Column(String, nullable=True)
    deliveroo_business_id = Column(String, nullable=True)
    onboarding_completed = Column(Boolean, default=False)
    onboarding_step = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    owner = relationship("User", back_populates="businesses")
    dimension_scores = relationship("DimensionScore", back_populates="business")
    competitors = relationship("Competitor", back_populates="business")
    roadmap = relationship("Roadmap", back_populates="business", uselist=False)
    d1_audits = relationship("D1Audit", back_populates="business")
    d2_reputation = relationship("D2Reputation", back_populates="business")
    d3_conversion = relationship("D3Conversion", back_populates="business")
    d4_advertising = relationship("D4Advertising", back_populates="business")
    d5_audience = relationship("D5Audience", back_populates="business")
    d6_discoverability = relationship("D6Discoverability", back_populates="business")
    d7_viral_trends = relationship("D7ViralTrend", back_populates="business")
    d8_content = relationship("D8ContentStrategy", back_populates="business")
    d9_influencer = relationship("D9Influencer", back_populates="business")

class DimensionScore(Base):
    __tablename__ = "dimension_scores"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    dimension_number = Column(Integer, nullable=False)
    dimension_name = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    grade = Column(SAEnum(ScoreGrade), nullable=False)
    sub_scores = Column(JSON, nullable=True)
    insights = Column(JSON, nullable=True)
    quick_wins = Column(JSON, nullable=True)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", back_populates="dimension_scores")
    __table_args__ = (
        Index("idx_dimension_scores_business_dim", "business_id", "dimension_number"),
    )

class Competitor(Base):
    __tablename__ = "competitors"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    name = Column(String, nullable=False)
    suburb = Column(String, nullable=False)
    business_type = Column(SAEnum(BusinessType), nullable=False)
    gmb_place_id = Column(String, nullable=True)
    instagram_username = Column(String, nullable=True)
    tiktok_username = Column(String, nullable=True)
    youtube_channel_id = Column(String, nullable=True)
    overall_score = Column(Float, nullable=True)
    scores_by_dimension = Column(JSON, nullable=True)
    last_audited = Column(DateTime(timezone=True), nullable=True)
    is_primary = Column(Boolean, default=False)
    business = relationship("Business", back_populates="competitors")

class D1Audit(Base):
    __tablename__ = "d1_audits"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    gbp_completeness_score = Column(Float, default=0)
    gbp_name_score = Column(Float, default=0)
    gbp_category_score = Column(Float, default=0)
    gbp_description_score = Column(Float, default=0)
    gbp_photos_count = Column(Integer, default=0)
    gbp_photos_score = Column(Float, default=0)
    gbp_hours_score = Column(Float, default=0)
    gbp_services_score = Column(Float, default=0)
    gbp_posts_active = Column(Boolean, default=False)
    gbp_qa_answered = Column(Boolean, default=False)
    gbp_booking_link = Column(Boolean, default=False)
    gbp_attributes_score = Column(Float, default=0)
    gbp_raw_data = Column(JSON, nullable=True)
    search_ranking_score = Column(Float, default=0)
    primary_keyword_rank = Column(Integer, nullable=True)
    local_pack_present = Column(Boolean, default=False)
    ranking_keywords = Column(JSON, nullable=True)
    ranking_opportunities = Column(JSON, nullable=True)
    citation_score = Column(Float, default=0)
    citation_count = Column(Integer, default=0)
    nap_consistency_score = Column(Float, default=0)
    missing_directories = Column(JSON, nullable=True)
    duplicate_listings = Column(Integer, default=0)
    seo_signals_score = Column(Float, default=0)
    website_local_signals = Column(Float, default=0)
    mobile_speed_score = Column(Float, nullable=True)
    schema_markup_present = Column(Boolean, default=False)
    maps_embedded = Column(Boolean, default=False)
    review_velocity_score = Column(Float, default=0)
    total_google_reviews = Column(Integer, default=0)
    google_rating = Column(Float, nullable=True)
    reviews_per_month = Column(Float, default=0)
    response_rate = Column(Float, default=0)
    response_time_hours = Column(Float, nullable=True)
    posts_score = Column(Float, default=0)
    posts_per_month = Column(Integer, default=0)
    post_types_used = Column(JSON, nullable=True)
    maps_score = Column(Float, default=0)
    relevance_score = Column(Float, default=0)
    prominence_score = Column(Float, default=0)
    competitor_intel_score = Column(Float, default=0)
    competitor_comparison = Column(JSON, nullable=True)
    total_score = Column(Float, default=0)
    priority_fixes = Column(JSON, nullable=True)
    estimated_revenue_impact = Column(String, nullable=True)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", back_populates="d1_audits")

class D2Reputation(Base):
    __tablename__ = "d2_reputation"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    google_rating = Column(Float, nullable=True)
    google_review_count = Column(Integer, default=0)
    google_response_rate = Column(Float, default=0)
    facebook_rating = Column(Float, nullable=True)
    facebook_review_count = Column(Integer, default=0)
    ubereats_rating = Column(Float, nullable=True)
    ubereats_review_count = Column(Integer, default=0)
    doordash_rating = Column(Float, nullable=True)
    doordash_review_count = Column(Integer, default=0)
    hungrypanda_rating = Column(Float, nullable=True)
    hungrypanda_review_count = Column(Integer, default=0)
    aggregate_rating = Column(Float, nullable=True)
    total_reviews_all_platforms = Column(Integer, default=0)
    sentiment_positive_pct = Column(Float, nullable=True)
    sentiment_negative_pct = Column(Float, nullable=True)
    common_positive_themes = Column(JSON, nullable=True)
    common_negative_themes = Column(JSON, nullable=True)
    reputation_score = Column(Float, default=0)
    crisis_alerts = Column(JSON, nullable=True)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", back_populates="d2_reputation")

class D3Conversion(Base):
    __tablename__ = "d3_conversion"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    bio_has_cta = Column(Boolean, default=False)
    bio_has_link = Column(Boolean, default=False)
    booking_system_type = Column(String, nullable=True)
    conversion_score = Column(Float, default=0)
    priority_fixes = Column(JSON, nullable=True)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", back_populates="d3_conversion")

class D4Advertising(Base):
    __tablename__ = "d4_advertising"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    running_instagram_ads = Column(Boolean, default=False)
    running_google_ads = Column(Boolean, default=False)
    monthly_ad_budget = Column(Float, nullable=True)
    advertising_score = Column(Float, default=0)
    recommendations = Column(JSON, nullable=True)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", back_populates="d4_advertising")

class D5Audience(Base):
    __tablename__ = "d5_audience"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    instagram_audience = Column(JSON, nullable=True)
    platform_fit_scores = Column(JSON, nullable=True)
    audience_score = Column(Float, default=0)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", back_populates="d5_audience")

class D6Discoverability(Base):
    __tablename__ = "d6_discoverability"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    hashtag_relevance_score = Column(Float, default=0)
    discoverability_score = Column(Float, default=0)
    recommendations = Column(JSON, nullable=True)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", back_populates="d6_discoverability")

class D7ViralTrend(Base):
    __tablename__ = "d7_viral_trends"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    trends_adopted_last_30d = Column(Integer, default=0)
    trend_intelligence_score = Column(Float, default=0)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", back_populates="d7_viral_trends")

class D8ContentStrategy(Base):
    __tablename__ = "d8_content_strategy"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    instagram_posts_per_month = Column(Float, default=0)
    content_score = Column(Float, default=0)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", back_populates="d8_content")

class D9Influencer(Base):
    __tablename__ = "d9_influencer"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    has_influencer_partnerships = Column(Boolean, default=False)
    influencer_score = Column(Float, default=0)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", back_populates="d9_influencer")

class Roadmap(Base):
    __tablename__ = "roadmaps"
    id = Column(String, primary_key=True, default=gen_uuid)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False, unique=True)
    overall_score_at_creation = Column(Float, nullable=True)
    target_score = Column(Float, default=80.0)
    phases = Column(JSON, nullable=True)
    current_phase = Column(Integer, default=1)
    timeframe_weeks = Column(Integer, default=24)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    business = relationship("Business", back_populates="roadmap")

class SocialProofCase(Base):
    __tablename__ = "social_proof_cases"
    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String, nullable=False)
    business_type = Column(SAEnum(BusinessType), nullable=False)
    dimension_number = Column(Integer, nullable=True)
    outcome_summary = Column(Text, nullable=False)
    revenue_increase_pct = Column(Float, nullable=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
