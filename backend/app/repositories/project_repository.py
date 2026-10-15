import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project


def create_project(db: Session, student_id: uuid.UUID, title: str, description: str) -> Project:
    project = Project(student_id=student_id, title=title, description=description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def list_by_student(db: Session, student_id: uuid.UUID) -> list[Project]:
    stmt = (
        select(Project)
        .where(Project.student_id == student_id)
        .order_by(Project.created_at.desc())
    )
    return list(db.scalars(stmt).all())