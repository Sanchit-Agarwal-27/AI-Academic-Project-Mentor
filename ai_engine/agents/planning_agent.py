from ai_engine.agents.common import generate_structured
from ai_engine.schemas import PlanningResult

def create_plan(project_idea: str, duration_weeks: int, team_size: int,
                scope: dict, technology: dict) -> PlanningResult:
    if not 1 <= duration_weeks <= 52:
        raise ValueError("duration_weeks must be 1..52.")
    prompt = f"""Act as an academic project planner. Create a practical week-based plan that
fits the duration. Use week numbers from 1 and include tasks, deliverables and dependencies.
Return JSON only matching: {PlanningResult.model_json_schema()}
Idea: {project_idea}; duration: {duration_weeks} weeks; team: {team_size}
Scope: {scope}
Technology: {technology}"""
    result = generate_structured(prompt, PlanningResult)
    if result.total_duration_weeks != duration_weeks:
        raise ValueError("Planning duration differs from requested duration.")
    for phase in result.phases:
        if phase.start_week + phase.duration_weeks - 1 > duration_weeks:
            raise ValueError(f"Phase {phase.phase_name!r} exceeds requested duration.")
    return result
