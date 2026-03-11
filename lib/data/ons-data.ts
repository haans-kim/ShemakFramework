// =============================================================================
// ONS Case: 조직진단 Survey 몰입도 예측 — 오***
// =============================================================================

export const surveyMeta = {
  client: "오***",
  subtitle: "조직진단 Survey",
  totalRespondents: 1007,
  engagementAvg: 57.8,
  engagementGroup: 64.7,
  engagementGap: -6.9,
  period: "2026.03",
};

// ---------------------------------------------------------------------------
// KPI
// ---------------------------------------------------------------------------
export const kpiData = {
  totalRespondents: {
    title: "분석 대상",
    value: "1,007명",
    subtitle: "조직진단 Survey 전사",
    status: "info" as const,
  },
  engagementAvg: {
    title: "몰입도 평균",
    value: "57.8%",
    subtitle: "그룹 64.7% (gap -6.9%p)",
    status: "danger" as const,
  },
  cautionRate: {
    title: "주의 필요 비중",
    value: "34.6%",
    subtitle: "348명 / 퇴직자 58.7%",
    status: "warning" as const,
  },
  highEngagement: {
    title: "고몰입 비중",
    value: "19.4%",
    subtitle: "195명 / YoY +3.3%",
    status: "success" as const,
  },
};

// ---------------------------------------------------------------------------
// 몰입도 5대 지표
// ---------------------------------------------------------------------------
export interface Indicator {
  name: string;
  val: number;
  grp: number;
}

export const indicators: Indicator[] = [
  { name: "추천의사", val: 57.9, grp: 60.2 },
  { name: "자부심", val: 63.0, grp: 71.2 },
  { name: "재직의사", val: 52.2, grp: 60.7 },
  { name: "만족감", val: 61.5, grp: 64.0 },
  { name: "성장감", val: 54.6, grp: 67.7 },
];

// ---------------------------------------------------------------------------
// Survey 6개 영역
// ---------------------------------------------------------------------------
export interface SurveyArea {
  name: string;
  val: number;
  grp: number;
}

export const surveyAreas: SurveyArea[] = [
  { name: "경영철학 이해/실천", val: 79.2, grp: 82.2 },
  { name: "중기전략 이해/실천", val: 74.9, grp: 79.5 },
  { name: "일하는 방식", val: 69.2, grp: 74.2 },
  { name: "리더 변화의지/실천", val: 67.6, grp: 72.8 },
  { name: "조직/프로세스", val: 54.2, grp: 59.9 },
  { name: "인사제도", val: 55.0, grp: 62.7 },
];

// ---------------------------------------------------------------------------
// 몰입 유형 4분류
// ---------------------------------------------------------------------------
export interface EngagementType {
  id: string;
  label: string;
  n: number;
  pct: number;
  yoy: string;
  color: string;
  scores: Record<string, number>;
  turnover: { n: number; pct: number };
  engScore: number;
  desc: string[];
}

export const engagementTypes: EngagementType[] = [
  {
    id: "high",
    label: "고몰입",
    n: 195,
    pct: 19.4,
    yoy: "+3.3%",
    color: "#3b82f6",
    scores: { 추천의사: 4.8, 자부심: 4.9, 재직의사: 4.8, 만족감: 4.8, 성장감: 4.8 },
    turnover: { n: 5, pct: 7.9 },
    engScore: 92,
    desc: [
      "전사 구성원 중 약 20%가 고몰입 유형으로 분류",
      "회사의 성장 준비 노력을 가장 중요하게 여기나 본인 실천 여부는 몰입에 대한 영향력이 크지 않음",
      "다양한 기회를 통한 성장 기회가 고몰입을 유도",
      "타 유형에 비해 4,50대 구성원 및 리더의 비중이 높음",
      "퇴직자 5명(7.9%) — 전 유형 중 최저",
    ],
  },
  {
    id: "caution",
    label: "주의 필요",
    n: 348,
    pct: 34.6,
    yoy: "-1.9%",
    color: "#ef4444",
    scores: { 추천의사: 2.5, 자부심: 2.8, 재직의사: 2.4, 만족감: 2.7, 성장감: 2.5 },
    turnover: { n: 37, pct: 58.7 },
    engScore: 28,
    desc: [
      "전사 구성원 중 약 35%가 주의 필요 유형으로 분류 — 40대, 비직책자, IT 직군 중심",
      "회사 성장 준비 노력과 비전 실천 정도가 영향력 높음",
      "리더 인재 육성과 평가 보상 공정성 영향이 상위",
      "퇴직자 37명(58.7%) — 전 유형 중 최고. 보상 수준 개선과 평가 차등 공정성 인식 제고 필요",
      "조직간 비중 편차가 큰 편이며, 사업개발담당은 구성원 과반이 해당",
    ],
  },
  {
    id: "general",
    label: "일반",
    n: 453,
    pct: 45.0,
    yoy: "-1.0%",
    color: "#10b981",
    scores: { 추천의사: 3.8, 자부심: 3.9, 재직의사: 3.7, 만족감: 3.9, 성장감: 3.8 },
    turnover: { n: 21, pct: 33.3 },
    engScore: 68,
    desc: [
      "전사 구성원 중 약 45%가 일반 유형으로 분류 — 가장 큰 비중",
      "몰입도 5개 지표 점수가 평균 3.7~3.9 수준으로 안정적 몰입 수준 보유",
      "역량 계발 기회, 복리후생, 평가/보상 등 인사 전략 연계 문항의 영향력이 높음",
      "인재 키워드가 Top 10 문항 중 3번 반복 — 사람/인재 중심 문화의 영향력이 높음",
      "조직간 편차가 적은 편, 조직별 약 30~50% 비중 차지",
    ],
  },
  {
    id: "quiet",
    label: "조용한 사직",
    n: 11,
    pct: 1.1,
    yoy: "-0.3%",
    color: "#6b7280",
    scores: { 추천의사: 2.8, 자부심: 3.0, 재직의사: 4.1, 만족감: 2.9, 성장감: 2.8 },
    turnover: { n: 0, pct: 0 },
    engScore: 35,
    desc: [
      "전사 구성원 중 약 1%가 조용한 사직 유형 — 인원 적으나 전원 비직책자",
      "재직의사는 높으나(4.1), 타 몰입도 지표 수준은 평균 3.0 이하",
      "리더인재확보육성 문항 영향력 0.4로 모든 유형 중 가장 높음",
      "팀내 R&R에 대한 인식이 조용한 사직 유형 분류에 높은 영향력",
      "타 유형 대비 평가보상 영향력 낮음",
    ],
  },
];

// ---------------------------------------------------------------------------
// SHAP 10대 요인 (with baseRate for positive-rate slider)
// ---------------------------------------------------------------------------
export interface ShapFactor {
  key: string;
  label: string;
  area: string;
  baseRate: number;
  shap: Record<string, number>;
}

export const shapFactors: ShapFactor[] = [
  { key: "company_practice", label: "회사실천준비", area: "경영철학", baseRate: 50.4, shap: { high: 0.50, caution: 0.48, general: 0.45, quiet: 0.47 } },
  { key: "leader_talent", label: "리더인재확보육성", area: "리더", baseRate: 29.0, shap: { high: 0.45, caution: 0.29, general: 0.19, quiet: 0.40 } },
  { key: "talent_first", label: "인재제일", area: "경영철학", baseRate: 79.1, shap: { high: 0.21, caution: 0.27, general: 0.22, quiet: 0.30 } },
  { key: "vision_share", label: "비전/전략공유", area: "경영철학", baseRate: 45.5, shap: { high: 0.25, caution: 0.26, general: 0.23, quiet: 0.29 } },
  { key: "eval_reward", label: "평가보상", area: "인사제도", baseRate: 12.2, shap: { high: 0.16, caution: 0.25, general: 0.21, quiet: 0.12 } },
  { key: "vision_practice", label: "비전/전략실천", area: "경영철학", baseRate: 47.5, shap: { high: 0.10, caution: 0.24, general: 0.18, quiet: 0.22 } },
  { key: "welfare", label: "복리후생", area: "인사제도", baseRate: 17.1, shap: { high: 0.20, caution: 0.23, general: 0.22, quiet: 0.29 } },
  { key: "vision_empathy", label: "비전공감", area: "경영철학", baseRate: 74.8, shap: { high: 0.25, caution: 0.21, general: 0.16, quiet: 0.19 } },
  { key: "talent", label: "인재", area: "경영철학", baseRate: 61.0, shap: { high: 0.14, caution: 0.19, general: 0.16, quiet: 0.21 } },
  { key: "communication", label: "의사소통", area: "일하는 방식", baseRate: 39.4, shap: { high: 0.12, caution: 0.19, general: 0.12, quiet: 0.21 } },
];

// ---------------------------------------------------------------------------
// Org-specific SHAP factor (single importance value)
// ---------------------------------------------------------------------------
export interface OrgShapFactor {
  key: string;
  label: string;
  area: string;
  baseRate: number;
  shap: number;
}

// ---------------------------------------------------------------------------
// Sub-team data
// ---------------------------------------------------------------------------
export interface SubTeam {
  name: string;
  n: number;
  types: Record<string, number>;
  engagement: number;
}

// ---------------------------------------------------------------------------
// 11개 조직 데이터
// ---------------------------------------------------------------------------
export interface OrgArea {
  area: string;
  rate: number;
  comp: number;
}

export interface OrgTask {
  keyword: string;
  rate: string;
  rank: number;
}

export interface OrgDirection {
  area: string;
  dir: string;
  detail: string;
}

export interface OrgData {
  name: string;
  n: number;
  types: Record<string, number>;
  typeN: Record<string, number>;
  engagement: number;
  scores: Record<string, number>;
  areas: OrgArea[];
  strengthen: OrgTask[];
  improve: OrgTask[];
  directions: OrgDirection[];
  execSummary: string;
  orgBaseRates?: Record<string, number>;
  orgShapFactors?: OrgShapFactor[];
  teams?: SubTeam[];
}

export const orgs: OrgData[] = [
  {
    name: "사업개발담당", n: 46,
    types: { high: 10.9, caution: 60.9, general: 28.3, quiet: 0 },
    typeN: { high: 5, caution: 28, general: 13, quiet: 0 },
    engagement: 37.4,
    scores: { 추천의사: 34.8, 자부심: 41.3, 재직의사: 30.4, 만족감: 32.6, 성장감: 47.8 },
    areas: [
      { area: "경영철학 이해/실천", rate: 72.1, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 60.0, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 47.8, comp: 67.6 },
      { area: "일하는 방식", rate: 47.0, comp: 69.2 },
      { area: "조직/프로세스", rate: 29.0, comp: 54.2 },
      { area: "인사제도", rate: 43.5, comp: 55.0 },
    ],
    strengthen: [{ keyword: "인재제일", rate: "89.3%", rank: 4 }],
    improve: [
      { keyword: "리더인재확보육성", rate: "10.7%", rank: 1 },
      { keyword: "리더책임감헌신", rate: "25.0%", rank: 2 },
      { keyword: "권한위임", rate: "10.7%", rank: 3 },
      { keyword: "비전전략이해공감", rate: "35.7%", rank: 5 },
      { keyword: "의사소통", rate: "28.6%", rank: 6 },
    ],
    directions: [
      { area: "조직/중기전략", dir: "개선", detail: "전략 방향 이해/공감 개선 필요" },
      { area: "리더", dir: "집중개선", detail: "인재확보/육성, 조직 성과 헌신 노력" },
      { area: "인사제도", dir: "개선", detail: "담당자 권한 확대 방안 필요" },
      { area: "일하는 방식", dir: "개선", detail: "수직적/수평적 의사소통 개선" },
    ],
    execSummary: "주의 필요 유형이 60.9%로 전사 최고 수준. 리더의 인재확보/육성 노력, 권한위임, 의사소통 개선이 시급하며, 인력 유지를 위한 집중 관리가 필요합니다.",
    orgBaseRates: { company_practice: 58.7, leader_talent: 43.5, talent_first: 93.5, vision_share: 58.7, eval_reward: 37.0, vision_practice: 63.0, welfare: 47.8, vision_empathy: 87.0, talent: 52.2, communication: 50.0 },
    orgShapFactors: [
      { key: "조직간R_R", label: "조직간R&R", area: "조직/프로세스", baseRate: 26.1, shap: 0.2986 },
      { key: "복리후생", label: "복리후생", area: "인사제도", baseRate: 47.8, shap: 0.1363 },
      { key: "존중", label: "존중", area: "경영철학", baseRate: 47.8, shap: 0.0924 },
      { key: "평가보상", label: "평가보상", area: "인사제도", baseRate: 37.0, shap: 0.0678 },
      { key: "비전공감", label: "비전공감", area: "경영철학", baseRate: 87.0, shap: 0.0670 },
      { key: "리더인재확보육성", label: "리더인재확보육성", area: "리더", baseRate: 43.5, shap: 0.0665 },
      { key: "조직간협업", label: "조직간협업", area: "조직/프로세스", baseRate: 26.1, shap: 0.0543 },
      { key: "창의", label: "창의", area: "경영철학", baseRate: 58.7, shap: 0.0495 },
      { key: "회사실천준비", label: "회사실천준비", area: "경영철학", baseRate: 58.7, shap: 0.0306 },
      { key: "프로세스효율성", label: "프로세스효율성", area: "조직/프로세스", baseRate: 34.8, shap: 0.0200 },
    ],
    teams: [
      { name: "플랫폼기획팀", n: 14, types: { high: 14.3, caution: 57.1, general: 28.6, quiet: 0 }, engagement: 40.2 },
      { name: "제휴사업팀", n: 12, types: { high: 8.3, caution: 66.7, general: 25.0, quiet: 0 }, engagement: 34.8 },
      { name: "서비스운영팀", n: 11, types: { high: 9.1, caution: 63.6, general: 27.3, quiet: 0 }, engagement: 36.1 },
      { name: "마케팅팀", n: 9, types: { high: 11.1, caution: 55.6, general: 33.3, quiet: 0 }, engagement: 39.5 },
    ],
  },
  {
    name: "정보보안담당", n: 49,
    types: { high: 18.4, caution: 42.9, general: 38.8, quiet: 0 },
    typeN: { high: 9, caution: 21, general: 19, quiet: 0 },
    engagement: 50.2,
    scores: { 추천의사: 49.0, 자부심: 51.0, 재직의사: 44.9, 만족감: 53.1, 성장감: 53.1 },
    areas: [
      { area: "경영철학 이해/실천", rate: 73.0, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 63.7, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 63.7, comp: 67.6 },
      { area: "일하는 방식", rate: 60.7, comp: 69.2 },
      { area: "조직/프로세스", rate: 35.4, comp: 54.2 },
      { area: "인사제도", rate: 52.6, comp: 55.0 },
    ],
    strengthen: [],
    improve: [
      { keyword: "의사소통", rate: "28.6%", rank: 1 },
      { keyword: "교육", rate: "19.0%", rank: 3 },
      { keyword: "온리원체화", rate: "23.8%", rank: 8 },
      { keyword: "리더인재확보육성", rate: "28.6%", rank: 9 },
      { keyword: "복리후생", rate: "14.3%", rank: 10 },
    ],
    directions: [
      { area: "경영철학", dir: "개선", detail: "Only One 체화 수준 개선" },
      { area: "리더", dir: "개선", detail: "최고 인재 확보 노력 개선" },
      { area: "인사제도", dir: "개선", detail: "복리후생 수준, 교육 기회 확대" },
      { area: "일하는 방식", dir: "집중개선", detail: "의사소통 개선 시급" },
    ],
    execSummary: "주의 필요 유형 42.9%로 전사 대비 높음. 의사소통 개선이 가장 시급하며, Only One 체화, 인재 확보, 복리후생/교육 기회 확대가 핵심 과제입니다.",
    orgBaseRates: { company_practice: 65.3, leader_talent: 61.2, talent_first: 85.7, vision_share: 63.3, eval_reward: 44.9, vision_practice: 63.3, welfare: 44.9, vision_empathy: 83.7, talent: 46.9, communication: 61.2 },
    orgShapFactors: [
      { key: "리더솔선수범", label: "리더솔선수범", area: "리더", baseRate: 59.2, shap: 0.5373 },
      { key: "회사실천준비", label: "회사실천준비", area: "경영철학", baseRate: 65.3, shap: 0.3173 },
      { key: "복리후생", label: "복리후생", area: "인사제도", baseRate: 44.9, shap: 0.1113 },
      { key: "존중", label: "존중", area: "경영철학", baseRate: 79.6, shap: 0.0987 },
      { key: "정직", label: "정직", area: "경영철학", baseRate: 87.8, shap: 0.0788 },
      { key: "평가보상", label: "평가보상", area: "인사제도", baseRate: 44.9, shap: 0.0755 },
      { key: "비전_전략실천", label: "비전/전략실천", area: "경영철학", baseRate: 63.3, shap: 0.0528 },
      { key: "인재", label: "인재", area: "경영철학", baseRate: 46.9, shap: 0.0260 },
      { key: "상생", label: "상생", area: "경영철학", baseRate: 61.2, shap: 0.0169 },
      { key: "ONLYONE재건", label: "ONLYONE재건", area: "경영철학", baseRate: 83.7, shap: 0.0132 },
    ],
    teams: [
      { name: "보안관제팀", n: 15, types: { high: 13.3, caution: 46.7, general: 40.0, quiet: 0 }, engagement: 48.5 },
      { name: "보안기획팀", n: 13, types: { high: 23.1, caution: 38.5, general: 38.5, quiet: 0 }, engagement: 53.8 },
      { name: "정보보호팀", n: 12, types: { high: 16.7, caution: 50.0, general: 33.3, quiet: 0 }, engagement: 47.2 },
      { name: "개인정보보호팀", n: 9, types: { high: 22.2, caution: 33.3, general: 44.4, quiet: 0 }, engagement: 54.1 },
    ],
  },
  {
    name: "기술1담당", n: 487,
    types: { high: 17.0, caution: 37.6, general: 43.9, quiet: 1.4 },
    typeN: { high: 83, caution: 183, general: 214, quiet: 7 },
    engagement: 55.0,
    scores: { 추천의사: 55.4, 자부심: 60.4, 재직의사: 49.1, 만족감: 52.4, 성장감: 57.9 },
    areas: [
      { area: "경영철학 이해/실천", rate: 78.9, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 73.8, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 66.9, comp: 67.6 },
      { area: "일하는 방식", rate: 69.7, comp: 69.2 },
      { area: "조직/프로세스", rate: 56.1, comp: 54.2 },
      { area: "인사제도", rate: 52.0, comp: 55.0 },
    ],
    strengthen: [{ keyword: "VALUE UP", rate: "89.6%", rank: 7 }],
    improve: [
      { keyword: "복리후생", rate: "16.9%", rank: 1 },
      { keyword: "상생", rate: "44.8%", rank: 2 },
      { keyword: "평가보상", rate: "13.1%", rank: 4 },
      { keyword: "교육", rate: "20.2%", rank: 6 },
      { keyword: "조직간R&R", rate: "25.7%", rank: 8 },
    ],
    directions: [
      { area: "경영철학", dir: "유지", detail: "Value Up 공감 유지" },
      { area: "인사제도", dir: "집중개선", detail: "보상수준 개선 시급, 평가공정성 점검" },
      { area: "조직/프로세스", dir: "개선", detail: "조직 R&R 명확화" },
    ],
    execSummary: "최대 조직(487명)으로 주의 필요 37.6%. 보상수준 개선이 가장 시급하며, 평가 공정성 인식 제고와 조직간 R&R 명확화가 핵심 개선 과제입니다.",
    orgBaseRates: { company_practice: 74.9, leader_talent: 61.8, talent_first: 87.9, vision_share: 72.9, eval_reward: 46.6, vision_practice: 72.5, welfare: 46.0, vision_empathy: 88.9, talent: 61.0, communication: 68.2 },
    orgShapFactors: [
      { key: "복리후생", label: "복리후생", area: "인사제도", baseRate: 46.0, shap: 0.1548 },
      { key: "WLB", label: "WLB", area: "일하는 방식", baseRate: 70.0, shap: 0.1019 },
      { key: "팀내R_R", label: "팀내R&R", area: "일하는 방식", baseRate: 64.1, shap: 0.081 },
      { key: "창의", label: "창의", area: "경영철학", baseRate: 71.9, shap: 0.0785 },
      { key: "회사목표달성의지", label: "회사목표달성의지", area: "경영철학", baseRate: 76.4, shap: 0.0621 },
      { key: "리더인재확보육성", label: "리더인재확보육성", area: "리더", baseRate: 61.8, shap: 0.059 },
      { key: "인재", label: "인재", area: "경영철학", baseRate: 61.0, shap: 0.0588 },
      { key: "회사실천준비", label: "회사실천준비", area: "경영철학", baseRate: 74.9, shap: 0.0556 },
      { key: "상생", label: "상생", area: "경영철학", baseRate: 72.5, shap: 0.0554 },
      { key: "리더책임감헌신", label: "리더책임감헌신", area: "리더", baseRate: 72.3, shap: 0.0536 },
    ],
    teams: [
      { name: "미디어콘텐츠팀", n: 140, types: { high: 16.4, caution: 36.4, general: 45.7, quiet: 1.4 }, engagement: 56.8 },
      { name: "글로벌DT팀", n: 77, types: { high: 13.0, caution: 41.6, general: 45.5, quiet: 0 }, engagement: 54.5 },
      { name: "ERP솔루션팀", n: 76, types: { high: 23.7, caution: 36.8, general: 36.8, quiet: 2.6 }, engagement: 58.0 },
      { name: "스마트물류팀", n: 75, types: { high: 10.7, caution: 49.3, general: 40.0, quiet: 0 }, engagement: 50.8 },
      { name: "유통엔터팀", n: 68, types: { high: 23.5, caution: 19.1, general: 52.9, quiet: 4.4 }, engagement: 64.5 },
      { name: "식품바이오팀", n: 43, types: { high: 20.9, caution: 39.5, general: 39.5, quiet: 0 }, engagement: 57.1 },
      { name: "기술지원팀", n: 8, types: { high: 0, caution: 62.5, general: 37.5, quiet: 0 }, engagement: 43.0 },
    ],
  },
  {
    name: "인사담당", n: 22,
    types: { high: 18.2, caution: 31.8, general: 50.0, quiet: 0 },
    typeN: { high: 4, caution: 7, general: 11, quiet: 0 },
    engagement: 64.5,
    scores: { 추천의사: 63.6, 자부심: 77.3, 재직의사: 54.5, 만족감: 68.2, 성장감: 59.1 },
    areas: [
      { area: "경영철학 이해/실천", rate: 77.7, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 77.3, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 70.9, comp: 67.6 },
      { area: "일하는 방식", rate: 54.5, comp: 69.2 },
      { area: "조직/프로세스", rate: 50.0, comp: 54.2 },
      { area: "인사제도", rate: 65.9, comp: 55.0 },
    ],
    strengthen: [{ keyword: "정직", rate: "85.7%", rank: 10 }],
    improve: [
      { keyword: "교육", rate: "0.0%", rank: 1 },
      { keyword: "WLB", rate: "0.0%", rank: 2 },
      { keyword: "창의", rate: "0.0%", rank: 3 },
      { keyword: "다양한기회", rate: "0.0%", rank: 4 },
      { keyword: "조직간협업", rate: "0.0%", rank: 9 },
    ],
    directions: [{ area: "일하는 방식", dir: "집중개선", detail: "교육, WLB, 창의 영역 전반 개선" }],
    execSummary: "일하는 방식 영역이 전사 대비 크게 낮아(54.5% vs 69.2%) 교육, WLB, 창의 영역의 전반적 개선이 필요합니다.",
    orgBaseRates: { company_practice: 68.2, leader_talent: 68.2, talent_first: 90.9, vision_share: 86.4, eval_reward: 63.6, vision_practice: 72.7, welfare: 72.7, vision_empathy: 90.9, talent: 59.1, communication: 54.5 },
  },
  {
    name: "기술2담당", n: 140,
    types: { high: 21.4, caution: 30.7, general: 46.4, quiet: 1.4 },
    typeN: { high: 30, caution: 43, general: 65, quiet: 2 },
    engagement: 61.9,
    scores: { 추천의사: 57.9, 자부심: 67.1, 재직의사: 59.3, 만족감: 59.3, 성장감: 65.7 },
    areas: [
      { area: "경영철학 이해/실천", rate: 78.1, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 76.4, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 63.8, comp: 67.6 },
      { area: "일하는 방식", rate: 69.6, comp: 69.2 },
      { area: "조직/프로세스", rate: 51.9, comp: 54.2 },
      { area: "인사제도", rate: 58.0, comp: 55.0 },
    ],
    strengthen: [],
    improve: [
      { keyword: "복리후생", rate: "11.6%", rank: 1 },
      { keyword: "교육", rate: "23.3%", rank: 2 },
      { keyword: "리더솔선수범", rate: "16.3%", rank: 3 },
      { keyword: "인재", rate: "11.6%", rank: 4 },
      { keyword: "다양한기회", rate: "20.9%", rank: 9 },
    ],
    directions: [
      { area: "경영철학", dir: "유지", detail: "인재 확보 유지 노력" },
      { area: "리더", dir: "개선", detail: "솔선수범 노력 필요" },
      { area: "인사제도", dir: "개선", detail: "보상수준 개선, 성장기회 부여 확대" },
    ],
    execSummary: "전년 대비 개선 추세이나 보상수준, 리더 솔선수범, 인재 확보 측면의 지속 개선이 필요합니다.",
    orgBaseRates: { company_practice: 77.9, leader_talent: 65.7, talent_first: 89.3, vision_share: 72.9, eval_reward: 49.3, vision_practice: 80.7, welfare: 58.6, vision_empathy: 87.9, talent: 60.0, communication: 70.0 },
    orgShapFactors: [
      { key: "온리원", label: "온리원", area: "경영철학", baseRate: 69.3, shap: 0.4407 },
      { key: "복리후생", label: "복리후생", area: "인사제도", baseRate: 58.6, shap: 0.1294 },
      { key: "ONLYONE재건", label: "ONLYONE재건", area: "경영철학", baseRate: 87.9, shap: 0.1048 },
      { key: "리더인재확보육성", label: "리더인재확보육성", area: "리더", baseRate: 65.7, shap: 0.0847 },
      { key: "인재제일", label: "인재제일", area: "경영철학", baseRate: 89.3, shap: 0.0457 },
      { key: "교육", label: "교육", area: "인사제도", baseRate: 60.0, shap: 0.0448 },
      { key: "리더동기부여", label: "리더동기부여", area: "리더", baseRate: 67.9, shap: 0.0418 },
      { key: "프로세스효율성", label: "프로세스효율성", area: "조직/프로세스", baseRate: 59.3, shap: 0.0384 },
      { key: "다양한기회", label: "다양한기회", area: "일하는 방식", baseRate: 64.3, shap: 0.0347 },
      { key: "VALUEUP", label: "VALUEUP", area: "경영철학", baseRate: 92.1, shap: 0.0306 },
    ],
    teams: [
      { name: "클라우드인프라담당", n: 84, types: { high: 21.4, caution: 31.0, general: 46.4, quiet: 1.2 }, engagement: 60.3 },
      { name: "방송/미디어사업단", n: 22, types: { high: 40.9, caution: 22.7, general: 31.8, quiet: 4.5 }, engagement: 67.2 },
      { name: "DX솔루션사업단", n: 16, types: { high: 12.5, caution: 31.2, general: 56.2, quiet: 0 }, engagement: 58.5 },
      { name: "공공/금융사업단", n: 13, types: { high: 15.4, caution: 30.8, general: 53.8, quiet: 0 }, engagement: 59.4 },
      { name: "DX 2본부(직속)", n: 5, types: { high: 20.0, caution: 40.0, general: 40.0, quiet: 0 }, engagement: 56.8 },
    ],
  },
  {
    name: "서비스혁신담당", n: 168,
    types: { high: 21.4, caution: 27.4, general: 50.0, quiet: 1.2 },
    typeN: { high: 36, caution: 46, general: 84, quiet: 2 },
    engagement: 62.5,
    scores: { 추천의사: 66.7, 자부심: 68.5, 재직의사: 57.1, 만족감: 56.0, 성장감: 64.3 },
    areas: [
      { area: "경영철학 이해/실천", rate: 82.1, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 78.7, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 71.4, comp: 67.6 },
      { area: "일하는 방식", rate: 73.9, comp: 69.2 },
      { area: "조직/프로세스", rate: 59.7, comp: 54.2 },
      { area: "인사제도", rate: 56.7, comp: 55.0 },
    ],
    strengthen: [{ keyword: "ONLY ONE", rate: "78.3%", rank: 3 }],
    improve: [
      { keyword: "교육", rate: "30.4%", rank: 1 },
      { keyword: "평가보상", rate: "10.9%", rank: 2 },
      { keyword: "다양한기회", rate: "32.6%", rank: 6 },
      { keyword: "복리후생", rate: "19.6%", rank: 7 },
      { keyword: "리더동기부여", rate: "28.3%", rank: 9 },
    ],
    directions: [
      { area: "경영철학", dir: "유지", detail: "Only One 재건 공감 유지" },
      { area: "인사제도", dir: "개선", detail: "평가보상 공정성, 복리후생, 육성기회 개선" },
      { area: "리더", dir: "개선", detail: "구성원 신뢰 인정 개선" },
    ],
    execSummary: "몰입 유형이 고루 분포되어 있고 주의 필요 영역은 전년 대비 개선. 평가보상 공정성 제고와 복리후생 경쟁력 확보가 핵심 과제입니다.",
    orgBaseRates: { company_practice: 82.7, leader_talent: 72.0, talent_first: 92.9, vision_share: 76.2, eval_reward: 47.6, vision_practice: 78.6, welfare: 52.4, vision_empathy: 93.5, talent: 64.3, communication: 74.4 },
    orgShapFactors: [
      { key: "회사목표달성의지", label: "회사목표달성의지", area: "경영철학", baseRate: 82.1, shap: 0.381 },
      { key: "평가보상", label: "평가보상", area: "인사제도", baseRate: 47.6, shap: 0.2468 },
      { key: "복리후생", label: "복리후생", area: "인사제도", baseRate: 52.4, shap: 0.0821 },
      { key: "비전_전략실천", label: "비전/전략실천", area: "경영철학", baseRate: 78.6, shap: 0.0675 },
      { key: "열정", label: "열정", area: "경영철학", baseRate: 82.1, shap: 0.0598 },
      { key: "교육", label: "교육", area: "인사제도", baseRate: 62.5, shap: 0.0493 },
      { key: "회사실천준비", label: "회사실천준비", area: "경영철학", baseRate: 82.7, shap: 0.0436 },
      { key: "리더솔선수범", label: "리더솔선수범", area: "리더", baseRate: 72.0, shap: 0.0216 },
      { key: "의사결정", label: "의사결정", area: "일하는 방식", baseRate: 72.6, shap: 0.0184 },
      { key: "정직", label: "정직", area: "경영철학", baseRate: 84.5, shap: 0.0173 },
    ],
  },
  {
    name: "기술전략담당", n: 36,
    types: { high: 22.2, caution: 25.0, general: 52.8, quiet: 0 },
    typeN: { high: 8, caution: 9, general: 19, quiet: 0 },
    engagement: 63.9,
    scores: { 추천의사: 58.3, 자부심: 63.9, 재직의사: 61.1, 만족감: 63.9, 성장감: 72.2 },
    areas: [
      { area: "경영철학 이해/실천", rate: 82.9, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 78.3, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 69.4, comp: 67.6 },
      { area: "일하는 방식", rate: 67.7, comp: 69.2 },
      { area: "조직/프로세스", rate: 50.0, comp: 54.2 },
      { area: "인사제도", rate: 66.0, comp: 55.0 },
    ],
    strengthen: [{ keyword: "ONLY ONE", rate: "77.8%", rank: 5 }],
    improve: [
      { keyword: "상생", rate: "22.2%", rank: 1 },
      { keyword: "복리후생", rate: "0.0%", rank: 3 },
      { keyword: "의사소통", rate: "0.0%", rank: 4 },
      { keyword: "평가보상", rate: "0.0%", rank: 6 },
      { keyword: "의사결정", rate: "0.0%", rank: 9 },
    ],
    directions: [
      { area: "경영철학", dir: "유지", detail: "사회적 책임 영역 개선" },
      { area: "인사제도", dir: "개선", detail: "복리후생, 평가보상 공정성 개선" },
      { area: "일하는 방식", dir: "개선", detail: "의사소통, 의사결정 방식 개선" },
    ],
    execSummary: "사회적 책임과 복리후생, 의사소통/의사결정 방식 개선이 주요 과제입니다.",
    orgBaseRates: { company_practice: 72.2, leader_talent: 63.9, talent_first: 94.4, vision_share: 80.6, eval_reward: 58.3, vision_practice: 77.8, welfare: 61.1, vision_empathy: 88.9, talent: 72.2, communication: 61.1 },
  },
  {
    name: "경영기획담당", n: 12,
    types: { high: 41.7, caution: 16.7, general: 41.7, quiet: 0 },
    typeN: { high: 5, caution: 2, general: 5, quiet: 0 },
    engagement: 78.3,
    scores: { 추천의사: 83.3, 자부심: 83.3, 재직의사: 75.0, 만족감: 66.7, 성장감: 83.3 },
    areas: [
      { area: "경영철학 이해/실천", rate: 86.1, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 85.0, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 98.3, comp: 67.6 },
      { area: "일하는 방식", rate: 96.9, comp: 69.2 },
      { area: "조직/프로세스", rate: 66.7, comp: 54.2 },
      { area: "인사제도", rate: 75.0, comp: 55.0 },
    ],
    strengthen: [{ keyword: "의사소통", rate: "75.0%", rank: 8 }],
    improve: [
      { keyword: "리더비전공유", rate: "0.0%", rank: 1 },
      { keyword: "리더솔선수범", rate: "0.0%", rank: 3 },
      { keyword: "다양한기회", rate: "0.0%", rank: 4 },
      { keyword: "리더책임감헌신", rate: "0.0%", rank: 6 },
      { keyword: "존중", rate: "0.0%", rank: 9 },
    ],
    directions: [
      { area: "리더", dir: "집중개선", detail: "비전공유, 솔선수범, 헌신 개선 시급" },
      { area: "경영철학", dir: "유지", detail: "다양성 존중 개선" },
      { area: "인사제도", dir: "유지", detail: "다양한 기회 제공" },
    ],
    execSummary: "고몰입 유형 41.7%로 전사 최고 수준. 소수 주의 필요 유형에 대해 리더의 비전공유, 솔선수범, 헌신 관련 개선이 필요합니다.",
    orgBaseRates: { company_practice: 100.0, leader_talent: 100.0, talent_first: 91.7, vision_share: 66.7, eval_reward: 66.7, vision_practice: 83.3, welfare: 66.7, vision_empathy: 91.7, talent: 66.7, communication: 100.0 },
    teams: [
      { name: "안전관리팀", n: 7, types: { high: 28.6, caution: 14.3, general: 57.1, quiet: 0 }, engagement: 69.1 },
      { name: "경영진단팀", n: 4, types: { high: 50.0, caution: 25.0, general: 25.0, quiet: 0 }, engagement: 70.0 },
      { name: "대표이사(직속)", n: 1, types: { high: 100.0, caution: 0, general: 0, quiet: 0 }, engagement: 92.0 },
    ],
  },
  {
    name: "전략기획담당", n: 6,
    types: { high: 16.7, caution: 16.7, general: 66.7, quiet: 0 },
    typeN: { high: 1, caution: 1, general: 4, quiet: 0 },
    engagement: 70.0,
    scores: { 추천의사: 50.0, 자부심: 100.0, 재직의사: 83.3, 만족감: 33.3, 성장감: 83.3 },
    areas: [
      { area: "경영철학 이해/실천", rate: 68.1, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 83.3, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 56.7, comp: 67.6 },
      { area: "일하는 방식", rate: 45.8, comp: 69.2 },
      { area: "조직/프로세스", rate: 61.1, comp: 54.2 },
      { area: "인사제도", rate: 70.8, comp: 55.0 },
    ],
    strengthen: [], improve: [], directions: [],
    execSummary: "대상자 6명으로 통계적 해석에 한계가 있어 전사 과제를 차용합니다.",
    orgBaseRates: { company_practice: 83.3, leader_talent: 50.0, talent_first: 100.0, vision_share: 83.3, eval_reward: 50.0, vision_practice: 83.3, welfare: 83.3, vision_empathy: 100.0, talent: 33.3, communication: 50.0 },
  },
  {
    name: "컨설팅담당", n: 7,
    types: { high: 0, caution: 14.3, general: 85.7, quiet: 0 },
    typeN: { high: 0, caution: 1, general: 6, quiet: 0 },
    engagement: 65.7,
    scores: { 추천의사: 85.7, 자부심: 71.4, 재직의사: 57.1, 만족감: 42.9, 성장감: 71.4 },
    areas: [
      { area: "경영철학 이해/실천", rate: 85.7, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 85.7, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 82.9, comp: 67.6 },
      { area: "일하는 방식", rate: 83.9, comp: 69.2 },
      { area: "조직/프로세스", rate: 61.9, comp: 54.2 },
      { area: "인사제도", rate: 60.7, comp: 55.0 },
    ],
    strengthen: [], improve: [], directions: [],
    execSummary: "대상자 7명으로 통계적 해석에 한계가 있어 전사 과제를 차용합니다.",
    orgBaseRates: { company_practice: 71.4, leader_talent: 85.7, talent_first: 85.7, vision_share: 85.7, eval_reward: 57.1, vision_practice: 100.0, welfare: 42.9, vision_empathy: 100.0, talent: 57.1, communication: 85.7 },
  },
  {
    name: "경영지원담당", n: 34,
    types: { high: 29.4, caution: 11.8, general: 58.8, quiet: 0 },
    typeN: { high: 10, caution: 4, general: 20, quiet: 0 },
    engagement: 75.3,
    scores: { 추천의사: 76.5, 자부심: 76.5, 재직의사: 58.8, 만족감: 76.5, 성장감: 88.2 },
    areas: [
      { area: "경영철학 이해/실천", rate: 86.0, comp: 79.2 },
      { area: "중기전략 이해/실천", rate: 87.6, comp: 74.9 },
      { area: "리더 변화의지/실천", rate: 77.1, comp: 67.6 },
      { area: "일하는 방식", rate: 81.3, comp: 69.2 },
      { area: "조직/프로세스", rate: 69.6, comp: 54.2 },
      { area: "인사제도", rate: 66.9, comp: 55.0 },
    ],
    strengthen: [{ keyword: "의사소통", rate: "75.0%", rank: 8 }],
    improve: [
      { keyword: "리더비전공유", rate: "0.0%", rank: 1 },
      { keyword: "리더솔선수범", rate: "0.0%", rank: 3 },
      { keyword: "다양한기회", rate: "0.0%", rank: 4 },
      { keyword: "리더책임감헌신", rate: "0.0%", rank: 6 },
      { keyword: "존중", rate: "0.0%", rank: 9 },
    ],
    directions: [
      { area: "리더", dir: "개선", detail: "비전공유, 솔선수범 노력 필요" },
      { area: "경영철학", dir: "유지", detail: "다양성 존중 개선" },
      { area: "인사제도", dir: "유지", detail: "다양한 기회 제공" },
    ],
    execSummary: "고몰입 유형 29.4%, 주의 필요 11.8%로 전사 최저 수준. 리더의 비전공유/솔선수범 관련 소수 개선만 필요한 우수 조직입니다.",
    orgBaseRates: { company_practice: 82.4, leader_talent: 67.6, talent_first: 94.1, vision_share: 91.2, eval_reward: 70.6, vision_practice: 85.3, welfare: 61.8, vision_empathy: 97.1, talent: 73.5, communication: 82.4 },
  },
];

// ---------------------------------------------------------------------------
// SHAP 시뮬레이터 기본값
// ---------------------------------------------------------------------------
export const simBasePcts = { high: 19.4, general: 45.0, caution: 34.6, quiet: 1.0 };
export const simTypeEngScores = { high: 92, general: 68, caution: 28, quiet: 35 };

// ---------------------------------------------------------------------------
// 유형 색상/라벨
// ---------------------------------------------------------------------------
export const typeColors: Record<string, string> = {
  high: "#3b82f6",
  caution: "#ef4444",
  general: "#10b981",
  quiet: "#6b7280",
};

export const typeLabels: Record<string, string> = {
  high: "고몰입",
  caution: "주의 필요",
  general: "일반",
  quiet: "조용한 사직",
};
