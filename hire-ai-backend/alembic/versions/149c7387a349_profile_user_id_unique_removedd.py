"""profile user_id unique removedd

Revision ID: 149c7387a349
Revises: 1e7e25d41374
Create Date: 2026-03-03 12:52:57.498739

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '149c7387a349'
down_revision: Union[str, None] = '1e7e25d41374'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Drop foreign key constraint first
    op.drop_constraint(
        'candidate_profiles_ibfk_1',
        'candidate_profiles',
        type_='foreignkey'
    )

    # 2. Drop UNIQUE index
    op.drop_index(
        'ix_candidate_profiles_user_id',
        table_name='candidate_profiles'
    )

    # 3. Recreate NON-UNIQUE index
    op.create_index(
        'ix_candidate_profiles_user_id',
        'candidate_profiles',
        ['user_id'],
        unique=False
    )

    # 4. Recreate foreign key
    op.create_foreign_key(
        'candidate_profiles_ibfk_1',
        'candidate_profiles',
        'users',
        ['user_id'],
        ['id']
    )

    
def downgrade() -> None:
    # 1. Drop FK
    op.drop_constraint(
        'candidate_profiles_ibfk_1',
        'candidate_profiles',
        type_='foreignkey'
    )

    # 2. Drop non-unique index
    op.drop_index(
        'ix_candidate_profiles_user_id',
        table_name='candidate_profiles'
    )

    # 3. Recreate UNIQUE index
    op.create_index(
        'ix_candidate_profiles_user_id',
        'candidate_profiles',
        ['user_id'],
        unique=True
    )

    # 4. Recreate FK
    op.create_foreign_key(
        'candidate_profiles_ibfk_1',
        'candidate_profiles',
        'users',
        ['user_id'],
        ['id']
    )