from ai_engine.agents.common import generate_structured
from ai_engine.schemas import TechnologyResult

def recommend_technology(project_idea: str, feasibility: dict, scope: dict,
                         skills: list[str] | None = None) -> TechnologyResult:
    prompt = f"""Act as a pragmatic software architect. Recommend a coherent minimal stack
that fits the scope, skills, time and budget. Explain trade-offs and limitations; do not
claim versions/availability were verified. Return JSON only matching:
{TechnologyResult.model_json_schema()}
Idea: {project_idea}
Skills: {skills or []}
Feasibility: {feasibility}
Scope: {scope}"""
    return generate_structured(prompt, TechnologyResult)
