from fastapi import APIRouter, HTTPException
from models.order import Order, OrderCreate, OrderUpdate
from typing import List
from firebase import db

router = APIRouter()

@router.post("/", response_model=Order)
async def create_order(order: OrderCreate):
    order_dict = order.dict()
    doc_ref = db.collection("orders").document()
    order_dict["id"] = doc_ref.id
    doc_ref.set(order_dict)
    return Order(**order_dict)

@router.get("/", response_model=List[Order])
async def get_orders():
    orders = []
    docs = db.collection("orders").stream()
    for doc in docs:
        order_data = doc.to_dict()
        order_data["id"] = doc.id
        orders.append(Order(**order_data))
    return orders

@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: str):
    doc = db.collection("orders").document(order_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    order_data = doc.to_dict()
    order_data["id"] = doc.id
    return Order(**order_data)

@router.put("/{order_id}", response_model=Order)
async def update_order(order_id: str, order: OrderUpdate):
    doc_ref = db.collection("orders").document(order_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Order not found")
    doc_ref.update(order.dict(exclude_unset=True))
    updated_doc = doc_ref.get()
    order_data = updated_doc.to_dict()
    order_data["id"] = order_id
    return Order(**order_data)

@router.delete("/{order_id}")
async def delete_order(order_id: str):
    doc_ref = db.collection("orders").document(order_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Order not found")
    doc_ref.delete()
    return {"message": "Order deleted successfully"}