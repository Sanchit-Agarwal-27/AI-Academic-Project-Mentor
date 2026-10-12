from ai_engine.agents.common import generate_structured
from ai_engine.schemas import ScopeResult

def define_scope(project_idea: str, feasibility: dict, duration_weeks: int,
                 team_size: int) -> ScopeResult:
    prompt = f"""Act as an academic scope analyst. Produce realistic objectives, target users,
functional/non-functional requirements, MVP, out-of-scope items, deliverables and measurable
success criteria. Return JSON only matching: {ScopeResult.model_json_schema()}
Idea: {project_idea}
Duration: {duration_weeks} weeks; team size: {team_size}
Feasibility: {feasibility}"""
    return generate_structured(prompt, ScopeResult)
