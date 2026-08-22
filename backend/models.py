from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    applications = relationship("Application", back_populates="owner")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    status = Column(String(30), nullable=False, default="aplicado")
    applied_date = Column(Date, nullable=False)
    job_url = Column(String(255), nullable=True)
    source = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="applications")