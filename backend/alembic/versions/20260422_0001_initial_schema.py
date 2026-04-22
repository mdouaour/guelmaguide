"""initial schema

Revision ID: 20260422_0001
Revises: 
Create Date: 2026-04-22 13:30:00
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "20260422_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "places",
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("category", sa.String(length=32), nullable=False),
        sa.Column("theme", sa.String(length=100), nullable=False),
        sa.Column("images", sa.JSON(), nullable=False),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint(
            "category IN ('forest', 'sport', 'sports', 'relaxation', 'culture', 'nature', 'thermal_baths')",
            name="ck_places_category",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_places_category"), "places", ["category"], unique=False)
    op.create_index(op.f("ix_places_created_at"), "places", ["created_at"], unique=False)
    op.create_index(op.f("ix_places_id"), "places", ["id"], unique=False)
    op.create_index(op.f("ix_places_latitude"), "places", ["latitude"], unique=False)
    op.create_index(op.f("ix_places_longitude"), "places", ["longitude"], unique=False)
    op.create_index(op.f("ix_places_name"), "places", ["name"], unique=False)
    op.create_index(op.f("ix_places_theme"), "places", ["theme"], unique=False)

    op.create_table(
        "users",
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=20), nullable=False),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("role IN ('visitor', 'organizer', 'admin')", name="ck_users_role"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_created_at"), "users", ["created_at"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    op.create_table(
        "activities",
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("place_id", sa.Integer(), nullable=False),
        sa.Column("organizer_id", sa.Integer(), nullable=False),
        sa.Column("date_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("max_participants", sa.Integer(), nullable=False),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("max_participants > 0", name="ck_activities_max_participants_positive"),
        sa.ForeignKeyConstraint(["organizer_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["place_id"], ["places.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_activities_created_at"), "activities", ["created_at"], unique=False)
    op.create_index(op.f("ix_activities_date_time"), "activities", ["date_time"], unique=False)
    op.create_index(op.f("ix_activities_id"), "activities", ["id"], unique=False)
    op.create_index(op.f("ix_activities_organizer_id"), "activities", ["organizer_id"], unique=False)
    op.create_index(op.f("ix_activities_place_id"), "activities", ["place_id"], unique=False)
    op.create_index(op.f("ix_activities_title"), "activities", ["title"], unique=False)

    op.create_table(
        "activity_registrations",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("activity_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["activity_id"], ["activities.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id", "activity_id"),
    )


def downgrade() -> None:
    op.drop_table("activity_registrations")
    op.drop_index(op.f("ix_activities_title"), table_name="activities")
    op.drop_index(op.f("ix_activities_place_id"), table_name="activities")
    op.drop_index(op.f("ix_activities_organizer_id"), table_name="activities")
    op.drop_index(op.f("ix_activities_id"), table_name="activities")
    op.drop_index(op.f("ix_activities_date_time"), table_name="activities")
    op.drop_index(op.f("ix_activities_created_at"), table_name="activities")
    op.drop_table("activities")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_created_at"), table_name="users")
    op.drop_table("users")
    op.drop_index(op.f("ix_places_theme"), table_name="places")
    op.drop_index(op.f("ix_places_name"), table_name="places")
    op.drop_index(op.f("ix_places_longitude"), table_name="places")
    op.drop_index(op.f("ix_places_latitude"), table_name="places")
    op.drop_index(op.f("ix_places_id"), table_name="places")
    op.drop_index(op.f("ix_places_created_at"), table_name="places")
    op.drop_index(op.f("ix_places_category"), table_name="places")
    op.drop_table("places")
