from typing import Literal
from pydantic import BaseModel, Field, ConfigDict

class StrictSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

class FeasibilityResult(StrictSchema):
    project_title: str
    problem_statement: str
    feasibility: Literal["High", "Medium", "Low"]
    complexity: Literal["Beginner", "Intermediate", "Advanced"]
    required_skills: list[str]
    required_resources: list[str]
    potential_challenges: list[str]
    recommendations: list[str]
    assumptions: list[str]
    reasoning: str

class ScopeResult(StrictSchema):
    project_title: str
    project_objective: str
    target_users: list[str]
    functional_requirements: list[str]
    non_functional_requirements: list[str]
    mvp_features: list[str]
    out_of_scope: list[str]
    deliverables: list[str]
    success_criteria: list[str]

class TechnologyResult(StrictSchema):
    frontend: list[str]
    backend: list[str]
    database: list[str]
    ai_ml: list[str]
    deployment: list[str]
    development_tools: list[str]
    alternatives: list[str]
    rationale: str
    limitations: list[str]

class PlannedPhase(StrictSchema):
    phase_name: str
    start_week: int = Field(ge=1)
    duration_weeks: int = Field(ge=1)
    tasks: list[str]
    deliverables: list[str]
    dependencies: list[str]

class PlanningResult(StrictSchema):
    total_duration_weeks: int = Field(ge=1)
    phases: list[PlannedPhase]

class ProjectRisk(StrictSchema):
    risk: str
    likelihood: Literal["Low", "Medium", "High"]
    impact: Literal["Low", "Medium", "High"]
    mitigation: str
    contingency_plan: str

class RiskResult(StrictSchema):
    risks: list[ProjectRisk]
