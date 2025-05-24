from fastapi import APIRouter, HTTPException
from models.lead import Lead, LeadCreate, LeadUpdate
from typing import List
from firebase import db

router = APIRouter()

@router.post("/", response_model=Lead)
async def create_lead(lead: LeadCreate):
    lead_dict = lead.dict()
    doc_ref = db.collection("leads").document()
    lead_dict["id"] = doc_ref.id
    doc_ref.set(lead_dict)
    return Lead(**lead_dict)

@router.get("/", response_model=List[Lead])
async def get_leads():
    leads = []
    docs = db.collection("leads").stream()
    for doc in docs:
        lead_data = doc.to_dict()
        lead_data["id"] = doc.id
        leads.append(Lead(**lead_data))
    return leads

@router.get("/{lead_id}", response_model=Lead)
async def get_lead(lead_id: str):
    doc = db.collection("leads").document(lead_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead_data = doc.to_dict()
    lead_data["id"] = doc.id
    return Lead(**lead_data)

@router.put("/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, lead: LeadUpdate):
    doc_ref = db.collection("leads").document(lead_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Lead not found")
    doc_ref.update(lead.dict(exclude_unset=True))
    updated_doc = doc_ref.get()
    lead_data = updated_doc.to_dict()
    lead_data["id"] = lead_id
    return Lead(**lead_data)

@router.delete("/{lead_id}")
async def delete_lead(lead_id: str):
    doc_ref = db.collection("leads").document(lead_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Lead not found")
    doc_ref.delete()
    return {"message": "Lead deleted successfully"}