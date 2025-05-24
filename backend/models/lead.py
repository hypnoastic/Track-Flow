from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LeadBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: str
    product_interest: str
    status: str = "New"  # New, Contacted, Qualified, Proposal Sent, Won, Lost
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    product_interest: Optional[str] = None
    status: Optional[str] = None
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None

class Lead(LeadBase):
    id: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()