from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrderBase(BaseModel):
    lead_id: str
    status: str = "Order Received"  # Order Received, In Development, Ready to Dispatch, Dispatched
    product_details: str
    amount: float
    courier: Optional[str] = None
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    product_details: Optional[str] = None
    amount: Optional[float] = None
    courier: Optional[str] = None
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    notes: Optional[str] = None

class Order(OrderBase):
    id: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()