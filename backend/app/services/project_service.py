from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.user import User
from app.repositories import project_repository
from app.schemas.project import ProjectCreate


def create_project(db: Session, user: User, data: ProjectCreate) -> Project:
    project = project_repository.create_project(
        db,
        student_id=user.id,
        title=data.title,
        description=data.description,
    )
    # TODO Milestone 2: trigger the AI blueprint pipeline here
    return project


def list_projects(db: Session, user: User) -> list[Project]:
    # Only this student's projects, newest first.
    return project_repository.list_by_student(db, user.id)