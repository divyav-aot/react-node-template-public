import pytest
from unittest.mock import MagicMock
from app.services.state_service import StateService
from app.models.state import State
from app.schemas.state import StateCreate
from fastapi import HTTPException

@pytest.fixture
def db_session():
    return MagicMock()

def test_get_states_returns_list(db_session):
    db_session.query().order_by().offset().limit().all.return_value = [State(id=1, name='Active', sort_order=1)]
    result = StateService.get_states(db_session)
    assert isinstance(result, list)
    assert result[0].name == 'Active'

def test_create_state_success(db_session):
    db_session.query().filter().first.return_value = None
    db_session.add = MagicMock()
    db_session.commit = MagicMock()
    db_session.refresh = MagicMock()
    state_data = StateCreate(name='Inactive', description='Not active', sort_order=2)
    result = StateService.create_state(db_session, state_data)
    assert isinstance(result, State)
    assert result.name == 'Inactive'

def test_create_state_duplicate_name(db_session):
    db_session.query().filter().first.return_value = State(id=2, name='Inactive', sort_order=2)
    state_data = StateCreate(name='Inactive', description='Not active', sort_order=2)
    with pytest.raises(HTTPException) as exc:
        StateService.create_state(db_session, state_data)
    assert exc.value.status_code == 400
    assert 'already exists' in exc.value.detail
