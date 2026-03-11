// =============================================================================
// 다 (da) PoC Case: 조직 리스크 조기탐지 대시보드 데이터
// =============================================================================

// -----------------------------------------------------------------------------
// KPI Data
// -----------------------------------------------------------------------------
export const kpiData = [
  {
    title: "리스크군 (C1)",
    value: "126명",
    subtitle: "전체 대비 18.8%",
    status: "danger" as const,
  },
  {
    title: "24년 조기경보",
    value: "9개",
    subtitle: "탐지 가능 영역",
    status: "warning" as const,
  },
  {
    title: "C1 지속악화",
    value: "20/22",
    subtitle: "중분류 악화 비율",
    status: "danger" as const,
  },
  {
    title: "C1 매니저L1 직급 집중도",
    value: "48%",
    subtitle: "리스크군 내 L1 비율",
    status: "warning" as const,
  },
];

// -----------------------------------------------------------------------------
// Cluster Data (671명 total)
// -----------------------------------------------------------------------------
export const totalEmployees = 671;

export const clusterData = [
  {
    id: "C0",
    name: "C0 안정군",
    count: 437,
    ratio: 65.1,
    color: "#10b981",
    trajectory: [3.19, 3.25, 3.24],
  },
  {
    id: "C1",
    name: "C1 리스크군",
    count: 126,
    ratio: 18.8,
    color: "#ef4444",
    trajectory: [3.76, 3.38, 3.06],
  },
  {
    id: "C2",
    name: "C2 개선군",
    count: 108,
    ratio: 16.1,
    color: "#3b82f6",
    trajectory: [2.83, 3.29, 3.68],
  },
];

export const trajectoryYears = ["2023", "2024", "2025"];

export const trajectoryChartData = trajectoryYears.map((year, i) => ({
  year,
  C0: clusterData[0].trajectory[i],
  C1: clusterData[1].trajectory[i],
  C2: clusterData[2].trajectory[i],
}));

// -----------------------------------------------------------------------------
// 22 Category Heatmap (change values 23 -> 25)
// -----------------------------------------------------------------------------
export const categories = [
  "경영비전",
  "전략목표",
  "편안(E)",
  "휴념(E)",
  "부식(E)",
  "생산(E)",
  "조직구조",
  "인력운영",
  "업무프로세스",
  "의사소통",
  "의사결정",
  "업무인프라",
  "직급승진",
  "평가제도",
  "보상제도",
  "채용",
  "교육",
  "몰입도",
  "윤리",
  "다양성",
  "고객지향",
  "고성과의식",
];

export const c1Values = [
  -0.7, -0.65, -0.55, -0.6, -0.75, -0.68, -0.81, -0.95, -0.78, -0.93, -0.72,
  -0.82, -0.79, -0.79, -0.92, -0.58, -0.52, -0.82, -1.04, 0.02, -0.45, -0.62,
];

export const c0Values = [
  0.1, 0.05, 0.08, 0.12, -0.05, 0.15, 0.03, -0.1, 0.02, -0.05, 0.08, -0.02,
  0.05, 0.03, -0.13, 0.25, 0.3, 0.02, 0.1, 0.68, 0.15, 0.08,
];

export const c2Values = [
  0.65, 0.7, 0.58, 0.55, 0.72, 0.68, 0.78, 0.85, 0.75, 0.82, 0.7, 0.8, 0.72,
  0.75, 0.82, 0.6, 0.55, 0.8, 0.9, 0.45, 0.62, 0.68,
];

export const heatmapData = categories.map((category, i) => ({
  category,
  C0: c0Values[i],
  C1: c1Values[i],
  C2: c2Values[i],
}));

// -----------------------------------------------------------------------------
// Early Warning Data (9 categories with significant gap increase 23 -> 24)
// -----------------------------------------------------------------------------
export const earlyWarningCategories = [
  "채용",
  "교육",
  "업무프로세스",
  "직급승진",
  "평가제도",
  "부식(E)",
  "생산(E)",
  "고성과의식",
  "휴념(E)",
  "전략목표",
];

// -----------------------------------------------------------------------------
// Attrition Data
// -----------------------------------------------------------------------------
export const attritionData = [
  { cluster: "C0 안정군", rate: 10.3, count: 55, color: "#10b981" },
  { cluster: "C1 리스크군", rate: 14.6, count: 22, color: "#ef4444" },
  { cluster: "C2 개선군", rate: 10.3, count: 13, color: "#3b82f6" },
];

export const overallAttritionRate = 11.1;

// -----------------------------------------------------------------------------
// Rank Distribution
// -----------------------------------------------------------------------------
export const rankLevels = ["L1", "L2", "L3", "L4", "임원"];

export const rankDistribution = [
  { level: "L1", C0: 17, C1: 48, C2: 24 },
  { level: "L2", C0: 35, C1: 31, C2: 29 },
  { level: "L3", C0: 36, C1: 19, C2: 44 },
  { level: "L4", C0: 5, C1: 0, C2: 9 },
  { level: "임원", C0: 7, C1: 2, C2: 0 },
];

// -----------------------------------------------------------------------------
// Leadership Radar Data (8 axes, 2023)
// -----------------------------------------------------------------------------
export const leadershipDimensions = [
  "비전전략",
  "동기부여",
  "인재육성",
  "변화관리",
  "권한위임",
  "의사결정",
  "D:냉소",
  "D:스트레스",
];

export const leadershipRadarData = leadershipDimensions.map((dim, i) => ({
  dimension: dim,
  C0: [4.05, 4.1, 3.98, 4.0, 3.96, 4.18, 4.02, 4.08][i],
  C1: [4.35, 4.4, 4.27, 4.3, 4.23, 4.38, 4.28, 4.33][i],
  C2: [3.8, 3.86, 3.75, 3.78, 3.76, 3.82, 3.78, 3.8][i],
}));

// -----------------------------------------------------------------------------
// Comparison Chart Data (C1 vs C0 change values for bar chart)
// -----------------------------------------------------------------------------
export const comparisonData = categories.map((category, i) => ({
  category,
  C1: c1Values[i],
  C0: c0Values[i],
}));

// -----------------------------------------------------------------------------
// Early Warning Signal Data (24년 조기경보 신호 탐지)
// C1-C0 gap values for the 9 flagged categories (23년 vs 24년)
// -----------------------------------------------------------------------------
export const earlyWarningSignalData = [
  { category: "채용", gap23: 0.72, gap24: 0.18, significant: true },
  { category: "교육", gap23: 0.68, gap24: 0.15, significant: true },
  { category: "업무프로세스", gap23: 0.66, gap24: 0.18, significant: true },
  { category: "조직구조", gap23: 0.63, gap24: 0.18, significant: true },
  { category: "평가제도", gap23: 0.59, gap24: 0.20, significant: true },
  { category: "부식(E)", gap23: 0.52, gap24: 0.15, significant: true },
  { category: "고성과의식", gap23: 0.49, gap24: 0.16, significant: true },
  { category: "휴념(E)", gap23: 0.53, gap24: 0.25, significant: true },
  { category: "전략목표", gap23: 0.47, gap24: 0.20, significant: true },
];

// -----------------------------------------------------------------------------
// Key Category Trajectory Data (핵심 중분류 3개년 궤적)
// 6 categories showing progressive deterioration pattern
// -----------------------------------------------------------------------------
export const keyCategoryTrajectoryData = [
  {
    category: "의사소통",
    data: [
      { year: "2023", C0: 3.09, C1: 3.79, C2: 2.61 },
      { year: "2024", C0: 3.15, C1: 3.31, C2: 3.23 },
      { year: "2025", C0: 3.14, C1: 2.85, C2: 3.72 },
    ],
  },
  {
    category: "인력운영",
    data: [
      { year: "2023", C0: 2.70, C1: 3.31, C2: 2.31 },
      { year: "2024", C0: 2.77, C1: 2.80, C2: 2.74 },
      { year: "2025", C0: 2.64, C1: 2.36, C2: 3.08 },
    ],
  },
  {
    category: "교육",
    data: [
      { year: "2023", C0: 3.01, C1: 3.69, C2: 2.55 },
      { year: "2024", C0: 3.48, C1: 3.62, C2: 3.56 },
      { year: "2025", C0: 3.50, C1: 3.27, C2: 3.93 },
    ],
  },
  {
    category: "보상제도",
    data: [
      { year: "2023", C0: 3.10, C1: 3.65, C2: 2.87 },
      { year: "2024", C0: 3.19, C1: 3.22, C2: 3.24 },
      { year: "2025", C0: 3.11, C1: 2.74, C2: 3.55 },
    ],
  },
  {
    category: "휴념(E)",
    data: [
      { year: "2023", C0: 3.14, C1: 3.67, C2: 2.79 },
      { year: "2024", C0: 3.09, C1: 3.34, C2: 3.16 },
      { year: "2025", C0: 3.11, C1: 2.90, C2: 3.47 },
    ],
  },
  {
    category: "몰입도",
    data: [
      { year: "2023", C0: 3.63, C1: 4.17, C2: 3.29 },
      { year: "2024", C0: 3.64, C1: 3.69, C2: 3.71 },
      { year: "2025", C0: 3.60, C1: 3.34, C2: 4.09 },
    ],
  },
];

// Flattened trajectory data for LineChart (all categories combined per year)
export const keyCategoryTrajectoryFlat = keyCategoryTrajectoryData.map((cat) => ({
  category: cat.category,
  c1_2023: cat.data[0].C1,
  c1_2024: cat.data[1].C1,
  c1_2025: cat.data[2].C1,
}));

// Trajectory chart data: year-based for multi-line chart (C1 only, showing deterioration)
export const keyCategoryByYear = [
  {
    year: "2023",
    의사소통: 3.79,
    인력운영: 3.31,
    교육: 3.69,
    보상제도: 3.65,
    "휴념(E)": 3.67,
    몰입도: 4.17,
  },
  {
    year: "2024",
    의사소통: 3.31,
    인력운영: 2.80,
    교육: 3.62,
    보상제도: 3.22,
    "휴념(E)": 3.34,
    몰입도: 3.69,
  },
  {
    year: "2025",
    의사소통: 2.85,
    인력운영: 2.36,
    교육: 3.27,
    보상제도: 2.74,
    "휴념(E)": 2.90,
    몰입도: 3.34,
  },
];

// -----------------------------------------------------------------------------
// Leader Replacement Rate Data (리더 교체율)
// -----------------------------------------------------------------------------
export const leaderReplacementData = [
  { cluster: "C0 안정군", color: "#10b981", rate2425: 23.1, rate2324: 41.4 },
  { cluster: "C1 리스크군", color: "#ef4444", rate2425: 23.0, rate2324: 36.8 },
  { cluster: "C2 개선군", color: "#3b82f6", rate2425: 18.3, rate2324: 45.5 },
];

// -----------------------------------------------------------------------------
// Recommendations
// -----------------------------------------------------------------------------
export const shortTermActions = [
  {
    title: "변화율 기반 조기경보 체계",
    description:
      '"0.3점 이상 하락 + 3개 영역 동시" 조건 자동 플래깅',
  },
  {
    title: "L1 직급 집중 케어",
    description:
      "매니저L1 48% 리스크군, 온보딩/멘토링 강화",
  },
  {
    title: "인력운영 긴급 점검",
    description:
      "업무량 적정성 최악 항목, 워크로드 재조정 시급",
  },
];

export const midTermActions = [
  {
    title: "리더십 기대관리",
    description:
      "높은 리더십 평가가 추후 실망으로 이어지지 않도록 소통 프로세스 강화",
  },
  {
    title: "의사소통 채널 점검",
    description:
      "수직적 의사소통 C1에서 가장 큰 폭 악화, 상향 피드백 구조 개선",
  },
  {
    title: "교육/채용 모멘텀 유지",
    description:
      "유일한 전사적 개선 영역, 투자 지속 필요",
  },
];
