/**
 * 익명화된 제조업체 인력관리 매트릭스 데이터
 * 전체 대상자: ~10,517명
 * 센터 10개 × 직급 4단계 (Lv.1~Lv.4)
 * 3개 메트릭: 주간 근태시간, 주간 근무추정시간, 효율성
 *
 * 조직 계층: 센터 → 담당(Division) → 팀(Team) → 그룹(Group)
 */

export type MetricType = 'efficiency' | 'adjustedWeeklyWorkHours' | 'weeklyClaimedHours';

export interface CenterStats {
  orgCode: string;
  orgName: string;
  orgLevel: 'center';
  headcount: number;
  avgWorkEfficiency: number;
  avgWeeklyClaimedHours: number;
  avgAdjustedWeeklyWorkHours: number;
}

export interface OrgUnit {
  orgCode: string;
  orgName: string;
  orgLevel: 'center' | 'division' | 'team' | 'group';
  parentCode: string;
  headcount: number;
  avgWorkEfficiency: number;
  avgWeeklyClaimedHours: number;
  avgAdjustedWeeklyWorkHours: number;
}

export interface MatrixData {
  grades: string[];
  centers: string[];
  matrix: Record<string, Record<string, number>>;
}

export interface ThresholdInfo {
  low: string;
  middle: string;
  high: string;
  thresholds: { low: number; high: number };
}

export interface DashboardData {
  totalEmployees: number;
  centers: CenterStats[];
  avgEfficiency: number;
  avgWeeklyClaimedHours: number;
  avgAdjustedWeeklyWorkHours: number;
  gradeMatrix: MatrixData;
  weeklyClaimedHoursMatrix: MatrixData;
  adjustedWeeklyWorkHoursMatrix: MatrixData;
  thresholds: {
    efficiency: ThresholdInfo;
    weeklyClaimedHours: ThresholdInfo;
    adjustedWeeklyWorkHours: ThresholdInfo;
  };
}

// ─── 센터 정보 (익명화 제조업체, ~10,517명, 10개 센터) ────────────────────────

const centers: CenterStats[] = [
  { orgCode: 'C1', orgName: '생산1센터', orgLevel: 'center', headcount: 1580, avgWorkEfficiency: 82.3, avgWeeklyClaimedHours: 44.2, avgAdjustedWeeklyWorkHours: 39.8 },
  { orgCode: 'C2', orgName: '생산2센터', orgLevel: 'center', headcount: 1420, avgWorkEfficiency: 79.6, avgWeeklyClaimedHours: 46.1, avgAdjustedWeeklyWorkHours: 41.3 },
  { orgCode: 'C3', orgName: '생산3센터', orgLevel: 'center', headcount: 1150, avgWorkEfficiency: 81.4, avgWeeklyClaimedHours: 44.8, avgAdjustedWeeklyWorkHours: 40.2 },
  { orgCode: 'C4', orgName: '기술센터', orgLevel: 'center', headcount: 1080, avgWorkEfficiency: 85.1, avgWeeklyClaimedHours: 42.8, avgAdjustedWeeklyWorkHours: 38.5 },
  { orgCode: 'C5', orgName: '품질센터', orgLevel: 'center', headcount: 920, avgWorkEfficiency: 83.7, avgWeeklyClaimedHours: 43.5, avgAdjustedWeeklyWorkHours: 39.1 },
  { orgCode: 'C6', orgName: 'R&D센터', orgLevel: 'center', headcount: 880, avgWorkEfficiency: 87.2, avgWeeklyClaimedHours: 41.6, avgAdjustedWeeklyWorkHours: 37.8 },
  { orgCode: 'C7', orgName: '설비센터', orgLevel: 'center', headcount: 780, avgWorkEfficiency: 80.8, avgWeeklyClaimedHours: 45.3, avgAdjustedWeeklyWorkHours: 40.7 },
  { orgCode: 'C8', orgName: '물류센터', orgLevel: 'center', headcount: 720, avgWorkEfficiency: 82.9, avgWeeklyClaimedHours: 43.9, avgAdjustedWeeklyWorkHours: 39.5 },
  { orgCode: 'C9', orgName: '안전환경센터', orgLevel: 'center', headcount: 650, avgWorkEfficiency: 84.5, avgWeeklyClaimedHours: 42.1, avgAdjustedWeeklyWorkHours: 38.2 },
  { orgCode: 'C10', orgName: '경영지원센터', orgLevel: 'center', headcount: 820, avgWorkEfficiency: 86.0, avgWeeklyClaimedHours: 41.8, avgAdjustedWeeklyWorkHours: 37.9 },
];

// ─── 전체 조직 계층 데이터 (Center → Division → Team → Group) ─────────────────

export const orgUnits: OrgUnit[] = [
  // ═══ 생산1센터 (C1, 1580명) ═══
  { orgCode: 'C1-D1', orgName: '조립1담당', orgLevel: 'division', parentCode: 'C1', headcount: 540, avgWorkEfficiency: 81.2, avgWeeklyClaimedHours: 44.8, avgAdjustedWeeklyWorkHours: 40.3 },
  { orgCode: 'C1-D1-T1', orgName: '조립1팀', orgLevel: 'team', parentCode: 'C1-D1', headcount: 180, avgWorkEfficiency: 80.5, avgWeeklyClaimedHours: 45.2, avgAdjustedWeeklyWorkHours: 40.8 },
  { orgCode: 'C1-D1-T1-G1', orgName: '조립1-1조', orgLevel: 'group', parentCode: 'C1-D1-T1', headcount: 45, avgWorkEfficiency: 79.8, avgWeeklyClaimedHours: 45.6, avgAdjustedWeeklyWorkHours: 41.2 },
  { orgCode: 'C1-D1-T1-G2', orgName: '조립1-2조', orgLevel: 'group', parentCode: 'C1-D1-T1', headcount: 45, avgWorkEfficiency: 81.2, avgWeeklyClaimedHours: 44.8, avgAdjustedWeeklyWorkHours: 40.4 },
  { orgCode: 'C1-D1-T1-G3', orgName: '조립1-3조', orgLevel: 'group', parentCode: 'C1-D1-T1', headcount: 45, avgWorkEfficiency: 80.1, avgWeeklyClaimedHours: 45.4, avgAdjustedWeeklyWorkHours: 41.0 },
  { orgCode: 'C1-D1-T1-G4', orgName: '조립1-4조', orgLevel: 'group', parentCode: 'C1-D1-T1', headcount: 45, avgWorkEfficiency: 80.9, avgWeeklyClaimedHours: 45.0, avgAdjustedWeeklyWorkHours: 40.6 },
  { orgCode: 'C1-D1-T2', orgName: '조립2팀', orgLevel: 'team', parentCode: 'C1-D1', headcount: 180, avgWorkEfficiency: 82.1, avgWeeklyClaimedHours: 44.5, avgAdjustedWeeklyWorkHours: 39.9 },
  { orgCode: 'C1-D1-T2-G1', orgName: '조립2-1조', orgLevel: 'group', parentCode: 'C1-D1-T2', headcount: 60, avgWorkEfficiency: 82.5, avgWeeklyClaimedHours: 44.3, avgAdjustedWeeklyWorkHours: 39.7 },
  { orgCode: 'C1-D1-T2-G2', orgName: '조립2-2조', orgLevel: 'group', parentCode: 'C1-D1-T2', headcount: 60, avgWorkEfficiency: 81.8, avgWeeklyClaimedHours: 44.6, avgAdjustedWeeklyWorkHours: 40.0 },
  { orgCode: 'C1-D1-T2-G3', orgName: '조립2-3조', orgLevel: 'group', parentCode: 'C1-D1-T2', headcount: 60, avgWorkEfficiency: 82.0, avgWeeklyClaimedHours: 44.5, avgAdjustedWeeklyWorkHours: 40.1 },
  { orgCode: 'C1-D1-T3', orgName: '조립3팀', orgLevel: 'team', parentCode: 'C1-D1', headcount: 180, avgWorkEfficiency: 80.8, avgWeeklyClaimedHours: 44.7, avgAdjustedWeeklyWorkHours: 40.2 },
  { orgCode: 'C1-D1-T3-G1', orgName: '조립3-1조', orgLevel: 'group', parentCode: 'C1-D1-T3', headcount: 60, avgWorkEfficiency: 80.2, avgWeeklyClaimedHours: 45.0, avgAdjustedWeeklyWorkHours: 40.5 },
  { orgCode: 'C1-D1-T3-G2', orgName: '조립3-2조', orgLevel: 'group', parentCode: 'C1-D1-T3', headcount: 60, avgWorkEfficiency: 81.0, avgWeeklyClaimedHours: 44.6, avgAdjustedWeeklyWorkHours: 40.0 },
  { orgCode: 'C1-D1-T3-G3', orgName: '조립3-3조', orgLevel: 'group', parentCode: 'C1-D1-T3', headcount: 60, avgWorkEfficiency: 81.2, avgWeeklyClaimedHours: 44.5, avgAdjustedWeeklyWorkHours: 40.1 },
  { orgCode: 'C1-D2', orgName: '조립2담당', orgLevel: 'division', parentCode: 'C1', headcount: 520, avgWorkEfficiency: 83.0, avgWeeklyClaimedHours: 43.9, avgAdjustedWeeklyWorkHours: 39.4 },
  { orgCode: 'C1-D2-T1', orgName: '조립4팀', orgLevel: 'team', parentCode: 'C1-D2', headcount: 175, avgWorkEfficiency: 83.5, avgWeeklyClaimedHours: 43.6, avgAdjustedWeeklyWorkHours: 39.1 },
  { orgCode: 'C1-D2-T1-G1', orgName: '조립4-1조', orgLevel: 'group', parentCode: 'C1-D2-T1', headcount: 58, avgWorkEfficiency: 83.8, avgWeeklyClaimedHours: 43.4, avgAdjustedWeeklyWorkHours: 38.9 },
  { orgCode: 'C1-D2-T1-G2', orgName: '조립4-2조', orgLevel: 'group', parentCode: 'C1-D2-T1', headcount: 59, avgWorkEfficiency: 83.2, avgWeeklyClaimedHours: 43.7, avgAdjustedWeeklyWorkHours: 39.2 },
  { orgCode: 'C1-D2-T1-G3', orgName: '조립4-3조', orgLevel: 'group', parentCode: 'C1-D2-T1', headcount: 58, avgWorkEfficiency: 83.5, avgWeeklyClaimedHours: 43.7, avgAdjustedWeeklyWorkHours: 39.2 },
  { orgCode: 'C1-D2-T2', orgName: '조립5팀', orgLevel: 'team', parentCode: 'C1-D2', headcount: 170, avgWorkEfficiency: 82.8, avgWeeklyClaimedHours: 44.0, avgAdjustedWeeklyWorkHours: 39.5 },
  { orgCode: 'C1-D2-T2-G1', orgName: '조립5-1조', orgLevel: 'group', parentCode: 'C1-D2-T2', headcount: 57, avgWorkEfficiency: 83.0, avgWeeklyClaimedHours: 43.9, avgAdjustedWeeklyWorkHours: 39.4 },
  { orgCode: 'C1-D2-T2-G2', orgName: '조립5-2조', orgLevel: 'group', parentCode: 'C1-D2-T2', headcount: 57, avgWorkEfficiency: 82.6, avgWeeklyClaimedHours: 44.1, avgAdjustedWeeklyWorkHours: 39.6 },
  { orgCode: 'C1-D2-T2-G3', orgName: '조립5-3조', orgLevel: 'group', parentCode: 'C1-D2-T2', headcount: 56, avgWorkEfficiency: 82.8, avgWeeklyClaimedHours: 44.0, avgAdjustedWeeklyWorkHours: 39.5 },
  { orgCode: 'C1-D2-T3', orgName: '조립6팀', orgLevel: 'team', parentCode: 'C1-D2', headcount: 175, avgWorkEfficiency: 82.7, avgWeeklyClaimedHours: 44.1, avgAdjustedWeeklyWorkHours: 39.7 },
  { orgCode: 'C1-D2-T3-G1', orgName: '조립6-1조', orgLevel: 'group', parentCode: 'C1-D2-T3', headcount: 58, avgWorkEfficiency: 82.9, avgWeeklyClaimedHours: 44.0, avgAdjustedWeeklyWorkHours: 39.6 },
  { orgCode: 'C1-D2-T3-G2', orgName: '조립6-2조', orgLevel: 'group', parentCode: 'C1-D2-T3', headcount: 59, avgWorkEfficiency: 82.5, avgWeeklyClaimedHours: 44.2, avgAdjustedWeeklyWorkHours: 39.8 },
  { orgCode: 'C1-D2-T3-G3', orgName: '조립6-3조', orgLevel: 'group', parentCode: 'C1-D2-T3', headcount: 58, avgWorkEfficiency: 82.7, avgWeeklyClaimedHours: 44.1, avgAdjustedWeeklyWorkHours: 39.7 },
  { orgCode: 'C1-D3', orgName: '생산관리담당', orgLevel: 'division', parentCode: 'C1', headcount: 520, avgWorkEfficiency: 82.8, avgWeeklyClaimedHours: 44.0, avgAdjustedWeeklyWorkHours: 39.6 },
  { orgCode: 'C1-D3-T1', orgName: '생산관리팀', orgLevel: 'team', parentCode: 'C1-D3', headcount: 130, avgWorkEfficiency: 84.2, avgWeeklyClaimedHours: 43.2, avgAdjustedWeeklyWorkHours: 38.8 },
  { orgCode: 'C1-D3-T1-G1', orgName: '생산관리1조', orgLevel: 'group', parentCode: 'C1-D3-T1', headcount: 65, avgWorkEfficiency: 84.5, avgWeeklyClaimedHours: 43.0, avgAdjustedWeeklyWorkHours: 38.6 },
  { orgCode: 'C1-D3-T1-G2', orgName: '생산관리2조', orgLevel: 'group', parentCode: 'C1-D3-T1', headcount: 65, avgWorkEfficiency: 83.9, avgWeeklyClaimedHours: 43.4, avgAdjustedWeeklyWorkHours: 39.0 },
  { orgCode: 'C1-D3-T2', orgName: '공정기술팀', orgLevel: 'team', parentCode: 'C1-D3', headcount: 195, avgWorkEfficiency: 82.4, avgWeeklyClaimedHours: 44.2, avgAdjustedWeeklyWorkHours: 39.8 },
  { orgCode: 'C1-D3-T2-G1', orgName: '공정기술1조', orgLevel: 'group', parentCode: 'C1-D3-T2', headcount: 65, avgWorkEfficiency: 82.8, avgWeeklyClaimedHours: 44.0, avgAdjustedWeeklyWorkHours: 39.6 },
  { orgCode: 'C1-D3-T2-G2', orgName: '공정기술2조', orgLevel: 'group', parentCode: 'C1-D3-T2', headcount: 65, avgWorkEfficiency: 82.0, avgWeeklyClaimedHours: 44.4, avgAdjustedWeeklyWorkHours: 40.0 },
  { orgCode: 'C1-D3-T2-G3', orgName: '공정기술3조', orgLevel: 'group', parentCode: 'C1-D3-T2', headcount: 65, avgWorkEfficiency: 82.4, avgWeeklyClaimedHours: 44.2, avgAdjustedWeeklyWorkHours: 39.8 },
  { orgCode: 'C1-D3-T3', orgName: '자재관리팀', orgLevel: 'team', parentCode: 'C1-D3', headcount: 195, avgWorkEfficiency: 81.8, avgWeeklyClaimedHours: 44.6, avgAdjustedWeeklyWorkHours: 40.2 },
  { orgCode: 'C1-D3-T3-G1', orgName: '자재관리1조', orgLevel: 'group', parentCode: 'C1-D3-T3', headcount: 65, avgWorkEfficiency: 82.0, avgWeeklyClaimedHours: 44.5, avgAdjustedWeeklyWorkHours: 40.1 },
  { orgCode: 'C1-D3-T3-G2', orgName: '자재관리2조', orgLevel: 'group', parentCode: 'C1-D3-T3', headcount: 65, avgWorkEfficiency: 81.6, avgWeeklyClaimedHours: 44.7, avgAdjustedWeeklyWorkHours: 40.3 },
  { orgCode: 'C1-D3-T3-G3', orgName: '자재관리3조', orgLevel: 'group', parentCode: 'C1-D3-T3', headcount: 65, avgWorkEfficiency: 81.8, avgWeeklyClaimedHours: 44.6, avgAdjustedWeeklyWorkHours: 40.2 },

  // ═══ 생산2센터 (C2, 1420명) ═══ - 번아웃 위험 센터
  { orgCode: 'C2-D1', orgName: '도장담당', orgLevel: 'division', parentCode: 'C2', headcount: 480, avgWorkEfficiency: 78.4, avgWeeklyClaimedHours: 47.2, avgAdjustedWeeklyWorkHours: 42.5 },
  { orgCode: 'C2-D1-T1', orgName: '도장1팀', orgLevel: 'team', parentCode: 'C2-D1', headcount: 160, avgWorkEfficiency: 76.8, avgWeeklyClaimedHours: 48.1, avgAdjustedWeeklyWorkHours: 43.2 },
  { orgCode: 'C2-D1-T1-G1', orgName: '도장1-1조', orgLevel: 'group', parentCode: 'C2-D1-T1', headcount: 40, avgWorkEfficiency: 75.2, avgWeeklyClaimedHours: 48.8, avgAdjustedWeeklyWorkHours: 43.9 },
  { orgCode: 'C2-D1-T1-G2', orgName: '도장1-2조', orgLevel: 'group', parentCode: 'C2-D1-T1', headcount: 40, avgWorkEfficiency: 77.1, avgWeeklyClaimedHours: 47.9, avgAdjustedWeeklyWorkHours: 43.0 },
  { orgCode: 'C2-D1-T1-G3', orgName: '도장1-3조', orgLevel: 'group', parentCode: 'C2-D1-T1', headcount: 40, avgWorkEfficiency: 76.5, avgWeeklyClaimedHours: 48.3, avgAdjustedWeeklyWorkHours: 43.4 },
  { orgCode: 'C2-D1-T1-G4', orgName: '도장1-4조', orgLevel: 'group', parentCode: 'C2-D1-T1', headcount: 40, avgWorkEfficiency: 78.4, avgWeeklyClaimedHours: 47.4, avgAdjustedWeeklyWorkHours: 42.5 },
  { orgCode: 'C2-D1-T2', orgName: '도장2팀', orgLevel: 'team', parentCode: 'C2-D1', headcount: 160, avgWorkEfficiency: 79.2, avgWeeklyClaimedHours: 46.8, avgAdjustedWeeklyWorkHours: 42.1 },
  { orgCode: 'C2-D1-T2-G1', orgName: '도장2-1조', orgLevel: 'group', parentCode: 'C2-D1-T2', headcount: 53, avgWorkEfficiency: 79.5, avgWeeklyClaimedHours: 46.6, avgAdjustedWeeklyWorkHours: 41.9 },
  { orgCode: 'C2-D1-T2-G2', orgName: '도장2-2조', orgLevel: 'group', parentCode: 'C2-D1-T2', headcount: 54, avgWorkEfficiency: 78.8, avgWeeklyClaimedHours: 47.0, avgAdjustedWeeklyWorkHours: 42.3 },
  { orgCode: 'C2-D1-T2-G3', orgName: '도장2-3조', orgLevel: 'group', parentCode: 'C2-D1-T2', headcount: 53, avgWorkEfficiency: 79.3, avgWeeklyClaimedHours: 46.8, avgAdjustedWeeklyWorkHours: 42.1 },
  { orgCode: 'C2-D1-T3', orgName: '도장3팀', orgLevel: 'team', parentCode: 'C2-D1', headcount: 160, avgWorkEfficiency: 79.2, avgWeeklyClaimedHours: 46.7, avgAdjustedWeeklyWorkHours: 42.2 },
  { orgCode: 'C2-D1-T3-G1', orgName: '도장3-1조', orgLevel: 'group', parentCode: 'C2-D1-T3', headcount: 53, avgWorkEfficiency: 79.0, avgWeeklyClaimedHours: 46.8, avgAdjustedWeeklyWorkHours: 42.3 },
  { orgCode: 'C2-D1-T3-G2', orgName: '도장3-2조', orgLevel: 'group', parentCode: 'C2-D1-T3', headcount: 54, avgWorkEfficiency: 79.4, avgWeeklyClaimedHours: 46.6, avgAdjustedWeeklyWorkHours: 42.1 },
  { orgCode: 'C2-D1-T3-G3', orgName: '도장3-3조', orgLevel: 'group', parentCode: 'C2-D1-T3', headcount: 53, avgWorkEfficiency: 79.2, avgWeeklyClaimedHours: 46.7, avgAdjustedWeeklyWorkHours: 42.2 },
  { orgCode: 'C2-D2', orgName: '용접담당', orgLevel: 'division', parentCode: 'C2', headcount: 470, avgWorkEfficiency: 80.2, avgWeeklyClaimedHours: 45.6, avgAdjustedWeeklyWorkHours: 40.8 },
  { orgCode: 'C2-D2-T1', orgName: '용접1팀', orgLevel: 'team', parentCode: 'C2-D2', headcount: 160, avgWorkEfficiency: 79.8, avgWeeklyClaimedHours: 45.9, avgAdjustedWeeklyWorkHours: 41.1 },
  { orgCode: 'C2-D2-T1-G1', orgName: '용접1-1조', orgLevel: 'group', parentCode: 'C2-D2-T1', headcount: 53, avgWorkEfficiency: 79.5, avgWeeklyClaimedHours: 46.1, avgAdjustedWeeklyWorkHours: 41.3 },
  { orgCode: 'C2-D2-T1-G2', orgName: '용접1-2조', orgLevel: 'group', parentCode: 'C2-D2-T1', headcount: 54, avgWorkEfficiency: 80.0, avgWeeklyClaimedHours: 45.8, avgAdjustedWeeklyWorkHours: 41.0 },
  { orgCode: 'C2-D2-T1-G3', orgName: '용접1-3조', orgLevel: 'group', parentCode: 'C2-D2-T1', headcount: 53, avgWorkEfficiency: 79.9, avgWeeklyClaimedHours: 45.8, avgAdjustedWeeklyWorkHours: 41.0 },
  { orgCode: 'C2-D2-T2', orgName: '용접2팀', orgLevel: 'team', parentCode: 'C2-D2', headcount: 155, avgWorkEfficiency: 80.5, avgWeeklyClaimedHours: 45.4, avgAdjustedWeeklyWorkHours: 40.6 },
  { orgCode: 'C2-D2-T2-G1', orgName: '용접2-1조', orgLevel: 'group', parentCode: 'C2-D2-T2', headcount: 52, avgWorkEfficiency: 80.8, avgWeeklyClaimedHours: 45.2, avgAdjustedWeeklyWorkHours: 40.4 },
  { orgCode: 'C2-D2-T2-G2', orgName: '용접2-2조', orgLevel: 'group', parentCode: 'C2-D2-T2', headcount: 52, avgWorkEfficiency: 80.2, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.7 },
  { orgCode: 'C2-D2-T2-G3', orgName: '용접2-3조', orgLevel: 'group', parentCode: 'C2-D2-T2', headcount: 51, avgWorkEfficiency: 80.5, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.7 },
  { orgCode: 'C2-D2-T3', orgName: '용접3팀', orgLevel: 'team', parentCode: 'C2-D2', headcount: 155, avgWorkEfficiency: 80.3, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.7 },
  { orgCode: 'C2-D2-T3-G1', orgName: '용접3-1조', orgLevel: 'group', parentCode: 'C2-D2-T3', headcount: 52, avgWorkEfficiency: 80.5, avgWeeklyClaimedHours: 45.4, avgAdjustedWeeklyWorkHours: 40.6 },
  { orgCode: 'C2-D2-T3-G2', orgName: '용접3-2조', orgLevel: 'group', parentCode: 'C2-D2-T3', headcount: 52, avgWorkEfficiency: 80.1, avgWeeklyClaimedHours: 45.6, avgAdjustedWeeklyWorkHours: 40.8 },
  { orgCode: 'C2-D2-T3-G3', orgName: '용접3-3조', orgLevel: 'group', parentCode: 'C2-D2-T3', headcount: 51, avgWorkEfficiency: 80.3, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.7 },
  { orgCode: 'C2-D3', orgName: '프레스담당', orgLevel: 'division', parentCode: 'C2', headcount: 470, avgWorkEfficiency: 80.4, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.6 },
  { orgCode: 'C2-D3-T1', orgName: '프레스1팀', orgLevel: 'team', parentCode: 'C2-D3', headcount: 157, avgWorkEfficiency: 80.0, avgWeeklyClaimedHours: 45.7, avgAdjustedWeeklyWorkHours: 40.8 },
  { orgCode: 'C2-D3-T1-G1', orgName: '프레스1-1조', orgLevel: 'group', parentCode: 'C2-D3-T1', headcount: 52, avgWorkEfficiency: 79.8, avgWeeklyClaimedHours: 45.8, avgAdjustedWeeklyWorkHours: 40.9 },
  { orgCode: 'C2-D3-T1-G2', orgName: '프레스1-2조', orgLevel: 'group', parentCode: 'C2-D3-T1', headcount: 53, avgWorkEfficiency: 80.2, avgWeeklyClaimedHours: 45.6, avgAdjustedWeeklyWorkHours: 40.7 },
  { orgCode: 'C2-D3-T1-G3', orgName: '프레스1-3조', orgLevel: 'group', parentCode: 'C2-D3-T1', headcount: 52, avgWorkEfficiency: 80.0, avgWeeklyClaimedHours: 45.7, avgAdjustedWeeklyWorkHours: 40.8 },
  { orgCode: 'C2-D3-T2', orgName: '프레스2팀', orgLevel: 'team', parentCode: 'C2-D3', headcount: 157, avgWorkEfficiency: 80.6, avgWeeklyClaimedHours: 45.4, avgAdjustedWeeklyWorkHours: 40.5 },
  { orgCode: 'C2-D3-T2-G1', orgName: '프레스2-1조', orgLevel: 'group', parentCode: 'C2-D3-T2', headcount: 52, avgWorkEfficiency: 80.8, avgWeeklyClaimedHours: 45.3, avgAdjustedWeeklyWorkHours: 40.4 },
  { orgCode: 'C2-D3-T2-G2', orgName: '프레스2-2조', orgLevel: 'group', parentCode: 'C2-D3-T2', headcount: 53, avgWorkEfficiency: 80.4, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.6 },
  { orgCode: 'C2-D3-T2-G3', orgName: '프레스2-3조', orgLevel: 'group', parentCode: 'C2-D3-T2', headcount: 52, avgWorkEfficiency: 80.6, avgWeeklyClaimedHours: 45.4, avgAdjustedWeeklyWorkHours: 40.5 },
  { orgCode: 'C2-D3-T3', orgName: '프레스3팀', orgLevel: 'team', parentCode: 'C2-D3', headcount: 156, avgWorkEfficiency: 80.6, avgWeeklyClaimedHours: 45.4, avgAdjustedWeeklyWorkHours: 40.5 },
  { orgCode: 'C2-D3-T3-G1', orgName: '프레스3-1조', orgLevel: 'group', parentCode: 'C2-D3-T3', headcount: 52, avgWorkEfficiency: 80.8, avgWeeklyClaimedHours: 45.3, avgAdjustedWeeklyWorkHours: 40.4 },
  { orgCode: 'C2-D3-T3-G2', orgName: '프레스3-2조', orgLevel: 'group', parentCode: 'C2-D3-T3', headcount: 52, avgWorkEfficiency: 80.4, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.6 },
  { orgCode: 'C2-D3-T3-G3', orgName: '프레스3-3조', orgLevel: 'group', parentCode: 'C2-D3-T3', headcount: 52, avgWorkEfficiency: 80.6, avgWeeklyClaimedHours: 45.4, avgAdjustedWeeklyWorkHours: 40.5 },

  // ═══ 생산3센터 (C3, 1150명) ═══
  { orgCode: 'C3-D1', orgName: '엔진담당', orgLevel: 'division', parentCode: 'C3', headcount: 390, avgWorkEfficiency: 81.8, avgWeeklyClaimedHours: 44.5, avgAdjustedWeeklyWorkHours: 39.9 },
  { orgCode: 'C3-D1-T1', orgName: '엔진1팀', orgLevel: 'team', parentCode: 'C3-D1', headcount: 130, avgWorkEfficiency: 82.2, avgWeeklyClaimedHours: 44.3, avgAdjustedWeeklyWorkHours: 39.7 },
  { orgCode: 'C3-D1-T2', orgName: '엔진2팀', orgLevel: 'team', parentCode: 'C3-D1', headcount: 130, avgWorkEfficiency: 81.5, avgWeeklyClaimedHours: 44.6, avgAdjustedWeeklyWorkHours: 40.0 },
  { orgCode: 'C3-D1-T3', orgName: '엔진3팀', orgLevel: 'team', parentCode: 'C3-D1', headcount: 130, avgWorkEfficiency: 81.7, avgWeeklyClaimedHours: 44.6, avgAdjustedWeeklyWorkHours: 40.0 },
  { orgCode: 'C3-D2', orgName: '변속기담당', orgLevel: 'division', parentCode: 'C3', headcount: 380, avgWorkEfficiency: 81.2, avgWeeklyClaimedHours: 44.9, avgAdjustedWeeklyWorkHours: 40.3 },
  { orgCode: 'C3-D2-T1', orgName: '변속기1팀', orgLevel: 'team', parentCode: 'C3-D2', headcount: 127, avgWorkEfficiency: 81.5, avgWeeklyClaimedHours: 44.7, avgAdjustedWeeklyWorkHours: 40.1 },
  { orgCode: 'C3-D2-T2', orgName: '변속기2팀', orgLevel: 'team', parentCode: 'C3-D2', headcount: 127, avgWorkEfficiency: 80.9, avgWeeklyClaimedHours: 45.0, avgAdjustedWeeklyWorkHours: 40.4 },
  { orgCode: 'C3-D2-T3', orgName: '변속기3팀', orgLevel: 'team', parentCode: 'C3-D2', headcount: 126, avgWorkEfficiency: 81.2, avgWeeklyClaimedHours: 45.0, avgAdjustedWeeklyWorkHours: 40.4 },
  { orgCode: 'C3-D3', orgName: '부품담당', orgLevel: 'division', parentCode: 'C3', headcount: 380, avgWorkEfficiency: 81.2, avgWeeklyClaimedHours: 45.0, avgAdjustedWeeklyWorkHours: 40.4 },
  { orgCode: 'C3-D3-T1', orgName: '부품1팀', orgLevel: 'team', parentCode: 'C3-D3', headcount: 127, avgWorkEfficiency: 81.5, avgWeeklyClaimedHours: 44.8, avgAdjustedWeeklyWorkHours: 40.2 },
  { orgCode: 'C3-D3-T2', orgName: '부품2팀', orgLevel: 'team', parentCode: 'C3-D3', headcount: 127, avgWorkEfficiency: 81.0, avgWeeklyClaimedHours: 45.1, avgAdjustedWeeklyWorkHours: 40.5 },
  { orgCode: 'C3-D3-T3', orgName: '부품3팀', orgLevel: 'team', parentCode: 'C3-D3', headcount: 126, avgWorkEfficiency: 81.1, avgWeeklyClaimedHours: 45.1, avgAdjustedWeeklyWorkHours: 40.5 },

  // ═══ 기술센터 (C4, 1080명) ═══
  { orgCode: 'C4-D1', orgName: '설계담당', orgLevel: 'division', parentCode: 'C4', headcount: 360, avgWorkEfficiency: 85.8, avgWeeklyClaimedHours: 42.5, avgAdjustedWeeklyWorkHours: 38.2 },
  { orgCode: 'C4-D1-T1', orgName: '설계1팀', orgLevel: 'team', parentCode: 'C4-D1', headcount: 120, avgWorkEfficiency: 86.2, avgWeeklyClaimedHours: 42.3, avgAdjustedWeeklyWorkHours: 38.0 },
  { orgCode: 'C4-D1-T2', orgName: '설계2팀', orgLevel: 'team', parentCode: 'C4-D1', headcount: 120, avgWorkEfficiency: 85.5, avgWeeklyClaimedHours: 42.6, avgAdjustedWeeklyWorkHours: 38.3 },
  { orgCode: 'C4-D1-T3', orgName: '설계3팀', orgLevel: 'team', parentCode: 'C4-D1', headcount: 120, avgWorkEfficiency: 85.7, avgWeeklyClaimedHours: 42.6, avgAdjustedWeeklyWorkHours: 38.3 },
  { orgCode: 'C4-D2', orgName: '시험담당', orgLevel: 'division', parentCode: 'C4', headcount: 360, avgWorkEfficiency: 84.8, avgWeeklyClaimedHours: 42.9, avgAdjustedWeeklyWorkHours: 38.6 },
  { orgCode: 'C4-D2-T1', orgName: '시험1팀', orgLevel: 'team', parentCode: 'C4-D2', headcount: 120, avgWorkEfficiency: 85.0, avgWeeklyClaimedHours: 42.8, avgAdjustedWeeklyWorkHours: 38.5 },
  { orgCode: 'C4-D2-T2', orgName: '시험2팀', orgLevel: 'team', parentCode: 'C4-D2', headcount: 120, avgWorkEfficiency: 84.6, avgWeeklyClaimedHours: 43.0, avgAdjustedWeeklyWorkHours: 38.7 },
  { orgCode: 'C4-D2-T3', orgName: '시험3팀', orgLevel: 'team', parentCode: 'C4-D2', headcount: 120, avgWorkEfficiency: 84.8, avgWeeklyClaimedHours: 42.9, avgAdjustedWeeklyWorkHours: 38.6 },
  { orgCode: 'C4-D3', orgName: 'CAE담당', orgLevel: 'division', parentCode: 'C4', headcount: 360, avgWorkEfficiency: 84.7, avgWeeklyClaimedHours: 43.0, avgAdjustedWeeklyWorkHours: 38.7 },
  { orgCode: 'C4-D3-T1', orgName: 'CAE1팀', orgLevel: 'team', parentCode: 'C4-D3', headcount: 120, avgWorkEfficiency: 85.0, avgWeeklyClaimedHours: 42.8, avgAdjustedWeeklyWorkHours: 38.5 },
  { orgCode: 'C4-D3-T2', orgName: 'CAE2팀', orgLevel: 'team', parentCode: 'C4-D3', headcount: 120, avgWorkEfficiency: 84.5, avgWeeklyClaimedHours: 43.1, avgAdjustedWeeklyWorkHours: 38.8 },
  { orgCode: 'C4-D3-T3', orgName: 'CAE3팀', orgLevel: 'team', parentCode: 'C4-D3', headcount: 120, avgWorkEfficiency: 84.6, avgWeeklyClaimedHours: 43.1, avgAdjustedWeeklyWorkHours: 38.8 },

  // ═══ 품질센터 (C5, 920명) ═══
  { orgCode: 'C5-D1', orgName: '품질보증담당', orgLevel: 'division', parentCode: 'C5', headcount: 310, avgWorkEfficiency: 84.0, avgWeeklyClaimedHours: 43.3, avgAdjustedWeeklyWorkHours: 38.9 },
  { orgCode: 'C5-D1-T1', orgName: '품질보증1팀', orgLevel: 'team', parentCode: 'C5-D1', headcount: 105, avgWorkEfficiency: 84.3, avgWeeklyClaimedHours: 43.1, avgAdjustedWeeklyWorkHours: 38.7 },
  { orgCode: 'C5-D1-T2', orgName: '품질보증2팀', orgLevel: 'team', parentCode: 'C5-D1', headcount: 105, avgWorkEfficiency: 83.8, avgWeeklyClaimedHours: 43.4, avgAdjustedWeeklyWorkHours: 39.0 },
  { orgCode: 'C5-D1-T3', orgName: '품질보증3팀', orgLevel: 'team', parentCode: 'C5-D1', headcount: 100, avgWorkEfficiency: 83.9, avgWeeklyClaimedHours: 43.4, avgAdjustedWeeklyWorkHours: 39.0 },
  { orgCode: 'C5-D2', orgName: '품질관리담당', orgLevel: 'division', parentCode: 'C5', headcount: 310, avgWorkEfficiency: 83.5, avgWeeklyClaimedHours: 43.6, avgAdjustedWeeklyWorkHours: 39.2 },
  { orgCode: 'C5-D2-T1', orgName: '품질관리1팀', orgLevel: 'team', parentCode: 'C5-D2', headcount: 105, avgWorkEfficiency: 83.8, avgWeeklyClaimedHours: 43.4, avgAdjustedWeeklyWorkHours: 39.0 },
  { orgCode: 'C5-D2-T2', orgName: '품질관리2팀', orgLevel: 'team', parentCode: 'C5-D2', headcount: 105, avgWorkEfficiency: 83.2, avgWeeklyClaimedHours: 43.7, avgAdjustedWeeklyWorkHours: 39.3 },
  { orgCode: 'C5-D2-T3', orgName: '품질관리3팀', orgLevel: 'team', parentCode: 'C5-D2', headcount: 100, avgWorkEfficiency: 83.5, avgWeeklyClaimedHours: 43.7, avgAdjustedWeeklyWorkHours: 39.3 },
  { orgCode: 'C5-D3', orgName: '협력업체품질담당', orgLevel: 'division', parentCode: 'C5', headcount: 300, avgWorkEfficiency: 83.6, avgWeeklyClaimedHours: 43.6, avgAdjustedWeeklyWorkHours: 39.2 },
  { orgCode: 'C5-D3-T1', orgName: '협력품질1팀', orgLevel: 'team', parentCode: 'C5-D3', headcount: 100, avgWorkEfficiency: 83.9, avgWeeklyClaimedHours: 43.4, avgAdjustedWeeklyWorkHours: 39.0 },
  { orgCode: 'C5-D3-T2', orgName: '협력품질2팀', orgLevel: 'team', parentCode: 'C5-D3', headcount: 100, avgWorkEfficiency: 83.3, avgWeeklyClaimedHours: 43.7, avgAdjustedWeeklyWorkHours: 39.3 },
  { orgCode: 'C5-D3-T3', orgName: '협력품질3팀', orgLevel: 'team', parentCode: 'C5-D3', headcount: 100, avgWorkEfficiency: 83.6, avgWeeklyClaimedHours: 43.7, avgAdjustedWeeklyWorkHours: 39.3 },

  // ═══ R&D센터 (C6, 880명) ═══
  { orgCode: 'C6-D1', orgName: '선행연구담당', orgLevel: 'division', parentCode: 'C6', headcount: 300, avgWorkEfficiency: 87.8, avgWeeklyClaimedHours: 41.2, avgAdjustedWeeklyWorkHours: 37.5 },
  { orgCode: 'C6-D1-T1', orgName: '선행연구1팀', orgLevel: 'team', parentCode: 'C6-D1', headcount: 100, avgWorkEfficiency: 88.2, avgWeeklyClaimedHours: 41.0, avgAdjustedWeeklyWorkHours: 37.3 },
  { orgCode: 'C6-D1-T2', orgName: '선행연구2팀', orgLevel: 'team', parentCode: 'C6-D1', headcount: 100, avgWorkEfficiency: 87.5, avgWeeklyClaimedHours: 41.3, avgAdjustedWeeklyWorkHours: 37.6 },
  { orgCode: 'C6-D1-T3', orgName: '선행연구3팀', orgLevel: 'team', parentCode: 'C6-D1', headcount: 100, avgWorkEfficiency: 87.7, avgWeeklyClaimedHours: 41.3, avgAdjustedWeeklyWorkHours: 37.6 },
  { orgCode: 'C6-D2', orgName: '제품개발담당', orgLevel: 'division', parentCode: 'C6', headcount: 290, avgWorkEfficiency: 87.0, avgWeeklyClaimedHours: 41.8, avgAdjustedWeeklyWorkHours: 37.9 },
  { orgCode: 'C6-D2-T1', orgName: '제품개발1팀', orgLevel: 'team', parentCode: 'C6-D2', headcount: 97, avgWorkEfficiency: 87.3, avgWeeklyClaimedHours: 41.6, avgAdjustedWeeklyWorkHours: 37.7 },
  { orgCode: 'C6-D2-T2', orgName: '제품개발2팀', orgLevel: 'team', parentCode: 'C6-D2', headcount: 97, avgWorkEfficiency: 86.8, avgWeeklyClaimedHours: 41.9, avgAdjustedWeeklyWorkHours: 38.0 },
  { orgCode: 'C6-D2-T3', orgName: '제품개발3팀', orgLevel: 'team', parentCode: 'C6-D2', headcount: 96, avgWorkEfficiency: 86.9, avgWeeklyClaimedHours: 41.9, avgAdjustedWeeklyWorkHours: 38.0 },
  { orgCode: 'C6-D3', orgName: '소재연구담당', orgLevel: 'division', parentCode: 'C6', headcount: 290, avgWorkEfficiency: 86.8, avgWeeklyClaimedHours: 41.8, avgAdjustedWeeklyWorkHours: 37.9 },
  { orgCode: 'C6-D3-T1', orgName: '소재연구1팀', orgLevel: 'team', parentCode: 'C6-D3', headcount: 97, avgWorkEfficiency: 87.0, avgWeeklyClaimedHours: 41.7, avgAdjustedWeeklyWorkHours: 37.8 },
  { orgCode: 'C6-D3-T2', orgName: '소재연구2팀', orgLevel: 'team', parentCode: 'C6-D3', headcount: 97, avgWorkEfficiency: 86.6, avgWeeklyClaimedHours: 41.9, avgAdjustedWeeklyWorkHours: 38.0 },
  { orgCode: 'C6-D3-T3', orgName: '소재연구3팀', orgLevel: 'team', parentCode: 'C6-D3', headcount: 96, avgWorkEfficiency: 86.8, avgWeeklyClaimedHours: 41.8, avgAdjustedWeeklyWorkHours: 37.9 },

  // ═══ 설비센터 (C7, 780명) ═══
  { orgCode: 'C7-D1', orgName: '설비보전담당', orgLevel: 'division', parentCode: 'C7', headcount: 260, avgWorkEfficiency: 81.0, avgWeeklyClaimedHours: 45.1, avgAdjustedWeeklyWorkHours: 40.5 },
  { orgCode: 'C7-D1-T1', orgName: '설비보전1팀', orgLevel: 'team', parentCode: 'C7-D1', headcount: 87, avgWorkEfficiency: 81.3, avgWeeklyClaimedHours: 44.9, avgAdjustedWeeklyWorkHours: 40.3 },
  { orgCode: 'C7-D1-T2', orgName: '설비보전2팀', orgLevel: 'team', parentCode: 'C7-D1', headcount: 87, avgWorkEfficiency: 80.7, avgWeeklyClaimedHours: 45.2, avgAdjustedWeeklyWorkHours: 40.6 },
  { orgCode: 'C7-D1-T3', orgName: '설비보전3팀', orgLevel: 'team', parentCode: 'C7-D1', headcount: 86, avgWorkEfficiency: 81.0, avgWeeklyClaimedHours: 45.2, avgAdjustedWeeklyWorkHours: 40.6 },
  { orgCode: 'C7-D2', orgName: '유틸리티담당', orgLevel: 'division', parentCode: 'C7', headcount: 260, avgWorkEfficiency: 80.5, avgWeeklyClaimedHours: 45.4, avgAdjustedWeeklyWorkHours: 40.8 },
  { orgCode: 'C7-D2-T1', orgName: '유틸리티1팀', orgLevel: 'team', parentCode: 'C7-D2', headcount: 87, avgWorkEfficiency: 80.8, avgWeeklyClaimedHours: 45.2, avgAdjustedWeeklyWorkHours: 40.6 },
  { orgCode: 'C7-D2-T2', orgName: '유틸리티2팀', orgLevel: 'team', parentCode: 'C7-D2', headcount: 87, avgWorkEfficiency: 80.2, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.9 },
  { orgCode: 'C7-D2-T3', orgName: '유틸리티3팀', orgLevel: 'team', parentCode: 'C7-D2', headcount: 86, avgWorkEfficiency: 80.5, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.9 },
  { orgCode: 'C7-D3', orgName: '자동화담당', orgLevel: 'division', parentCode: 'C7', headcount: 260, avgWorkEfficiency: 80.9, avgWeeklyClaimedHours: 45.4, avgAdjustedWeeklyWorkHours: 40.8 },
  { orgCode: 'C7-D3-T1', orgName: '자동화1팀', orgLevel: 'team', parentCode: 'C7-D3', headcount: 87, avgWorkEfficiency: 81.2, avgWeeklyClaimedHours: 45.2, avgAdjustedWeeklyWorkHours: 40.6 },
  { orgCode: 'C7-D3-T2', orgName: '자동화2팀', orgLevel: 'team', parentCode: 'C7-D3', headcount: 87, avgWorkEfficiency: 80.6, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.9 },
  { orgCode: 'C7-D3-T3', orgName: '자동화3팀', orgLevel: 'team', parentCode: 'C7-D3', headcount: 86, avgWorkEfficiency: 80.9, avgWeeklyClaimedHours: 45.5, avgAdjustedWeeklyWorkHours: 40.9 },

  // ═══ 물류센터 (C8, 720명) ═══
  { orgCode: 'C8-D1', orgName: '입고물류담당', orgLevel: 'division', parentCode: 'C8', headcount: 240, avgWorkEfficiency: 83.2, avgWeeklyClaimedHours: 43.7, avgAdjustedWeeklyWorkHours: 39.3 },
  { orgCode: 'C8-D1-T1', orgName: '입고물류1팀', orgLevel: 'team', parentCode: 'C8-D1', headcount: 80, avgWorkEfficiency: 83.5, avgWeeklyClaimedHours: 43.5, avgAdjustedWeeklyWorkHours: 39.1 },
  { orgCode: 'C8-D1-T2', orgName: '입고물류2팀', orgLevel: 'team', parentCode: 'C8-D1', headcount: 80, avgWorkEfficiency: 82.9, avgWeeklyClaimedHours: 43.8, avgAdjustedWeeklyWorkHours: 39.4 },
  { orgCode: 'C8-D1-T3', orgName: '입고물류3팀', orgLevel: 'team', parentCode: 'C8-D1', headcount: 80, avgWorkEfficiency: 83.2, avgWeeklyClaimedHours: 43.8, avgAdjustedWeeklyWorkHours: 39.4 },
  { orgCode: 'C8-D2', orgName: '출하물류담당', orgLevel: 'division', parentCode: 'C8', headcount: 240, avgWorkEfficiency: 82.8, avgWeeklyClaimedHours: 44.0, avgAdjustedWeeklyWorkHours: 39.6 },
  { orgCode: 'C8-D2-T1', orgName: '출하물류1팀', orgLevel: 'team', parentCode: 'C8-D2', headcount: 80, avgWorkEfficiency: 83.1, avgWeeklyClaimedHours: 43.8, avgAdjustedWeeklyWorkHours: 39.4 },
  { orgCode: 'C8-D2-T2', orgName: '출하물류2팀', orgLevel: 'team', parentCode: 'C8-D2', headcount: 80, avgWorkEfficiency: 82.5, avgWeeklyClaimedHours: 44.1, avgAdjustedWeeklyWorkHours: 39.7 },
  { orgCode: 'C8-D2-T3', orgName: '출하물류3팀', orgLevel: 'team', parentCode: 'C8-D2', headcount: 80, avgWorkEfficiency: 82.8, avgWeeklyClaimedHours: 44.1, avgAdjustedWeeklyWorkHours: 39.7 },
  { orgCode: 'C8-D3', orgName: '물류기획담당', orgLevel: 'division', parentCode: 'C8', headcount: 240, avgWorkEfficiency: 82.7, avgWeeklyClaimedHours: 44.0, avgAdjustedWeeklyWorkHours: 39.6 },
  { orgCode: 'C8-D3-T1', orgName: '물류기획팀', orgLevel: 'team', parentCode: 'C8-D3', headcount: 80, avgWorkEfficiency: 83.0, avgWeeklyClaimedHours: 43.8, avgAdjustedWeeklyWorkHours: 39.4 },
  { orgCode: 'C8-D3-T2', orgName: '물류시스템팀', orgLevel: 'team', parentCode: 'C8-D3', headcount: 80, avgWorkEfficiency: 82.4, avgWeeklyClaimedHours: 44.1, avgAdjustedWeeklyWorkHours: 39.7 },
  { orgCode: 'C8-D3-T3', orgName: '물류운영팀', orgLevel: 'team', parentCode: 'C8-D3', headcount: 80, avgWorkEfficiency: 82.7, avgWeeklyClaimedHours: 44.1, avgAdjustedWeeklyWorkHours: 39.7 },

  // ═══ 안전환경센터 (C9, 650명) ═══
  { orgCode: 'C9-D1', orgName: '안전담당', orgLevel: 'division', parentCode: 'C9', headcount: 220, avgWorkEfficiency: 84.8, avgWeeklyClaimedHours: 41.9, avgAdjustedWeeklyWorkHours: 38.0 },
  { orgCode: 'C9-D1-T1', orgName: '안전관리팀', orgLevel: 'team', parentCode: 'C9-D1', headcount: 75, avgWorkEfficiency: 85.0, avgWeeklyClaimedHours: 41.8, avgAdjustedWeeklyWorkHours: 37.9 },
  { orgCode: 'C9-D1-T2', orgName: '산업안전팀', orgLevel: 'team', parentCode: 'C9-D1', headcount: 75, avgWorkEfficiency: 84.6, avgWeeklyClaimedHours: 42.0, avgAdjustedWeeklyWorkHours: 38.1 },
  { orgCode: 'C9-D1-T3', orgName: '소방안전팀', orgLevel: 'team', parentCode: 'C9-D1', headcount: 70, avgWorkEfficiency: 84.8, avgWeeklyClaimedHours: 41.9, avgAdjustedWeeklyWorkHours: 38.0 },
  { orgCode: 'C9-D2', orgName: '환경담당', orgLevel: 'division', parentCode: 'C9', headcount: 220, avgWorkEfficiency: 84.3, avgWeeklyClaimedHours: 42.2, avgAdjustedWeeklyWorkHours: 38.3 },
  { orgCode: 'C9-D2-T1', orgName: '환경관리팀', orgLevel: 'team', parentCode: 'C9-D2', headcount: 75, avgWorkEfficiency: 84.5, avgWeeklyClaimedHours: 42.1, avgAdjustedWeeklyWorkHours: 38.2 },
  { orgCode: 'C9-D2-T2', orgName: '폐수처리팀', orgLevel: 'team', parentCode: 'C9-D2', headcount: 75, avgWorkEfficiency: 84.1, avgWeeklyClaimedHours: 42.3, avgAdjustedWeeklyWorkHours: 38.4 },
  { orgCode: 'C9-D2-T3', orgName: '대기관리팀', orgLevel: 'team', parentCode: 'C9-D2', headcount: 70, avgWorkEfficiency: 84.3, avgWeeklyClaimedHours: 42.2, avgAdjustedWeeklyWorkHours: 38.3 },
  { orgCode: 'C9-D3', orgName: '보건담당', orgLevel: 'division', parentCode: 'C9', headcount: 210, avgWorkEfficiency: 84.4, avgWeeklyClaimedHours: 42.2, avgAdjustedWeeklyWorkHours: 38.3 },
  { orgCode: 'C9-D3-T1', orgName: '보건관리팀', orgLevel: 'team', parentCode: 'C9-D3', headcount: 70, avgWorkEfficiency: 84.6, avgWeeklyClaimedHours: 42.1, avgAdjustedWeeklyWorkHours: 38.2 },
  { orgCode: 'C9-D3-T2', orgName: '산업보건팀', orgLevel: 'team', parentCode: 'C9-D3', headcount: 70, avgWorkEfficiency: 84.2, avgWeeklyClaimedHours: 42.3, avgAdjustedWeeklyWorkHours: 38.4 },
  { orgCode: 'C9-D3-T3', orgName: '건강관리팀', orgLevel: 'team', parentCode: 'C9-D3', headcount: 70, avgWorkEfficiency: 84.4, avgWeeklyClaimedHours: 42.2, avgAdjustedWeeklyWorkHours: 38.3 },

  // ═══ 경영지원센터 (C10, 820명) ═══
  { orgCode: 'C10-D1', orgName: '인사담당', orgLevel: 'division', parentCode: 'C10', headcount: 280, avgWorkEfficiency: 86.2, avgWeeklyClaimedHours: 41.6, avgAdjustedWeeklyWorkHours: 37.7 },
  { orgCode: 'C10-D1-T1', orgName: '인사기획팀', orgLevel: 'team', parentCode: 'C10-D1', headcount: 70, avgWorkEfficiency: 86.5, avgWeeklyClaimedHours: 41.4, avgAdjustedWeeklyWorkHours: 37.5 },
  { orgCode: 'C10-D1-T2', orgName: '채용팀', orgLevel: 'team', parentCode: 'C10-D1', headcount: 70, avgWorkEfficiency: 86.0, avgWeeklyClaimedHours: 41.7, avgAdjustedWeeklyWorkHours: 37.8 },
  { orgCode: 'C10-D1-T3', orgName: '교육훈련팀', orgLevel: 'team', parentCode: 'C10-D1', headcount: 70, avgWorkEfficiency: 86.2, avgWeeklyClaimedHours: 41.6, avgAdjustedWeeklyWorkHours: 37.7 },
  { orgCode: 'C10-D1-T4', orgName: '노무관리팀', orgLevel: 'team', parentCode: 'C10-D1', headcount: 70, avgWorkEfficiency: 86.1, avgWeeklyClaimedHours: 41.7, avgAdjustedWeeklyWorkHours: 37.8 },
  { orgCode: 'C10-D2', orgName: '재경담당', orgLevel: 'division', parentCode: 'C10', headcount: 270, avgWorkEfficiency: 86.0, avgWeeklyClaimedHours: 41.8, avgAdjustedWeeklyWorkHours: 37.9 },
  { orgCode: 'C10-D2-T1', orgName: '재무팀', orgLevel: 'team', parentCode: 'C10-D2', headcount: 68, avgWorkEfficiency: 86.3, avgWeeklyClaimedHours: 41.6, avgAdjustedWeeklyWorkHours: 37.7 },
  { orgCode: 'C10-D2-T2', orgName: '회계팀', orgLevel: 'team', parentCode: 'C10-D2', headcount: 68, avgWorkEfficiency: 85.8, avgWeeklyClaimedHours: 41.9, avgAdjustedWeeklyWorkHours: 38.0 },
  { orgCode: 'C10-D2-T3', orgName: '세무팀', orgLevel: 'team', parentCode: 'C10-D2', headcount: 67, avgWorkEfficiency: 86.0, avgWeeklyClaimedHours: 41.8, avgAdjustedWeeklyWorkHours: 37.9 },
  { orgCode: 'C10-D2-T4', orgName: '예산관리팀', orgLevel: 'team', parentCode: 'C10-D2', headcount: 67, avgWorkEfficiency: 85.9, avgWeeklyClaimedHours: 41.9, avgAdjustedWeeklyWorkHours: 38.0 },
  { orgCode: 'C10-D3', orgName: '총무담당', orgLevel: 'division', parentCode: 'C10', headcount: 270, avgWorkEfficiency: 85.8, avgWeeklyClaimedHours: 42.0, avgAdjustedWeeklyWorkHours: 38.1 },
  { orgCode: 'C10-D3-T1', orgName: '총무팀', orgLevel: 'team', parentCode: 'C10-D3', headcount: 68, avgWorkEfficiency: 86.0, avgWeeklyClaimedHours: 41.9, avgAdjustedWeeklyWorkHours: 38.0 },
  { orgCode: 'C10-D3-T2', orgName: '구매팀', orgLevel: 'team', parentCode: 'C10-D3', headcount: 68, avgWorkEfficiency: 85.6, avgWeeklyClaimedHours: 42.1, avgAdjustedWeeklyWorkHours: 38.2 },
  { orgCode: 'C10-D3-T3', orgName: 'IT팀', orgLevel: 'team', parentCode: 'C10-D3', headcount: 67, avgWorkEfficiency: 85.9, avgWeeklyClaimedHours: 42.0, avgAdjustedWeeklyWorkHours: 38.1 },
  { orgCode: 'C10-D3-T4', orgName: '법무팀', orgLevel: 'team', parentCode: 'C10-D3', headcount: 67, avgWorkEfficiency: 85.7, avgWeeklyClaimedHours: 42.0, avgAdjustedWeeklyWorkHours: 38.1 },
];

// ─── 헬퍼 함수 ──────────────────────────────────────────────────────────────

export function getChildrenOf(parentCode: string): OrgUnit[] {
  return orgUnits.filter((u) => u.parentCode === parentCode);
}

export function getOrgByCode(code: string): OrgUnit | undefined {
  return orgUnits.find((u) => u.orgCode === code);
}

export function getCenterByCode(code: string): CenterStats | undefined {
  return centers.find((c) => c.orgCode === code);
}

export function getAncestorPath(orgCode: string): OrgUnit[] {
  const path: OrgUnit[] = [];
  let current = getOrgByCode(orgCode);
  while (current) {
    path.unshift(current);
    current = getOrgByCode(current.parentCode);
  }
  return path;
}

// ─── 효율성 매트릭스 (Lv × Center) ────────────────────────────────────────────

const gradeMatrix: MatrixData = {
  grades: ['Lv.4', 'Lv.3', 'Lv.2', 'Lv.1'],
  centers: centers.map((c) => c.orgName),
  matrix: {
    'Lv.4': {
      '생산1센터': 78.4, '생산2센터': 74.2, '생산3센터': 77.1, '기술센터': 81.6, '품질센터': 80.1,
      'R&D센터': 84.3, '설비센터': 77.5, '물류센터': 79.8, '안전환경센터': 82.0, '경영지원센터': 83.5,
    },
    'Lv.3': {
      '생산1센터': 83.1, '생산2센터': 80.5, '생산3센터': 82.0, '기술센터': 86.4, '품질센터': 84.8,
      'R&D센터': 88.7, '설비센터': 81.5, '물류센터': 83.8, '안전환경센터': 85.2, '경영지원센터': 86.8,
    },
    'Lv.2': {
      '생산1센터': 84.7, '생산2센터': 82.1, '생산3센터': 83.5, '기술센터': 87.2, '품질센터': 85.5,
      'R&D센터': 89.1, '설비센터': 82.8, '물류센터': 84.5, '안전환경센터': 86.3, '경영지원센터': 87.5,
    },
    'Lv.1': {
      '생산1센터': 80.9, '생산2센터': 78.3, '생산3센터': 79.8, '기술센터': 83.8, '품질센터': 82.4,
      'R&D센터': 85.6, '설비센터': 79.5, '물류센터': 81.2, '안전환경센터': 83.1, '경영지원센터': 84.8,
    },
  },
};

// ─── 주간 근태시간 매트릭스 ────────────────────────────────────────────────────

const weeklyClaimedHoursMatrix: MatrixData = {
  grades: ['Lv.4', 'Lv.3', 'Lv.2', 'Lv.1'],
  centers: centers.map((c) => c.orgName),
  matrix: {
    'Lv.4': {
      '생산1센터': 46.8, '생산2센터': 48.5, '생산3센터': 47.2, '기술센터': 44.1, '품질센터': 45.2,
      'R&D센터': 43.0, '설비센터': 47.5, '물류센터': 45.5, '안전환경센터': 43.5, '경영지원센터': 43.2,
    },
    'Lv.3': {
      '생산1센터': 44.5, '생산2센터': 46.8, '생산3센터': 45.2, '기술센터': 42.9, '품질센터': 43.8,
      'R&D센터': 41.8, '설비센터': 45.8, '물류센터': 44.1, '안전환경센터': 42.3, '경영지원센터': 42.0,
    },
    'Lv.2': {
      '생산1센터': 43.2, '생산2센터': 45.1, '생산3센터': 44.0, '기술센터': 42.4, '품질센터': 42.8,
      'R&D센터': 41.2, '설비센터': 44.5, '물류센터': 43.5, '안전환경센터': 41.5, '경영지원센터': 41.2,
    },
    'Lv.1': {
      '생산1센터': 43.8, '생산2센터': 45.7, '생산3센터': 44.5, '기술센터': 42.6, '품질센터': 43.1,
      'R&D센터': 41.5, '설비센터': 45.0, '물류센터': 43.8, '안전환경센터': 41.8, '경영지원센터': 41.5,
    },
  },
};

// ─── 주간 근무추정시간 매트릭스 (AI 보정) ──────────────────────────────────────

const adjustedWeeklyWorkHoursMatrix: MatrixData = {
  grades: ['Lv.4', 'Lv.3', 'Lv.2', 'Lv.1'],
  centers: centers.map((c) => c.orgName),
  matrix: {
    'Lv.4': {
      '생산1센터': 42.1, '생산2센터': 43.8, '생산3센터': 42.5, '기술센터': 39.5, '품질센터': 40.6,
      'R&D센터': 38.9, '설비센터': 42.8, '물류센터': 41.0, '안전환경센터': 39.2, '경영지원센터': 38.8,
    },
    'Lv.3': {
      '생산1센터': 40.2, '생산2센터': 41.9, '생산3센터': 40.8, '기술센터': 38.7, '품질센터': 39.4,
      'R&D센터': 37.8, '설비센터': 41.2, '물류센터': 39.6, '안전환경센터': 38.3, '경영지원센터': 37.8,
    },
    'Lv.2': {
      '생산1센터': 39.0, '생산2센터': 40.5, '생산3센터': 39.5, '기술센터': 38.1, '품질센터': 38.6,
      'R&D센터': 37.2, '설비센터': 40.0, '물류센터': 39.1, '안전환경센터': 37.8, '경영지원센터': 37.2,
    },
    'Lv.1': {
      '생산1센터': 39.5, '생산2센터': 41.0, '생산3센터': 40.0, '기술센터': 38.4, '품질센터': 39.0,
      'R&D센터': 37.5, '설비센터': 40.5, '물류센터': 39.4, '안전환경센터': 38.0, '경영지원센터': 37.5,
    },
  },
};

// ─── 임계값 정보 ──────────────────────────────────────────────────────────────

const thresholds = {
  efficiency: {
    low: '<80%',
    middle: '80~86%',
    high: '≥86%',
    thresholds: { low: 80.0, high: 86.0 },
  },
  weeklyClaimedHours: {
    low: '<42.5h',
    middle: '42.5~45.5h',
    high: '≥45.5h',
    thresholds: { low: 42.5, high: 45.5 },
  },
  adjustedWeeklyWorkHours: {
    low: '<38.5h',
    middle: '38.5~41.0h',
    high: '≥41.0h',
    thresholds: { low: 38.5, high: 41.0 },
  },
};

// ─── 전체 가중평균 ────────────────────────────────────────────────────────────

const totalEmployees = centers.reduce((sum, c) => sum + c.headcount, 0);
const totalHC = totalEmployees;
const avgEfficiency = Math.round(
  centers.reduce((sum, c) => sum + c.avgWorkEfficiency * c.headcount, 0) / totalHC * 10
) / 10;
const avgWeeklyClaimedHours = Math.round(
  centers.reduce((sum, c) => sum + c.avgWeeklyClaimedHours * c.headcount, 0) / totalHC * 10
) / 10;
const avgAdjustedWeeklyWorkHours = Math.round(
  centers.reduce((sum, c) => sum + c.avgAdjustedWeeklyWorkHours * c.headcount, 0) / totalHC * 10
) / 10;

// ─── Export ───────────────────────────────────────────────────────────────────

export const dashboardData: DashboardData = {
  totalEmployees,
  centers,
  avgEfficiency,
  avgWeeklyClaimedHours,
  avgAdjustedWeeklyWorkHours,
  gradeMatrix,
  weeklyClaimedHoursMatrix,
  adjustedWeeklyWorkHoursMatrix,
  thresholds,
};

// ─── 월별 변동 데이터 생성 ──────────────────────────────────────────────────

// 결정론적 의사난수 (seed 기반)
function seededRandom(seed: number): number {
  const s = ((seed * 1103515245 + 12345) & 0x7fffffff);
  return (s % 10000) / 10000;
}

// 월별 변동 계수 (±3% 범위 내 변동)
function getMonthlyVariation(baseValue: number, month: number, seed: number): number {
  const r = seededRandom(month * 1000 + seed);
  const variation = (r - 0.5) * 0.06; // ±3%
  return Math.round((baseValue * (1 + variation)) * 10) / 10;
}

/**
 * 월별 대시보드 데이터 반환
 * month: 1~12
 */
export function getMonthlyDashboardData(month: number): DashboardData {
  const monthlyCenters: CenterStats[] = centers.map((c, ci) => ({
    ...c,
    avgWorkEfficiency: getMonthlyVariation(c.avgWorkEfficiency, month, ci * 100 + 1),
    avgWeeklyClaimedHours: getMonthlyVariation(c.avgWeeklyClaimedHours, month, ci * 100 + 2),
    avgAdjustedWeeklyWorkHours: getMonthlyVariation(c.avgAdjustedWeeklyWorkHours, month, ci * 100 + 3),
  }));

  // 월별 매트릭스 생성
  const applyMonthlyMatrix = (base: MatrixData, seedOffset: number): MatrixData => {
    const newMatrix: Record<string, Record<string, number>> = {};
    let si = 0;
    for (const grade of base.grades) {
      newMatrix[grade] = {};
      for (const center of base.centers) {
        const baseVal = base.matrix[grade]?.[center];
        if (baseVal !== undefined) {
          newMatrix[grade][center] = getMonthlyVariation(baseVal, month, seedOffset + si);
          si++;
        }
      }
    }
    return { grades: base.grades, centers: base.centers, matrix: newMatrix };
  };

  const mGrade = applyMonthlyMatrix(gradeMatrix, 1000);
  const mClaimed = applyMonthlyMatrix(weeklyClaimedHoursMatrix, 2000);
  const mAdjusted = applyMonthlyMatrix(adjustedWeeklyWorkHoursMatrix, 3000);

  const mTotalHC = monthlyCenters.reduce((s, c) => s + c.headcount, 0);
  const mAvgEff = Math.round(
    monthlyCenters.reduce((s, c) => s + c.avgWorkEfficiency * c.headcount, 0) / mTotalHC * 10
  ) / 10;
  const mAvgClaimed = Math.round(
    monthlyCenters.reduce((s, c) => s + c.avgWeeklyClaimedHours * c.headcount, 0) / mTotalHC * 10
  ) / 10;
  const mAvgAdj = Math.round(
    monthlyCenters.reduce((s, c) => s + c.avgAdjustedWeeklyWorkHours * c.headcount, 0) / mTotalHC * 10
  ) / 10;

  return {
    totalEmployees,
    centers: monthlyCenters,
    avgEfficiency: mAvgEff,
    avgWeeklyClaimedHours: mAvgClaimed,
    avgAdjustedWeeklyWorkHours: mAvgAdj,
    gradeMatrix: mGrade,
    weeklyClaimedHoursMatrix: mClaimed,
    adjustedWeeklyWorkHoursMatrix: mAdjusted,
    thresholds,
  };
}
