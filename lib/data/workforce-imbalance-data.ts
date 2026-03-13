/**
 * 익명화된 제조업체 근무 불균형 데이터
 * 전체 대상자: ~10,517명
 * AI Insights 3건 + 상위 24개 불균형 팀 데이터
 *
 * 변동계수(CV%) = (표준편차 / 평균) × 100
 * CV가 높을수록 팀 내 근무시간 편차가 심함
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type AlertSeverity = 'critical' | 'high' | 'medium';

export interface AIInsight {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedCount: number;
  unit: string;
  recommendation: string;
}

export interface ImbalancedTeam {
  rank: number;
  teamCode: string;
  teamName: string;
  centerName: string;
  cvPercent: number;
  headcount: number;
  weeklyHours: number;
}

// ─── AI Insights (3건) ──────────────────────────────────────────────────────

export const aiInsights: AIInsight[] = [
  {
    id: 'burnout-risk',
    severity: 'critical',
    title: '번아웃 위험군 감지',
    description: '주 52시간 초과 근무자가 다수 발견되었습니다. 장시간 근로로 인한 건강 위험과 법적 리스크가 존재합니다.',
    affectedCount: 1970,
    unit: '명',
    recommendation: '즉시 초과근무 제한 조치 및 업무 재분배가 필요합니다.',
  },
  {
    id: 'team-imbalance',
    severity: 'high',
    title: '팀 내 근무 불균형',
    description: '변동계수(CV) 50% 이상인 팀에서 심각한 근무시간 편차가 발생하고 있습니다.',
    affectedCount: 75,
    unit: '개팀',
    recommendation: '팀 내 업무 분배 재조정 및 인력 재배치를 권고합니다.',
  },
  {
    id: 'underutilized',
    severity: 'medium',
    title: '저활용 인력 발견',
    description: '일평균 6시간 미만 근무자가 발견되었습니다. 업무 할당 부족 또는 역할 불일치가 의심됩니다.',
    affectedCount: 490,
    unit: '명',
    recommendation: '역할 재정의 및 스킬 매칭 기반 업무 재배치를 검토하세요.',
  },
];

// ─── 상위 24개 불균형 팀 ────────────────────────────────────────────────────

export const imbalancedTeams: ImbalancedTeam[] = [
  { rank: 1,  teamCode: 'T-001', teamName: '품질검사1팀',   centerName: '품질센터',     cvPercent: 66.2, headcount: 42,  weeklyHours: 38.5 },
  { rank: 2,  teamCode: 'T-002', teamName: '공정개발Lab',   centerName: '기술센터',     cvPercent: 64.8, headcount: 18,  weeklyHours: 41.2 },
  { rank: 3,  teamCode: 'T-003', teamName: '설비운영팀',    centerName: '설비센터',     cvPercent: 63.5, headcount: 87,  weeklyHours: 39.7 },
  { rank: 4,  teamCode: 'T-004', teamName: '생산1팀',       centerName: '생산1센터',    cvPercent: 62.1, headcount: 164, weeklyHours: 40.8 },
  { rank: 5,  teamCode: 'T-005', teamName: '구매관리팀',    centerName: '경영지원센터', cvPercent: 61.4, headcount: 28,  weeklyHours: 37.3 },
  { rank: 6,  teamCode: 'T-006', teamName: '시스템운영팀',  centerName: '경영지원센터', cvPercent: 60.7, headcount: 35,  weeklyHours: 36.9 },
  { rank: 7,  teamCode: 'T-007', teamName: 'MES관리팀',     centerName: '기술센터',     cvPercent: 59.3, headcount: 22,  weeklyHours: 38.1 },
  { rank: 8,  teamCode: 'T-008', teamName: '안전관리팀',    centerName: '안전환경센터', cvPercent: 58.9, headcount: 75,  weeklyHours: 37.9 },
  { rank: 9,  teamCode: 'T-009', teamName: '도장2팀',       centerName: '생산2센터',    cvPercent: 58.1, headcount: 160, weeklyHours: 42.1 },
  { rank: 10, teamCode: 'T-010', teamName: '프레스1팀',     centerName: '생산2센터',    cvPercent: 57.6, headcount: 157, weeklyHours: 40.8 },
  { rank: 11, teamCode: 'T-011', teamName: '엔진2팀',       centerName: '생산3센터',    cvPercent: 57.0, headcount: 130, weeklyHours: 40.0 },
  { rank: 12, teamCode: 'T-012', teamName: '물류기획팀',    centerName: '물류센터',     cvPercent: 56.4, headcount: 80,  weeklyHours: 39.4 },
  { rank: 13, teamCode: 'T-013', teamName: '용접1팀',       centerName: '생산2센터',    cvPercent: 55.8, headcount: 160, weeklyHours: 41.1 },
  { rank: 14, teamCode: 'T-014', teamName: '자재관리팀',    centerName: '생산1센터',    cvPercent: 55.2, headcount: 195, weeklyHours: 40.2 },
  { rank: 15, teamCode: 'T-015', teamName: '설비보전2팀',   centerName: '설비센터',     cvPercent: 54.7, headcount: 87,  weeklyHours: 40.6 },
  { rank: 16, teamCode: 'T-016', teamName: '환경관리팀',    centerName: '안전환경센터', cvPercent: 54.1, headcount: 75,  weeklyHours: 38.2 },
  { rank: 17, teamCode: 'T-017', teamName: '변속기1팀',     centerName: '생산3센터',    cvPercent: 53.5, headcount: 127, weeklyHours: 40.1 },
  { rank: 18, teamCode: 'T-018', teamName: '출하물류2팀',   centerName: '물류센터',     cvPercent: 52.9, headcount: 80,  weeklyHours: 39.7 },
  { rank: 19, teamCode: 'T-019', teamName: '조립3팀',       centerName: '생산1센터',    cvPercent: 52.3, headcount: 180, weeklyHours: 40.2 },
  { rank: 20, teamCode: 'T-020', teamName: '품질보증2팀',   centerName: '품질센터',     cvPercent: 51.7, headcount: 105, weeklyHours: 39.0 },
  { rank: 21, teamCode: 'T-021', teamName: '자동화2팀',     centerName: '설비센터',     cvPercent: 51.0, headcount: 87,  weeklyHours: 40.9 },
  { rank: 22, teamCode: 'T-022', teamName: '부품2팀',       centerName: '생산3센터',    cvPercent: 50.4, headcount: 127, weeklyHours: 40.5 },
  { rank: 23, teamCode: 'T-023', teamName: '협력품질1팀',   centerName: '품질센터',     cvPercent: 49.8, headcount: 100, weeklyHours: 39.0 },
  { rank: 24, teamCode: 'T-024', teamName: '입고물류3팀',   centerName: '물류센터',     cvPercent: 49.2, headcount: 80,  weeklyHours: 39.4 },
];

// ─── 헬퍼 함수 ──────────────────────────────────────────────────────────────

export function getTeamsByRankRange(startRank: number, endRank: number): ImbalancedTeam[] {
  return imbalancedTeams.filter((t) => t.rank >= startRank && t.rank <= endRank);
}

export function getRankColor(rank: number): 'red' | 'yellow' | 'green' {
  if (rank <= 6) return 'red';
  if (rank <= 18) return 'yellow';
  return 'green';
}

export function getCVColor(cvPercent: number): 'red' | 'yellow' | 'green' {
  if (cvPercent > 55) return 'red';
  if (cvPercent >= 50) return 'yellow';
  return 'green';
}
