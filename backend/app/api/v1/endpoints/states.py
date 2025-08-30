from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.state import StateCreate, StateUpdate, StateResponse
from app.services.state_service import StateService

router = APIRouter()


@router.get("/", response_model=List[StateResponse], summary="Get all states")
async def get_states(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100,
                       ge=1,
                       le=1000,
                       description="Maximum number of records to return"
                       ),
    db: Session = Depends(get_db)
):
    """
    Retrieve all states with pagination support, ordered by sort_order.
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return (max 1000)
    """
    states = StateService.get_states(db, skip=skip, limit=limit)
    return states


@router.get("/active",
            response_model=List[StateResponse],
            summary="Get active states"
            )
async def get_active_states(db: Session = Depends(get_db)):
    """
    Retrieve all active states, ordered by sort_order.
    """
    states = StateService.get_active_states(db)
    return states


@router.get("/{state_id}",
            response_model=StateResponse,
            summary="Get state by ID"
            )
async def get_state(
    state_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific state by its ID.
    - **state_id**: The unique identifier of the state
    """
    state = StateService.get_state_by_id(db, state_id)
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state


@router.post("/",
             response_model=StateResponse,
             status_code=201,
             summary="Create new state"
             )
async def create_state(
    state: StateCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new state.
    - **state**: State data including
        name,
        description,
        is_active,
        sort_order
    """
    return StateService.create_state(db, state)


@router.put("/{state_id}",
            response_model=StateResponse,
            summary="Update state"
            )
async def update_state(
    state_id: int,
    state_update: StateUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing state.
    - **state_id**: The unique identifier of the state to update
    - **state_update**: State data to update
      (only provided fields will be updated)
    """
    return StateService.update_state(db, state_id, state_update)


@router.delete("/{state_id}", summary="Delete state")
async def delete_state(
    state_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a state.
    - **state_id**: The unique identifier of the state to delete
    """
    StateService.delete_state(db, state_id)
    return {"message": f"State {state_id} deleted successfully"}


@router.post("/initialize",
             response_model=List[StateResponse],
             summary="Initialize default states"
             )
async def initialize_default_states(db: Session = Depends(get_db)):
    """
    Initialize default states (New, In Progress, Done) if they don't exist.
    This endpoint is safe to call multiple times.
    """
    created_states = StateService.initialize_default_states(db)
    if created_states:
        return created_states
    else:
        return {"message": "Default states already exist"}
