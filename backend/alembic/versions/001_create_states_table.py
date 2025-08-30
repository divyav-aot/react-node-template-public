"""create states table

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create states table
    op.create_table('states',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('description', sa.String(length=200), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index('idx_states_name', 'states', ['name'], unique=True)
    op.create_index('idx_states_sort_order', 'states', ['sort_order'], unique=False)
    op.create_index('idx_states_active', 'states', ['is_active'], unique=False)
    
    # Insert default states
    op.execute("""
        INSERT INTO states (name, description, is_active, sort_order) VALUES
        ('New', 'New item or task', true, 1),
        ('In Progress', 'Item or task is being worked on', true, 2),
        ('Done', 'Item or task is completed', true, 3)
    """)

    # Create trigger function for updated_at
    op.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    """)
    
    # Create trigger for states updated_at
    op.execute("""
        CREATE TRIGGER update_states_updated_at 
            BEFORE UPDATE ON states 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    """)


def downgrade() -> None:
     # Drop trigger
    op.execute("DROP TRIGGER IF EXISTS update_states_updated_at ON states;")
    
    # Drop indexes
    op.drop_index('idx_states_active', table_name='states')
    op.drop_index('idx_states_sort_order', table_name='states')
    op.drop_index('idx_states_name', table_name='states')
    
    # Drop table
    op.drop_table('states') 