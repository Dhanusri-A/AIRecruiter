"""add user_id to job_descriptions

Revision ID: 211108a408d4
Revises: 
Create Date: 2026-02-09 15:06:37.652589

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '211108a408d4'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add column
    op.add_column(
        "job_descriptions",
        sa.Column("user_id", sa.String(36), nullable=False)
    )

    # Create foreign key constraint
    op.create_foreign_key(
        "fk_job_user",
        source_table="job_descriptions",
        referent_table="users",
        local_cols=["user_id"],
        remote_cols=["id"],
        ondelete="CASCADE"
    )

    # Optional: create index
    op.create_index("ix_job_descriptions_user_id", "job_descriptions", ["user_id"])


def downgrade() -> None:
    # Drop index
    op.drop_index("ix_job_descriptions_user_id", table_name="job_descriptions")

    # Drop foreign key
    op.drop_constraint("fk_job_user", "job_descriptions", type_="foreignkey")

    # Drop column
    op.drop_column("job_descriptions", "user_id")
