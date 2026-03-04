"""make email unique

Revision ID: 8aff7431fc5d
Revises: 211108a408d4
Create Date: 2026-02-11 12:28:22.115673

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8aff7431fc5d'
down_revision: Union[str, None] = '211108a408d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    op.create_unique_constraint(
        "uq_users_email",
        "users",
        ["email"]
    )


def downgrade():
    op.drop_constraint(
        "uq_users_email",
        "users",
        type_="unique"
    )
