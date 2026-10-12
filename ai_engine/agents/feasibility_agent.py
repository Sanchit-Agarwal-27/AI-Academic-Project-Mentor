from ai_engine.agents.common import generate_structured
from ai_engine.schemas import FeasibilityResult

def analyse_feasibility(project_idea: str, duration_weeks: int, team_size: int,
                        skills: list[str] | None = None) -> FeasibilityResult:
    if not project_idea or len(project_idea.strip()) < 3:
        raise ValueError("Provide a meaningful project idea.")
    if not 1 <= duration_weeks <= 52:
        raise ValueError("duration_weeks must be 1..52.")
    if not 1 <= team_size <= 20:
        raise ValueError("team_size must be 1..20.")
    prompt = f"""Act as an academic feasibility analyst. Consider scope, time, team, skills,
data access and resources. State assumptions; do not invent resource availability.
Return JSON only matching this schema: {FeasibilityResult.model_json_schema()}
Idea: {project_idea}
Duration weeks: {duration_weeks}
Team size: {team_size}
Skills: {skills or []}"""
    return generate_structured(prompt, FeasibilityResult)
