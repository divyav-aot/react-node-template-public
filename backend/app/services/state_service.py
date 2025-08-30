from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from app.models.state import State
from app.schemas.state import StateCreate, StateUpdate
from fastapi import HTTPException


class StateService:
    @staticmethod
    def get_states(db: Session,
                   skip: int = 0,
                   limit: int = 100
                   ) -> List[State]:
        """Get all states with pagination, ordered by sort_order"""
        return (
            db.query(State)
            .order_by(State.sort_order, State.name)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_state_by_id(db: Session, state_id: int) -> Optional[State]:
        """Get state by ID"""
        return db.query(State).filter(State.id == state_id).first()

    @staticmethod
    def get_state_by_name(db: Session, name: str) -> Optional[State]:
        """Get state by name"""
        return db.query(State).filter(State.name == name).first()

    @staticmethod
    def get_active_states(db: Session) -> List[State]:
        """Get all active states, ordered by sort_order"""
        return (
            db.query(State)
            .filter(State.is_active)
            .order_by(State.sort_order, State.name)
            .all()
        )

    @staticmethod
    def create_state(db: Session, state: StateCreate) -> State:
        """Create a new state"""
        # Check if state name already exists
        existing_state = StateService.get_state_by_name(db, state.name)
        if existing_state:
            raise HTTPException(
                status_code=400,
                detail=f"State with name '{state.name}' already exists"
            )
        db_state = State(**state.model_dump())
        try:
            db.add(db_state)
            db.commit()
            db.refresh(db_state)
            return db_state
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail="Failed to create state. Please check your data."
            )

    @staticmethod
    def update_state(db: Session,
                     state_id: int,
                     state_update: StateUpdate
                     ) -> State:
        """Update an existing state"""
        db_state = StateService.get_state_by_id(db, state_id)
        if not db_state:
            raise HTTPException(status_code=404, detail="State not found")
        # Check if name is being updated and if it already exists
        if state_update.name and state_update.name != db_state.name:
            existing_state = StateService.get_state_by_name(db,
                                                            state_update.name
                                                            )
            detail = f"State with name '{state_update.name}' already exists"
            if existing_state:
                raise HTTPException(
                    status_code=400,
                    detail=detail
                )
        # Update only provided fields
        update_data = state_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_state, field, value)
        try:
            db.commit()
            db.refresh(db_state)
            return db_state
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail="Failed to update state. Please check your data."
            )

    @staticmethod
    def delete_state(db: Session, state_id: int) -> bool:
        """Delete a state"""
        db_state = StateService.get_state_by_id(db, state_id)
        if not db_state:
            raise HTTPException(status_code=404, detail="State not found")
        try:
            db.delete(db_state)
            db.commit()
            return True
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail="Failed to delete state"
            )

    @staticmethod
    def initialize_default_states(db: Session) -> List[State]:
        """Initialize default states if they don't exist"""
        default_states = [
            {"name": "New",
             "description": "New item or task",
             "sort_order": 1
             },
            {"name": "In Progress",
             "description": "Item or task is being worked on",
             "sort_order": 2
             },
            {"name": "Done",
             "description": "Item or task is completed",
             "sort_order": 3
             }
        ]
        created_states = []
        for state_data in default_states:
            existing_state = StateService.get_state_by_name(db,
                                                            state_data["name"]
                                                            )
            if not existing_state:
                state = StateCreate(**state_data)
                created_states.append(StateService.create_state(db, state))
        return created_states
