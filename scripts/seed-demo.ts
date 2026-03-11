import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "shemak.db");
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

console.log("[Seed] Creating tables...");

// Create tables
db.exec(`
  -- 조직 계층 (익명화)
  CREATE TABLE IF NOT EXISTS org_units (
    org_code TEXT PRIMARY KEY,
    org_name TEXT NOT NULL,
    org_level TEXT NOT NULL,
    parent_org_code TEXT,
    headcount INTEGER,
    display_order INTEGER
  );

  -- 팀별 인력관리 요약
  CREATE TABLE IF NOT EXISTS workforce_summary (
    org_code TEXT REFERENCES org_units(org_code),
    year_month TEXT,
    headcount INTEGER,
    avg_efficiency REAL,
    avg_work_hours REAL,
    overtime_ratio REAL,
    burnout_risk_level TEXT,
    PRIMARY KEY (org_code, year_month)
  );

  -- 팀별 인력계획 요약
  CREATE TABLE IF NOT EXISTS planning_summary (
    org_code TEXT REFERENCES org_units(org_code),
    year INTEGER,
    current_headcount INTEGER,
    forecast_headcount INTEGER,
    fte_required REAL,
    fte_actual REAL,
    gap_status TEXT,
    PRIMARY KEY (org_code, year)
  );

  -- 팀별 스킬 요약
  CREATE TABLE IF NOT EXISTS skill_summary (
    org_code TEXT REFERENCES org_units(org_code),
    skill_category TEXT,
    avg_proficiency REAL,
    required_level REAL,
    gap REAL,
    critical_skills_count INTEGER,
    PRIMARY KEY (org_code, skill_category)
  );

  -- 몰입도 조사 요약
  CREATE TABLE IF NOT EXISTS engagement_summary (
    org_code TEXT REFERENCES org_units(org_code),
    survey_date TEXT,
    engagement_score REAL,
    high_engagement_pct REAL,
    risk_pct REAL,
    top_factor TEXT,
    PRIMARY KEY (org_code, survey_date)
  );

  -- Agent 분석 결과
  CREATE TABLE IF NOT EXISTS agent_results (
    id INTEGER PRIMARY KEY,
    agent_type TEXT,
    target_org TEXT,
    result_title TEXT,
    result_summary TEXT,
    result_data_json TEXT,
    recommendations_json TEXT
  );

  -- IG Foundation Ontologies 메타데이터
  CREATE TABLE IF NOT EXISTS ontology_meta (
    db_name TEXT PRIMARY KEY,
    record_count TEXT,
    description TEXT,
    sample_fields_json TEXT
  );
`);

console.log("[Seed] Tables created. Inserting data...");

// Clear existing data
db.exec(`
  DELETE FROM workforce_summary;
  DELETE FROM planning_summary;
  DELETE FROM skill_summary;
  DELETE FROM engagement_summary;
  DELETE FROM agent_results;
  DELETE FROM ontology_meta;
  DELETE FROM org_units;
`);

// org_units (15 rows)
const insertOrg = db.prepare(
  "INSERT INTO org_units (org_code, org_name, org_level, parent_org_code, headcount, display_order) VALUES (?, ?, ?, ?, ?, ?)"
);

const orgData = [
  ["COMP", "IG모빌리티", "company", null, 210, 1],
  ["A", "A센터", "center", "COMP", 97, 2],
  ["A-1", "A-1담당", "division", "A", 55, 3],
  ["A-1-1", "A-1-1팀", "team", "A-1", 25, 4],
  ["A-1-2", "A-1-2팀", "team", "A-1", 30, 5],
  ["A-2", "A-2담당", "division", "A", 42, 6],
  ["A-2-1", "A-2-1팀", "team", "A-2", 20, 7],
  ["A-2-2", "A-2-2팀", "team", "A-2", 22, 8],
  ["B", "B센터", "center", "COMP", 95, 9],
  ["B-1", "B-1담당", "division", "B", 63, 10],
  ["B-1-1", "B-1-1팀", "team", "B-1", 35, 11],
  ["B-1-2", "B-1-2팀", "team", "B-1", 28, 12],
  ["B-2", "B-2담당", "division", "B", 32, 13],
  ["B-2-1", "B-2-1팀", "team", "B-2", 32, 14],
  ["C", "C센터", "center", "COMP", 18, 15],
  ["C-1", "C-1담당", "division", "C", 18, 16],
  ["C-1-1", "C-1-1팀", "team", "C-1", 18, 17],
];

for (const row of orgData) {
  insertOrg.run(...row);
}
console.log(`[Seed] org_units: ${orgData.length} rows`);

// workforce_summary (8 teams x 12 months = 96 rows)
const insertWorkforce = db.prepare(
  "INSERT INTO workforce_summary (org_code, year_month, headcount, avg_efficiency, avg_work_hours, overtime_ratio, burnout_risk_level) VALUES (?, ?, ?, ?, ?, ?, ?)"
);

const teams = ["A-1-1", "A-1-2", "A-2-1", "A-2-2", "B-1-1", "B-1-2", "B-2-1", "C-1-1"];
const teamHeadcounts: Record<string, number> = {
  "A-1-1": 25, "A-1-2": 30, "A-2-1": 20, "A-2-2": 22,
  "B-1-1": 35, "B-1-2": 28, "B-2-1": 32, "C-1-1": 18,
};

let workforceCount = 0;
for (const team of teams) {
  for (let m = 1; m <= 12; m++) {
    const month = `2025-${String(m).padStart(2, "0")}`;
    const hc = teamHeadcounts[team];

    // B-1-1팀은 번아웃 위험 시나리오
    const isBurnoutTeam = team === "B-1-1";
    const efficiency = isBurnoutTeam
      ? 60 + Math.random() * 10
      : 75 + Math.random() * 15;
    const workHours = isBurnoutTeam
      ? 48 + Math.random() * 5
      : 38 + Math.random() * 6;
    const overtimeRatio = isBurnoutTeam
      ? 35 + Math.random() * 15
      : 5 + Math.random() * 15;
    const risk = isBurnoutTeam ? "high" : efficiency < 80 ? "medium" : "low";

    insertWorkforce.run(
      team,
      month,
      hc,
      Math.round(efficiency * 10) / 10,
      Math.round(workHours * 10) / 10,
      Math.round(overtimeRatio * 10) / 10,
      risk
    );
    workforceCount++;
  }
}
console.log(`[Seed] workforce_summary: ${workforceCount} rows`);

// planning_summary (8 teams x 3 years = 24 rows)
const insertPlanning = db.prepare(
  "INSERT INTO planning_summary (org_code, year, current_headcount, forecast_headcount, fte_required, fte_actual, gap_status) VALUES (?, ?, ?, ?, ?, ?, ?)"
);

let planningCount = 0;
for (const team of teams) {
  const hc = teamHeadcounts[team];
  for (const year of [2025, 2026, 2027]) {
    const isBurnoutTeam = team === "B-1-1";
    const fteRequired = isBurnoutTeam ? hc * 1.2 + (year - 2025) * 2 : hc * 1.05 + (year - 2025);
    const fteActual = hc + (year - 2025) * (isBurnoutTeam ? 0.5 : 1);
    const gap = fteRequired - fteActual;
    const status = gap > 3 ? "shortage" : gap < -1 ? "surplus" : "balanced";

    insertPlanning.run(
      team,
      year,
      hc,
      Math.round(fteRequired),
      Math.round(fteRequired * 10) / 10,
      Math.round(fteActual * 10) / 10,
      status
    );
    planningCount++;
  }
}
console.log(`[Seed] planning_summary: ${planningCount} rows`);

// skill_summary (8 teams x 3 categories = 24 rows)
const insertSkill = db.prepare(
  "INSERT INTO skill_summary (org_code, skill_category, avg_proficiency, required_level, gap, critical_skills_count) VALUES (?, ?, ?, ?, ?, ?)"
);

const categories = ["technical", "leadership", "domain"];
let skillCount = 0;
for (const team of teams) {
  for (const cat of categories) {
    const isBurnoutTeam = team === "B-1-1";
    const avgProf = isBurnoutTeam
      ? 1.5 + Math.random() * 1.5
      : 2.5 + Math.random() * 1.5;
    const reqLevel = cat === "technical" ? 4.0 : cat === "leadership" ? 3.5 : 3.0;
    const gap = reqLevel - avgProf;
    const critical = isBurnoutTeam ? Math.floor(2 + Math.random() * 3) : Math.floor(Math.random() * 2);

    insertSkill.run(
      team,
      cat,
      Math.round(avgProf * 10) / 10,
      reqLevel,
      Math.round(gap * 10) / 10,
      critical
    );
    skillCount++;
  }
}
console.log(`[Seed] skill_summary: ${skillCount} rows`);

// engagement_summary (8 teams x 1 survey = 8 rows)
const insertEngagement = db.prepare(
  "INSERT INTO engagement_summary (org_code, survey_date, engagement_score, high_engagement_pct, risk_pct, top_factor) VALUES (?, ?, ?, ?, ?, ?)"
);

const factors = ["리더십", "성장기회", "보상만족", "업무자율성", "조직문화", "워라밸", "동료관계", "커리어"];
let engCount = 0;
for (let i = 0; i < teams.length; i++) {
  const team = teams[i];
  const isBurnoutTeam = team === "B-1-1";
  const score = isBurnoutTeam ? 2.8 + Math.random() * 0.5 : 3.5 + Math.random() * 1.0;
  const highPct = isBurnoutTeam ? 15 + Math.random() * 10 : 40 + Math.random() * 30;
  const riskPct = isBurnoutTeam ? 35 + Math.random() * 15 : 5 + Math.random() * 15;

  insertEngagement.run(
    team,
    "2025-06-01",
    Math.round(score * 10) / 10,
    Math.round(highPct * 10) / 10,
    Math.round(riskPct * 10) / 10,
    factors[i]
  );
  engCount++;
}
console.log(`[Seed] engagement_summary: ${engCount} rows`);

// agent_results (3 agents x 3 results = 9 rows)
const insertAgent = db.prepare(
  "INSERT INTO agent_results (agent_type, target_org, result_title, result_summary, result_data_json, recommendations_json) VALUES (?, ?, ?, ?, ?, ?)"
);

const agentData = [
  ["performance_skill", "B-1-1", "OCA 진단 결과", "B-1-1팀 조직역량 진단: 기술역량 부족, 리더십 보통",
    JSON.stringify({ scores: { technical: 2.1, leadership: 3.0, domain: 2.5 } }),
    JSON.stringify(["기술역량 강화 교육 필요", "멘토링 프로그램 도입"])],
  ["performance_skill", "A-1-1", "RACI 매트릭스", "A-1-1팀 역할 분석: 명확한 R/A 구분 필요",
    JSON.stringify({ clarity_score: 72 }),
    JSON.stringify(["역할 재정의 워크숍", "업무 프로세스 문서화"])],
  ["performance_skill", "B-2-1", "스킬 갭 리포트", "B-2-1팀 핵심 스킬 갭: 데이터분석, 공정설계",
    JSON.stringify({ gaps: [{ skill: "데이터분석", current: 1.5, required: 3.5 }, { skill: "공정설계", current: 2.0, required: 4.0 }] }),
    JSON.stringify(["외부 교육 이수", "사내 전문가 파견"])],
  ["compensation", "B-1-1", "급여 시뮬레이션", "B-1-1팀 보상 적정성: 시장 대비 92%",
    JSON.stringify({ market_ratio: 0.92, satisfaction: 3.1 }),
    JSON.stringify(["성과급 차등 확대", "비금전적 보상 강화"])],
  ["compensation", "A-2-1", "평가-몰입 분석", "평가등급별 몰입도 상관관계 분석",
    JSON.stringify({ correlation: 0.68 }),
    JSON.stringify(["평가 피드백 강화", "몰입도 연계 인센티브"])],
  ["compensation", "COMP", "전사 보상 벤치마크", "전사 보상 수준 시장 대비 분석",
    JSON.stringify({ overall_ratio: 0.95 }),
    JSON.stringify(["직군별 차등 조정", "핵심인재 리텐션 패키지"])],
  ["staffing", "B-1-1", "채용 요건", "B-1-1팀 2명 충원 필요: 공정설계, 데이터분석 전문가",
    JSON.stringify({ positions: 2, skills: ["공정설계", "데이터분석"] }),
    JSON.stringify(["경력직 채용 우선", "내부 전환 배치 검토"])],
  ["staffing", "A-1-2", "워크로드 분석", "A-1-2팀 워크로드 분석: 현재 적정 수준",
    JSON.stringify({ workload_index: 0.85 }),
    JSON.stringify(["현 인력 유지", "효율화 프로젝트 추진"])],
  ["staffing", "C-1-1", "조직 구조 제안", "C-1-1팀 성장 시나리오별 조직 구조 제안",
    JSON.stringify({ scenarios: ["현상유지", "확대", "분리"] }),
    JSON.stringify(["확대 시나리오 권장", "단계적 채용 계획 수립"])],
];

for (const row of agentData) {
  insertAgent.run(...row);
}
console.log(`[Seed] agent_results: ${agentData.length} rows`);

// ontology_meta (7 rows)
const insertOntology = db.prepare(
  "INSERT INTO ontology_meta (db_name, record_count, description, sample_fields_json) VALUES (?, ?, ?, ?)"
);

const ontologyData = [
  ["의식DB", "24,843,000", "전사 의식조사 원천 데이터", JSON.stringify(["survey_id", "question_code", "response_value"])],
  ["기능DB", "1,200", "조직 기능 분류 체계", JSON.stringify(["function_code", "function_name", "level"])],
  ["업무DB", "60,000", "업무 프로세스 정의", JSON.stringify(["task_id", "task_name", "process_code"])],
  ["직무DB", "15,000", "직무 분류 및 역할 정의", JSON.stringify(["job_code", "job_title", "job_family"])],
  ["SkillDB", "100,000", "스킬 온톨로지", JSON.stringify(["skill_id", "skill_name", "category", "level"])],
  ["평가DB", "6,000", "성과 평가 기준 체계", JSON.stringify(["eval_code", "eval_criteria", "weight"])],
  ["역량DB", "8,500", "역량 모델 정의", JSON.stringify(["competency_id", "competency_name", "domain"])],
];

for (const row of ontologyData) {
  insertOntology.run(...row);
}
console.log(`[Seed] ontology_meta: ${ontologyData.length} rows`);

// Summary
const totalRows =
  orgData.length +
  workforceCount +
  planningCount +
  skillCount +
  engCount +
  agentData.length +
  ontologyData.length;

console.log(`\n[Seed] Complete! Total: ${totalRows} rows`);

db.close();
