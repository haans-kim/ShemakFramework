export const dynamic = "force-dynamic";

import db from "@/lib/db";
import PerformanceSkillPanel from "@/components/agents/PerformanceSkillPanel";

interface AgentResultRow {
  id: number;
  agent_type: string;
  target_org: string;
  result_title: string;
  result_summary: string;
  result_data_json: string;
  recommendations_json: string;
}

interface OrgUnitRow {
  org_code: string;
  org_name: string;
}

export default function PerformanceSkillPage() {
  const rows = db
    .prepare(
      "SELECT id, agent_type, target_org, result_title, result_summary, result_data_json, recommendations_json FROM agent_results WHERE agent_type = ?"
    )
    .all("performance_skill") as AgentResultRow[];

  if (rows.length === 0) {
    throw new Error(
      "No agent_results found for agent_type='performance_skill'. Run npm run seed first."
    );
  }

  const orgUnits = db
    .prepare("SELECT org_code, org_name FROM org_units")
    .all() as OrgUnitRow[];

  if (orgUnits.length === 0) {
    throw new Error("No org_units found in database. Run npm run seed first.");
  }

  const results = rows.map((row) => ({
    id: row.id,
    agent_type: row.agent_type,
    target_org: row.target_org,
    result_title: row.result_title,
    result_summary: row.result_summary,
    result_data: JSON.parse(row.result_data_json),
    recommendations: JSON.parse(row.recommendations_json) as string[],
  }));

  return <PerformanceSkillPanel results={results} orgUnits={orgUnits} />;
}
