// 라 PoC - 인력수준 위험 진단 및 조직몰입도 개선 예측
// 인력수준 위험 진단 및 조직몰입도 개선 예측 데이터

export type RiskTier = "high" | "caution" | "good";

export interface KpiItem {
  title: string;
  value: string;
  subtitle: string;
  status: "danger" | "warning" | "success" | "info";
}

export interface OrgRisk {
  name: string;
  riskScore: number;
  tier: RiskTier;
}

export interface EngagementByTier {
  tier: string;
  tierKey: RiskTier;
  values: number[];
}

export interface HeatmapOrg {
  name: string;
  values: number[];
}

export interface ShapFeature {
  feature: string;
  value: number;
}

export interface SimulationScenario {
  id: string;
  label: string;
  description: string;
  predicted: number;
  delta: string;
}

export interface Recommendation {
  priority: string;
  priorityVariant: "danger" | "warning" | "success" | "info";
  text: string;
}

export interface OrgInsight {
  name: string;
  tier: RiskTier;
  n: number;
  riskScore: number;
  commitment: number;
  weaknesses: string[];
  strengths: string[];
  s3: number;
  insight: string;
}

// KPI Data
export const kpiData: KpiItem[] = [
  {
    title: "전사 몰입도 평균",
    value: "3.76",
    subtitle: "5점 만점",
    status: "info",
  },
  {
    title: "조직 위험 분류",
    value: "고위험 3 / 저위험 6 / 양호 6",
    subtitle: "15개 조직",
    status: "warning",
  },
  {
    title: "SHAP Top 피처",
    value: "WLB, 인재유지",
    subtitle: "몰입도 핵심 동인",
    status: "success",
  },
  {
    title: "S3 전사 개선 예측",
    value: "+3.4%",
    subtitle: "WLB + 인재유지 동시개선",
    status: "success",
  },
];

// Organization Risk Data (15 orgs sorted by risk score ascending)
export const orgRiskData: OrgRisk[] = [
  { name: "Premium 세일즈그룹", riskScore: 1.68, tier: "good" },
  { name: "VIP세일즈그룹", riskScore: 1.73, tier: "good" },
  { name: "식음그룹", riskScore: 1.78, tier: "good" },
  { name: "사업관리그룹", riskScore: 1.78, tier: "caution" },
  { name: "HR그룹", riskScore: 1.83, tier: "good" },
  { name: "카지노오퍼레이션그룹", riskScore: 1.83, tier: "caution" },
  { name: "카지노사업본부(본부)", riskScore: 1.85, tier: "good" },
  { name: "객실그룹", riskScore: 1.90, tier: "caution" },
  { name: "경영지원그룹", riskScore: 1.91, tier: "good" },
  { name: "FunCity그룹", riskScore: 2.01, tier: "caution" },
  { name: "리조트사업본부(본부)", riskScore: 2.08, tier: "caution" },
  { name: "-(본부)", riskScore: 2.15, tier: "caution" },
  { name: "기술지원그룹", riskScore: 2.17, tier: "high" },
  { name: "IR마케팅그룹", riskScore: 2.41, tier: "high" },
  { name: "기획그룹", riskScore: 2.71, tier: "high" },
];

// Engagement Indicators
export const engagementIndicators = [
  "Pride",
  "만족도",
  "추천의지",
  "재직의사",
  "성장감",
];

// Engagement by Risk Tier
export const engagementByTier: EngagementByTier[] = [
  {
    tier: "고위험",
    tierKey: "high",
    values: [3.64, 3.65, 3.23, 3.31, 3.26],
  },
  {
    tier: "저위험",
    tierKey: "caution",
    values: [3.80, 3.80, 3.58, 3.80, 3.62],
  },
  {
    tier: "양호",
    tierKey: "good",
    values: [3.90, 3.90, 3.81, 3.97, 3.80],
  },
];

// Heatmap Indicators
export const heatmapIndicators = [
  "조직구조 적절성",
  "수평적 R&R",
  "수직적 R&R",
  "업무량",
  "인력규모",
  "자원제공",
  "WLB",
  "인재유지",
  "적시채용",
];

// Company Average for heatmap
export const companyAverage: number[] = [
  3.36, 3.40, 3.56, 3.09, 2.52, 3.47, 3.39, 3.08, 3.05,
];

// Heatmap Data (15 orgs x 9 indicators, sorted by risk score ascending)
export const heatmapData: HeatmapOrg[] = [
  {
    name: "기획그룹",
    values: [2.25, 2.58, 2.50, 2.08, 2.08, 3.25, 2.58, 2.25, 2.25],
  },
  {
    name: "IR마케팅그룹",
    values: [2.82, 2.77, 3.05, 2.50, 2.20, 3.07, 2.95, 2.50, 2.50],
  },
  {
    name: "기술지원그룹",
    values: [2.82, 2.97, 3.30, 2.55, 2.64, 3.09, 3.00, 2.76, 2.79],
  },
  {
    name: "-(본부)",
    values: [3.13, 3.15, 3.28, 2.97, 2.38, 3.62, 3.46, 2.67, 2.67],
  },
  {
    name: "리조트사업본부(본부)",
    values: [3.33, 3.28, 3.53, 3.06, 1.97, 3.33, 3.19, 3.08, 2.61],
  },
  {
    name: "FunCity그룹",
    values: [3.24, 3.36, 3.72, 2.76, 2.44, 3.56, 3.56, 3.08, 2.60],
  },
  {
    name: "객실그룹",
    values: [3.28, 3.27, 3.52, 3.06, 2.54, 3.42, 3.08, 3.09, 3.14],
  },
  {
    name: "카지노오퍼레이션그룹",
    values: [3.41, 3.51, 3.64, 3.18, 2.48, 3.47, 3.48, 3.07, 3.14],
  },
  {
    name: "사업관리그룹",
    values: [3.30, 3.10, 3.60, 3.10, 3.30, 3.50, 3.00, 3.10, 3.10],
  },
  {
    name: "경영지원그룹",
    values: [3.07, 3.20, 3.37, 2.90, 2.93, 3.57, 3.70, 3.00, 3.13],
  },
  {
    name: "카지노사업본부(본부)",
    values: [3.53, 3.30, 3.49, 3.10, 2.70, 3.49, 3.60, 3.18, 3.13],
  },
  {
    name: "HR그룹",
    values: [3.48, 3.38, 3.57, 2.95, 2.57, 3.71, 3.24, 3.29, 3.29],
  },
  {
    name: "식음그룹",
    values: [3.51, 3.52, 3.62, 3.25, 2.54, 3.46, 3.48, 3.34, 3.04],
  },
  {
    name: "VIP세일즈그룹",
    values: [3.60, 3.70, 3.67, 3.10, 2.76, 3.69, 3.11, 3.11, 3.27],
  },
  {
    name: "Premium 세일즈그룹",
    values: [3.55, 3.48, 3.79, 3.24, 2.86, 3.72, 3.76, 3.28, 3.28],
  },
];

// SHAP Feature Importance (Top 10)
export const shapData: ShapFeature[] = [
  { feature: "WLB", value: 0.1302 },
  { feature: "인재유지", value: 0.1146 },
  { feature: "복리후생", value: 0.0876 },
  { feature: "제도 만족도", value: 0.0668 },
  { feature: "자원제공", value: 0.0409 },
  { feature: "제도 만족도(보상)", value: 0.0347 },
  { feature: "성장 기회 제공", value: 0.0338 },
  { feature: "역할/직급 적합성", value: 0.0287 },
  { feature: "제도 만족도(교육)", value: 0.0267 },
  { feature: "평가 공정성", value: 0.0262 },
];

// Simulation Data
export const currentEngagement = 3.76;

export const simulationData: SimulationScenario[] = [
  {
    id: "S1",
    label: "WLB +0.5",
    description: "WLB 지표 0.5점 개선 시",
    predicted: 3.815,
    delta: "+1.5%",
  },
  {
    id: "S2",
    label: "인재유지 +0.5",
    description: "인재유지 지표 0.5점 개선 시",
    predicted: 3.846,
    delta: "+2.3%",
  },
  {
    id: "S3",
    label: "동시 +0.5",
    description: "WLB + 인재유지 동시 0.5점 개선 시",
    predicted: 3.906,
    delta: "+3.9%",
  },
  {
    id: "S4",
    label: "전사평균 도달",
    description: "하위 조직이 전사평균 수준 도달 시",
    predicted: 3.801,
    delta: "+1.1%",
  },
];

// Recommendations
export const recommendations: Recommendation[] = [
  {
    priority: "P1 최우선",
    priorityVariant: "danger",
    text: "본사 직속 조직 프로세스 및 R&R 전면 재정비",
  },
  {
    priority: "P2 단기",
    priorityVariant: "warning",
    text: "WLB 및 업무량 관리 체계 도입",
  },
  {
    priority: "P1 최우선",
    priorityVariant: "danger",
    text: "고위험 조직 6개월 집중 개입 프로그램",
  },
  {
    priority: "P4 중기",
    priorityVariant: "info",
    text: "복리후생 및 인재유지 제도 실효성 점검",
  },
  {
    priority: "P5 장기",
    priorityVariant: "success",
    text: "우수 조직 벤치마크 기반 조직문화 확산",
  },
];

// Organization Insight Cards
export const orgInsights: OrgInsight[] = [
  {
    name: "기획그룹",
    tier: "high",
    n: 12,
    riskScore: 2.708,
    commitment: 3.18,
    weaknesses: [
      "조직구조 적절성(-1.11)",
      "수직적R&R(-1.06)",
      "프로세스 효율성(-1.06)",
    ],
    strengths: [],
    s3: 4.04,
    insight:
      "전 조직 최하위 몰입도. 소규모 인원의 과부하 + 프로세스 비효율이 심각.",
  },
  {
    name: "IR마케팅그룹",
    tier: "high",
    n: 44,
    riskScore: 2.41,
    commitment: 3.4,
    weaknesses: ["업무량(-0.59)", "인력규모(-0.32)"],
    strengths: [],
    s3: 3.78,
    insight: "업무 과부하와 인력 부족이 핵심 문제.",
  },
  {
    name: "기술지원그룹",
    tier: "high",
    n: 33,
    riskScore: 2.17,
    commitment: 3.67,
    weaknesses: ["조직구조(-0.54)", "업무량(-0.54)"],
    strengths: ["수직적R&R(+0.26)"],
    s3: 3.51,
    insight: "업무 부담 대비 몰입도 유지하나, 구조적 비효율 존재.",
  },
  {
    name: "HR그룹",
    tier: "good",
    n: 10,
    riskScore: 1.83,
    commitment: 3.96,
    weaknesses: [],
    strengths: ["자원제공(+0.24)", "인재유지(+0.21)"],
    s3: 3.69,
    insight: "가장 높은 몰입도. 보상/승진 공정성 인식 높음.",
  },
  {
    name: "Premium 세일즈그룹",
    tier: "good",
    n: 29,
    riskScore: 1.68,
    commitment: 4.02,
    weaknesses: [],
    strengths: ["WLB(+0.37)", "수직적R&R(+0.23)"],
    s3: 3.2,
    insight: "전사 최고 몰입도. 조직 벤치마크 대상.",
  },
];

// Tier color mapping
export const tierColors: Record<RiskTier, string> = {
  high: "#ef4444",
  caution: "#f59e0b",
  good: "#10b981",
};

export const tierLabels: Record<RiskTier, string> = {
  high: "고위험",
  caution: "저위험",
  good: "양호",
};
