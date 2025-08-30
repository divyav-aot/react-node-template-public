from pydantic import BaseModel, Field, ConfigDict, field_serializer
from typing import Optional
from datetime import datetime


class CustomBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class StateBase(CustomBaseModel):
    name: str = Field(...,
                      min_length=1,
                      max_length=50,
                      description="State name"
                      )
    description: Optional[str] = Field(None,
                                       max_length=200,
                                       description="State description"
                                       )
    is_active: bool = Field(True, description="Whether the state is active")
    sort_order: int = Field(0, ge=0, description="Sort order for display")


class StateCreate(StateBase):
    pass


class StateUpdate(CustomBaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=200)
    is_active: Optional[bool] = None
    sort_order: Optional[int] = Field(None, ge=0)


class StateResponse(StateBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_serializer("created_at", "updated_at", when_used="json")
    def serialize_dt(self, dt: Optional[datetime]) -> Optional[str]:
        return dt.isoformat() if dt else None
