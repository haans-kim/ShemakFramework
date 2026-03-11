// =============================================================================
// 가 Case: M&A 문화통합 리스크 진단 — 도*** (T**+T**)
// =============================================================================

export const surveyMeta = {
  client: "도***",
  subtitle: "T**+T**",
  totalRespondents: 1717,
  takRespondents: 976,
  tckRespondents: 741,
  analysisMethods: 11,
  period: "2026.03",
};

// ---------------------------------------------------------------------------
// KPI (Tab 0 CEO 요약 기준)
// ---------------------------------------------------------------------------
export const kpiData = {
  totalRespondents: {
    title: "총 응답자",
    value: "1,717",
    subtitle: "T** 976 | T** 741",
    status: "info" as const,
  },
  cultureDistance: {
    title: "문화적 거리 (To-be)",
    value: "0.66",
    subtitle: "As-is 0.43 → +51% 악화",
    status: "danger" as const,
  },
  attritionRisk: {
    title: "이탈 위험군 비중",
    value: "40.9%",
    subtitle: "변화갈망+잠재이탈 702명",
    status: "warning" as const,
  },
  earlySignal: {
    title: "이탈 전조 신호",
    value: "86명",
    subtitle: "5.0% | T** 61명(71%)",
    status: "danger" as const,
  },
};

// ---------------------------------------------------------------------------
// 핵심 발견 사항 Top 5
// ---------------------------------------------------------------------------
export interface KeyFinding {
  rank: number;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export const keyFindings: KeyFinding[] = [
  {
    rank: 1,
    title: "문화적 거리 통합 후 악화",
    description:
      "As-is 문화 거리 0.43에서 To-be 0.66으로 +51% 확대 예상. T**·T**가 서로 다른 미래 문화를 지향하는 구조적 불일치.",
    severity: "high",
  },
  {
    rank: 2,
    title: "T** 내 냉소 이탈형 집중",
    description:
      "냉소 이탈형(C3) 내 T** 비중 70.7%. 구미사업장, 원면사업본부 등 대규모 T** 조직이 통합 핵심 위험 지점.",
    severity: "high",
  },
  {
    rank: 3,
    title: "협업과 신뢰가 몰입의 핵심 동인",
    description:
      "GBM Feature Importance 분석 결과, 협업과신뢰(Q_1) 중요도 23.25%로 압도적 1위. 문화 통합 시 이 차원 우선 정렬 필요.",
    severity: "medium",
  },
  {
    rank: 4,
    title: "20년 성과 누적 임금 격차 5.87억",
    description:
      "S등급 15.97억 vs C등급 10.10억 (58.1% 차이). 성과 차등이 장기 인재 유지에 결정적 영향. 성과 연동 보상 구조 강화 필요.",
    severity: "medium",
  },
  {
    rank: 5,
    title: "이탈 전조 신호 86명 중 T** 71%",
    description:
      "Isolation Forest 이상치 탐지 5%(86명). T** 61명(71%) 집중. 즉각적 1:1 개입 프로그램 도입 권고.",
    severity: "low",
  },
];

// ---------------------------------------------------------------------------
// 4 Energy Clusters (확장)
// ---------------------------------------------------------------------------
export interface EnergyCluster {
  id: string;
  name: string;
  nameEn: string;
  count: number;
  percentage: number;
  productiveEnergy: number;
  cynicalEnergy: number;
  cultureGapValue: number;
  takPct: number;
  color: string;
  risk: "high" | "medium" | "low";
  description: string;
  recommendation: string;
}

export const energyClusters: EnergyCluster[] = [
  {
    id: "C0",
    name: "안정 적응형",
    nameEn: "Stable Adapters",
    count: 697,
    percentage: 40.6,
    productiveEnergy: 3.94,
    cynicalEnergy: 2.47,
    cultureGapValue: 0.333,
    takPct: 54,
    color: "#3b82f6",
    risk: "low",
    description:
      "평균 수준의 에너지와 문화 갭을 보유. 안정적이지만 주도성이 낮음. 적절한 자극과 성장 기회 제공 시 상위 그룹으로 이동 가능.",
    recommendation: "역량 개발 기회 확대, 팀 내 도전적 과업 부여",
  },
  {
    id: "C1",
    name: "변화 갈망형",
    nameEn: "Change Aspirants",
    count: 292,
    percentage: 17.0,
    productiveEnergy: 3.27,
    cynicalEnergy: 3.21,
    cultureGapValue: 1.316,
    takPct: 56,
    color: "#f59e0b",
    risk: "high",
    description:
      "As-is → To-be 갭(1.32)이 가장 큼. 현재에 불만족하나 더 나은 미래를 강하게 열망. 적극 개입 시 변화 주도 인력으로 전환 가능한 잠재 집단.",
    recommendation: "변화 주도 프로젝트 참여 기회 제공, 경력 개발 로드맵 명확화",
  },
  {
    id: "C2",
    name: "몰입형 충성자",
    nameEn: "Engaged Loyalists",
    count: 318,
    percentage: 18.5,
    productiveEnergy: 4.38,
    cynicalEnergy: 1.95,
    cultureGapValue: 0.179,
    takPct: 46,
    color: "#10b981",
    risk: "low",
    description:
      "생산적 에너지 최고(4.38), 냉소적·유해적 에너지 최저. 현 조직에 높은 만족도와 헌신. 핵심 유지 대상이며 문화 전파자 역할 최적.",
    recommendation: "핵심 인재 유지 프로그램, 멘토 및 문화 앰배서더 역할 부여",
  },
  {
    id: "C3",
    name: "냉소 이탈형",
    nameEn: "Silent Withdrawers",
    count: 410,
    percentage: 23.9,
    productiveEnergy: 3.30,
    cynicalEnergy: 2.89,
    cultureGapValue: 0.089,
    takPct: 71,
    color: "#ef4444",
    risk: "high",
    description:
      "냉소적·유해적 에너지 높고, 더 나은 미래에 대한 열망마저 사라진 상태(갭 0.09). T** 비중 70.7%로 PMI 핵심 위험군. 즉각 개입 필요.",
    recommendation: "1:1 면담, 업무 재설계, 직속 리더십 점검 우선 실시",
  },
];

// ---------------------------------------------------------------------------
// T** vs T** 클러스터 분포 비교
// ---------------------------------------------------------------------------
export const takTckClusterComparison = {
  "T**": { C0: 38.2, C1: 16.9, C2: 15.2, C3: 29.7 },
  "TCK": { C0: 43.7, C1: 17.1, C2: 22.9, C3: 16.2 },
};

// ---------------------------------------------------------------------------
// 직종별 클러스터 특성
// ---------------------------------------------------------------------------
export const jobTypeClusterData = [
  {
    type: "사무직",
    count: 698,
    productiveEnergy: 3.72,
    cultureGap: 0.466,
    clusters: [
      { id: "C0", name: "안정 적응형", count: 315, pct: 45.1 },
      { id: "C3", name: "냉소 이탈형", count: 155, pct: 22.2 },
      { id: "C1", name: "변화 갈망형", count: 131, pct: 18.8 },
      { id: "C2", name: "몰입형 충성자", count: 97, pct: 13.9 },
    ],
  },
  {
    type: "기능직",
    count: 1019,
    productiveEnergy: 3.78,
    cultureGap: 0.378,
    clusters: [
      { id: "C0", name: "안정 적응형", count: 382, pct: 37.5 },
      { id: "C3", name: "냉소 이탈형", count: 255, pct: 25.0 },
      { id: "C2", name: "몰입형 충성자", count: 221, pct: 21.7 },
      { id: "C1", name: "변화 갈망형", count: 161, pct: 15.8 },
    ],
  },
];

// ---------------------------------------------------------------------------
// QQ Risk by Organization (전체 30개 조직)
// ---------------------------------------------------------------------------
export interface OrgRisk {
  organization: string;
  count: number;
  qqRisk: number;
  productiveEnergy: number;
  risk: "high" | "medium" | "low";
}

export const orgRiskData: OrgRisk[] = [
  { organization: "FILM사업본부", count: 47, qqRisk: 9.5, productiveEnergy: 3.65, risk: "high" },
  { organization: "아라윈사업단", count: 39, qqRisk: 8.9, productiveEnergy: 3.85, risk: "high" },
  { organization: "경영지원본부", count: 43, qqRisk: 8.8, productiveEnergy: 3.77, risk: "high" },
  { organization: "경영지원본부(T**)", count: 44, qqRisk: 8.1, productiveEnergy: 3.74, risk: "high" },
  { organization: "필터사업본부", count: 110, qqRisk: 7.6, productiveEnergy: 3.85, risk: "high" },
  { organization: "복합재료사업본부", count: 63, qqRisk: 7.5, productiveEnergy: 3.73, risk: "high" },
  { organization: "IT소재사업부", count: 105, qqRisk: 6.9, productiveEnergy: 3.83, risk: "high" },
  { organization: "구미사업장", count: 177, qqRisk: 6.9, productiveEnergy: 3.84, risk: "high" },
  { organization: "TPJ", count: 7, qqRisk: 6.9, productiveEnergy: 3.67, risk: "high" },
  { organization: "구미사업장(T**)", count: 207, qqRisk: 6.6, productiveEnergy: 3.59, risk: "high" },
  { organization: "원면사업본부", count: 125, qqRisk: 6.3, productiveEnergy: 3.95, risk: "medium" },
  { organization: "FILM사업부", count: 194, qqRisk: 6.0, productiveEnergy: 3.86, risk: "medium" },
  { organization: "Engineering본부", count: 24, qqRisk: 5.9, productiveEnergy: 3.67, risk: "medium" },
  { organization: "관계사출향", count: 8, qqRisk: 5.8, productiveEnergy: 3.83, risk: "medium" },
  { organization: "원사사업본부", count: 96, qqRisk: 5.6, productiveEnergy: 3.93, risk: "medium" },
  { organization: "기술연구소(T**)", count: 36, qqRisk: 5.5, productiveEnergy: 3.76, risk: "medium" },
  { organization: "인사지원본부(T**)", count: 31, qqRisk: 5.3, productiveEnergy: 3.58, risk: "medium" },
  { organization: "수지Chemical사업부", count: 10, qqRisk: 5.3, productiveEnergy: 4.10, risk: "medium" },
  { organization: "인사지원본부", count: 18, qqRisk: 5.3, productiveEnergy: 3.74, risk: "medium" },
  { organization: "필름사업본부", count: 51, qqRisk: 4.9, productiveEnergy: 3.73, risk: "medium" },
  { organization: "수지Chemical사업본부", count: 63, qqRisk: 4.8, productiveEnergy: 3.41, risk: "low" },
  { organization: "SB사업부", count: 76, qqRisk: 4.6, productiveEnergy: 3.55, risk: "low" },
  { organization: "기술연구소", count: 24, qqRisk: 4.5, productiveEnergy: 3.58, risk: "low" },
  { organization: "PT. T** Textiles", count: 6, qqRisk: 3.7, productiveEnergy: 3.78, risk: "low" },
  { organization: "엔지니어링본부", count: 11, qqRisk: 2.9, productiveEnergy: 4.00, risk: "low" },
  { organization: "기술연구고문", count: 5, qqRisk: 2.7, productiveEnergy: 3.67, risk: "low" },
  { organization: "경영기획관리실(T**)", count: 13, qqRisk: 2.5, productiveEnergy: 3.51, risk: "low" },
  { organization: "TID", count: 5, qqRisk: 2.0, productiveEnergy: 3.93, risk: "low" },
  { organization: "SB사업본부", count: 7, qqRisk: 1.7, productiveEnergy: 2.95, risk: "low" },
  { organization: "경영기획관리실", count: 9, qqRisk: 0.0, productiveEnergy: 3.74, risk: "low" },
];

// ---------------------------------------------------------------------------
// 8 Culture Dimensions Radar
// ---------------------------------------------------------------------------
export const cultureDimensions = [
  "협업과신뢰",
  "공감과포용",
  "혁신과학습",
  "활력과몰입",
  "성과와실행",
  "결단과리더십",
  "안정과계획",
  "체계와민첩성",
] as const;

export type CultureDimension = (typeof cultureDimensions)[number];

export interface CultureRadarPoint {
  dimension: CultureDimension;
  takAsIs: number;
  takToBe: number;
  tckAsIs: number;
  tckToBe: number;
}

export const cultureRadarData: CultureRadarPoint[] = cultureDimensions.map(
  (dimension, i) => ({
    dimension,
    takAsIs: [3.245, 3.009, 2.955, 2.590, 3.406, 2.792, 3.636, 3.142][i],
    takToBe: [3.606, 3.336, 3.589, 3.573, 3.467, 3.418, 3.349, 3.469][i],
    tckAsIs: [3.426, 3.165, 3.136, 2.810, 3.518, 2.935, 3.711, 3.250][i],
    tckToBe: [3.915, 3.601, 3.815, 3.833, 3.680, 3.609, 3.543, 3.630][i],
  })
);

// 차원별 문화 갭 분석
export const cultureGapSummary = {
  maxGapDimension: "활력과몰입",
  maxGapValue: 1.0,
  maxGapDetail: "T** 0.983 / T** 1.023",
  reverseGapDimension: "안정과계획",
  reverseGapValue: -0.236,
  reverseGapDetail: "현재 과잉 → 축소 열망",
  distanceAsIs: 0.43,
  distanceToBe: 0.66,
  distanceChange: "+51%",
};

// 문화 차원 설명
export const cultureDimensionDescriptions: Record<string, string> = {
  협업과신뢰: "협동과 상호 신뢰를 중시한다",
  공감과포용: "온정과 아량을 중시한다",
  혁신과학습: "탐구와 창의성을 중시한다",
  활력과몰입: "재미와 활기를 중시한다",
  성과와실행: "성취와 승리를 중시한다",
  결단과리더십: "강인함과 대담성을 중시한다",
  안정과계획: "계획과 조심성을 중시한다",
  체계와민첩성: "체계와 민첩성을 중시한다",
};

// ---------------------------------------------------------------------------
// 에너지 프로파일 T** vs T**
// ---------------------------------------------------------------------------
export const energyProfile = {
  "T**": { productive: 3.685, comfortable: 2.986, resigned: 2.648, corrosive: 2.491 },
  "TCK": { productive: 3.842, comfortable: 3.156, resigned: 2.539, corrosive: 2.352 },
};

export const integrationRiskIndex = {
  "T**": 52.2,
  "TCK": 44.4,
};

// ---------------------------------------------------------------------------
// 보상 & 인사제도: 생애 임금 시뮬레이션
// ---------------------------------------------------------------------------
export const lifeWageData = {
  grades: [
    { grade: "S", label: "S등급 (최우수)", cumulative20yr: "15.97억", color: "#eab308" },
    { grade: "A", label: "A등급", cumulative20yr: "13.41억", color: "#3b82f6" },
    { grade: "B", label: "B등급", cumulative20yr: "11.99억", color: "#22c55e" },
    { grade: "C", label: "C등급 (하위)", cumulative20yr: "10.10억", color: "#6b7280" },
  ],
  gapSminusC: "5.87억원",
  gapPct: "58.1%",
  raiseRates: [
    { grade: "S", rate: 6.0 },
    { grade: "A", rate: 3.0 },
    { grade: "B", rate: 2.5 },
    { grade: "C", rate: 1.25 },
  ],
};

// 보상 전략 권고
export const compensationStrategy = [
  { phase: "단기 (0~1년)", label: "형평성 기준선 확보", description: "T**·T** 사무직 기본급 밴드 통합 및 상호 참조 가능한 Pay Band 설계" },
  { phase: "중기 (1~2년)", label: "성과 연동 강화", description: "성과등급 기준 일원화, S/C 격차 유지하되 절대 금액 조정" },
  { phase: "장기 (2년+)", label: "전문직 트랙 신설", description: "승진 경로 다원화 (관리직/전문직 이원화), Fast-track 도입으로 우수인재 조기 보상" },
];

// ---------------------------------------------------------------------------
// 기능직 임금 분석
// ---------------------------------------------------------------------------
export const wageAnalysis = {
  summary: {
    takAvg: 3198397,
    tckAvg: 2864225,
    gapPct: "+11.7%",
    gapAmount: "+334,172원",
    annualGap: "+316만원",
    annualTak: "5,668만",
    annualTck: "5,351만",
  },
  byGrade: [
    { grade: "J1", takAvg: "2,130,104", tckAvg: "2,010,295", gap: "+6.0%", takCount: "168명", tckCount: "110명" },
    { grade: "J2", takAvg: "2,451,027", tckAvg: "2,211,696", gap: "+10.8%", takCount: "280명", tckCount: "166명" },
    { grade: "J3", takAvg: "2,699,363", tckAvg: "2,445,659", gap: "+10.4%", takCount: "124명", tckCount: "34명" },
    { grade: "J4", takAvg: "3,525,593", tckAvg: "2,999,157", gap: "+17.6%", takCount: "854명 (52%)", tckCount: "742명 (65%)", highlight: true },
    { grade: "J5", takAvg: "4,126,832", tckAvg: "3,375,258", gap: "+22.3%", takCount: "194명 (12%)", tckCount: "82명 (7%)" },
  ],
};

// ---------------------------------------------------------------------------
// 통합 인사이트: Proxy Metrics
// ---------------------------------------------------------------------------
export const proxyMetrics = {
  qqRisk: { "T**": 6.2, "TCK": 6.5 },
  changeReady: { "T**": 16.6, "TCK": 20.3, note: "T**가 변화 수용도 더 높음" },
  integrationRisk: { "T**": 52.2, "TCK": 44.4, note: "T** 통합 위험이 17.6% 더 높음" },
};

// ---------------------------------------------------------------------------
// 이탈 전조 신호 (Isolation Forest)
// ---------------------------------------------------------------------------
export const anomalyData = {
  total: 86,
  rate: 5.0,
  takCount: 61,
  takPct: 70.9,
  tckCount: 25,
  tckPct: 29.1,
  anomalyProductiveEnergy: 3.69,
  overallProductiveEnergy: 3.75,
  interpretation:
    "이상치는 전반적 에너지 평균과 유사하나 특정 문항에서 극단적 응답(매우 낮거나 높음). 심리적 이탈이 심화된 상태에서도 표면적으로는 정상처럼 보이는 패턴. 1:1 심층 면담을 통한 조기 발굴이 중요.",
};

// ---------------------------------------------------------------------------
// SHAP Feature Importance (GBM) - Top 10 상세
// ---------------------------------------------------------------------------
export interface ShapFeature {
  rank: number;
  feature: string;
  dimension: string;
  importance: number;
}

export const shapData: ShapFeature[] = [
  { rank: 1, feature: "Q_1", dimension: "협업과신뢰 (Value As-is)", importance: 0.2325 },
  { rank: 2, feature: "Q_3", dimension: "혁신과학습 (Value As-is)", importance: 0.1178 },
  { rank: 3, feature: "Q_11", dimension: "혁신과학습 (Char As-is)", importance: 0.0607 },
  { rank: 4, feature: "Q_17", dimension: "협업과신뢰 (Value To-be)", importance: 0.0502 },
  { rank: 5, feature: "Q_15", dimension: "안정과계획 (Char As-is)", importance: 0.0477 },
  { rank: 6, feature: "Q_28", dimension: "활력과몰입 (Char To-be)", importance: 0.0459 },
  { rank: 7, feature: "Q_5", dimension: "성과와실행 (Value As-is)", importance: 0.0393 },
  { rank: 8, feature: "Q_25", dimension: "협업과신뢰 (Char To-be)", importance: 0.0292 },
  { rank: 9, feature: "Q_13", dimension: "성과와실행 (Char As-is)", importance: 0.0280 },
  { rank: 10, feature: "Q_14", dimension: "결단과리더십 (Char As-is)", importance: 0.0273 },
];

// ---------------------------------------------------------------------------
// 방법론: 분석 프로세스 6단계
// ---------------------------------------------------------------------------
export const methodologySteps = [
  { step: 1, title: "데이터 정제·익명화" },
  { step: 2, title: "탐색적 분석" },
  { step: 3, title: "클러스터링" },
  { step: 4, title: "시각화" },
  { step: 5, title: "조직 진단" },
  { step: 6, title: "전략 제안" },
];

// 11가지 분석 기법
export const analysisTechniques = [
  { id: 1, name: "t-SNE 차원 축소", desc: "44차원 설문 데이터 → 2차원 임베딩 (perplexity=30, max_iter=1000)" },
  { id: 2, name: "K-Means 클러스터링", desc: "k=4 최적 선정 (Silhouette Score 비교: k=3~6)" },
  { id: 3, name: "GBM Feature Importance", desc: "Gradient Boosting으로 몰입도 예측 → 문항별 중요도 산출" },
  { id: 4, name: "AutoML 분류기 비교", desc: "6개 모델 비교 (LR, SVM, GBM, RF, KNN, DT) | Best: LR 97.2%" },
  { id: 5, name: "Isolation Forest 이상치", desc: "5% 이상치(86명) 탐지 → 이탈 전조 신호 식별" },
  { id: 6, name: "Proxy 지표 산출", desc: "QQ Risk, 변화 준비도, 통합 위험 지수 복합 산출" },
  { id: 7, name: "문화 거리 분석", desc: "유클리드 거리 기반 T**·T** 문화 벡터 거리 측정" },
  { id: 8, name: "에너지 프로파일 분석", desc: "Productive / Comfortable / Resigned / Corrosive 4축 비교" },
  { id: 9, name: "문화 갭 분석", desc: "8차원 Value·Character × As-is·To-be 갭 산출" },
  { id: 10, name: "생애임금 시뮬레이션", desc: "초임 기준 성과 인상률 복리 적용 20년 누적 임금 모델" },
  { id: 11, name: "조직별 진단", desc: "30개 조직 에너지 프로파일 + QQ Risk 종합 위험도 평가" },
];

// AutoML 분류기 성능
export const autoMLData = [
  { model: "Logistic Regression", accuracy: 97.2, best: true },
  { model: "SVM", accuracy: 95.7 },
  { model: "Gradient Boosting", accuracy: 90.7 },
  { model: "Random Forest", accuracy: 89.8 },
  { model: "KNN", accuracy: 87.1 },
  { model: "Decision Tree", accuracy: 73.0 },
];

// 데이터 소스
export const dataSources = [
  { name: "조직문화 설문 결과", desc: "1,717명 × 47문항 (T** 976 + T** 741)" },
  { name: "사무직 급여 밴드", desc: "G3~G6 직급별 기본급 밴드 테이블" },
  { name: "기능직 급여 밴드", desc: "J1~J5 직급별 기본급 밴드 테이블" },
  { name: "인력 구조 추이", desc: "2018~2027년 직종·직급별 인원 추이" },
  { name: "생애임금 시뮬레이션", desc: "성과등급별 20년 누적 임금 모델" },
  { name: "조직 구조 데이터", desc: "30개 조직 응답자 배속 정보" },
];

// ---------------------------------------------------------------------------
// Recommendations (Quick Win / Long-term)
// ---------------------------------------------------------------------------
export const quickWinRecommendations = [
  "이탈 전조 86명 대상 1:1 면담 프로그램 즉시 시행",
  "협업과 신뢰 강화 워크숍 (T**·T** 혼합 팀 구성)",
  "몰입형 충성자(C2) 문화 앰배서더 발굴 및 역할 부여",
  "고위험 5개 조직 리더십 진단 및 개입 계획 수립",
];

export const longTermRecommendations = [
  "T**·T** 공통 문화 비전 수립 워크숍 (To-be 정렬)",
  "성과 연동 보상 구조 강화 (S/C 격차 5.87억 근거 설계)",
  "직급·호칭 통합안 수립 및 승진 기준 재설계",
  "변화 갈망형(C1) 대상 Fast-track 및 변화 주도 프로그램 운영",
];
