/**
 * 근무 패턴 분석 정적 데이터 (익명화)
 * 원시 태그 데이터 2,000만건 기반 팀 단위 요약 통계
 * 5개 클러스터 유형 × ~60개 팀
 */

// ─── 타입 정의 ─────────────────────────────────────────────────────────────────

export interface RawDataStats {
  total_tag_records: number;
  monthly_tag_records: number;
  total_equipment_records: number;
  total_knox_records: number;
  tag_location_types: number;
}

export interface TagSummary {
  total_o_tags: number;
  total_knox: number;
  total_t1: number;
  total_g3: number;
  total_teams: number;
  total_employees: number;
  avg_o_per_person: number;
  avg_knox_per_person: number;
  avg_t1_per_person: number;
  avg_g3_per_person: number;
}

export type ClusterType =
  | '시스템운영집중형'
  | '현장이동활발형'
  | '디지털협업중심형'
  | '저활동형'
  | '균형업무형';

export interface PatternData {
  center: string;
  bu: string;
  team: string;
  employee_count: number;
  equipment_per_person: number;
  movement_per_person: number;
  cluster_type: ClusterType;
  knox_per_person: number;
  meeting_per_person: number;
  reliability_score: number;
  correction_factor: number;
}

export interface ClusterStats {
  cluster_name: ClusterType;
  team_count: number;
  total_employees: number;
  avg_knox_per_person: number;
  avg_equipment_per_person: number;
  avg_movement_per_person: number;
  avg_meeting_per_person: number;
  avg_reliability: number;
  avg_correction_factor: number;
}

// ─── 클러스터 색상 ──────────────────────────────────────────────────────────────

export const CLUSTER_COLORS: Record<string, string> = {
  '시스템운영집중형': '#1f77b4',
  '현장이동활발형': '#ff7f0e',
  '디지털협업중심형': '#2ca02c',
  '저활동형': '#8c564b',
  '균형업무형': '#d62728',
};

// ─── 원시 데이터 규모 ───────────────────────────────────────────────────────────

export const rawDataStats: RawDataStats = {
  total_tag_records: 20080148,
  monthly_tag_records: 1673345,
  total_equipment_records: 660362,
  total_knox_records: 257781,
  tag_location_types: 47,
};

// ─── 태그 요약 ──────────────────────────────────────────────────────────────────

export const tagSummary: TagSummary = {
  total_o_tags: 20080148,
  total_knox: 2340000,
  total_t1: 18200000,
  total_g3: 430000,
  total_teams: 73,
  total_employees: 10517,
  avg_o_per_person: 100.9,
  avg_knox_per_person: 74.5,
  avg_t1_per_person: 99.6,
  avg_g3_per_person: 1.2,
};

// ─── 센터 목록 (익명화) ─────────────────────────────────────────────────────────

const CENTERS = [
  '생산1센터', '생산2센터', '생산3센터', '기술센터', '품질센터',
  'R&D센터', '설비센터', '물류센터', '안전환경센터', '경영지원센터',
] as const;

// ─── 팀별 패턴 데이터 (~60팀) ──────────────────────────────────────────────────

export const patternData: PatternData[] = [
  // ═══ 생산1센터 (7팀) ═══
  { center: '생산1센터', bu: '생산1담당', team: '생산1-A팀', employee_count: 185, equipment_per_person: 520, movement_per_person: 180, cluster_type: '현장이동활발형', knox_per_person: 45, meeting_per_person: 12, reliability_score: 0.72, correction_factor: 1.08 },
  { center: '생산1센터', bu: '생산1담당', team: '생산1-B팀', employee_count: 165, equipment_per_person: 480, movement_per_person: 195, cluster_type: '현장이동활발형', knox_per_person: 52, meeting_per_person: 15, reliability_score: 0.68, correction_factor: 1.12 },
  { center: '생산1센터', bu: '생산2담당', team: '생산1-C팀', employee_count: 142, equipment_per_person: 390, movement_per_person: 145, cluster_type: '균형업무형', knox_per_person: 120, meeting_per_person: 28, reliability_score: 0.81, correction_factor: 0.98 },
  { center: '생산1센터', bu: '생산2담당', team: '생산1-D팀', employee_count: 198, equipment_per_person: 545, movement_per_person: 210, cluster_type: '현장이동활발형', knox_per_person: 38, meeting_per_person: 10, reliability_score: 0.65, correction_factor: 1.15 },
  { center: '생산1센터', bu: '공정관리담당', team: '공정관리1팀', employee_count: 88, equipment_per_person: 410, movement_per_person: 85, cluster_type: '시스템운영집중형', knox_per_person: 280, meeting_per_person: 42, reliability_score: 0.89, correction_factor: 0.92 },
  { center: '생산1센터', bu: '공정관리담당', team: '공정관리2팀', employee_count: 72, equipment_per_person: 450, movement_per_person: 78, cluster_type: '시스템운영집중형', knox_per_person: 310, meeting_per_person: 48, reliability_score: 0.91, correction_factor: 0.90 },
  { center: '생산1센터', bu: '생산지원담당', team: '생산지원팀', employee_count: 55, equipment_per_person: 180, movement_per_person: 62, cluster_type: '디지털협업중심형', knox_per_person: 350, meeting_per_person: 65, reliability_score: 0.88, correction_factor: 0.95 },

  // ═══ 생산2센터 (7팀) ═══
  { center: '생산2센터', bu: '생산3담당', team: '생산2-A팀', employee_count: 175, equipment_per_person: 510, movement_per_person: 188, cluster_type: '현장이동활발형', knox_per_person: 48, meeting_per_person: 14, reliability_score: 0.70, correction_factor: 1.10 },
  { center: '생산2센터', bu: '생산3담당', team: '생산2-B팀', employee_count: 155, equipment_per_person: 470, movement_per_person: 175, cluster_type: '현장이동활발형', knox_per_person: 55, meeting_per_person: 16, reliability_score: 0.71, correction_factor: 1.09 },
  { center: '생산2센터', bu: '생산4담당', team: '생산2-C팀', employee_count: 130, equipment_per_person: 350, movement_per_person: 130, cluster_type: '균형업무형', knox_per_person: 135, meeting_per_person: 32, reliability_score: 0.79, correction_factor: 1.00 },
  { center: '생산2센터', bu: '생산4담당', team: '생산2-D팀', employee_count: 145, equipment_per_person: 490, movement_per_person: 200, cluster_type: '현장이동활발형', knox_per_person: 42, meeting_per_person: 11, reliability_score: 0.67, correction_factor: 1.13 },
  { center: '생산2센터', bu: '공정기술담당', team: '공정기술1팀', employee_count: 65, equipment_per_person: 380, movement_per_person: 72, cluster_type: '시스템운영집중형', knox_per_person: 295, meeting_per_person: 45, reliability_score: 0.90, correction_factor: 0.91 },
  { center: '생산2센터', bu: '공정기술담당', team: '공정기술2팀', employee_count: 58, equipment_per_person: 420, movement_per_person: 80, cluster_type: '시스템운영집중형', knox_per_person: 270, meeting_per_person: 40, reliability_score: 0.87, correction_factor: 0.93 },
  { center: '생산2센터', bu: '생산기획담당', team: '생산기획팀', employee_count: 42, equipment_per_person: 160, movement_per_person: 55, cluster_type: '디지털협업중심형', knox_per_person: 370, meeting_per_person: 72, reliability_score: 0.92, correction_factor: 0.88 },

  // ═══ 생산3센터 (6팀) ═══
  { center: '생산3센터', bu: '생산5담당', team: '생산3-A팀', employee_count: 168, equipment_per_person: 535, movement_per_person: 192, cluster_type: '현장이동활발형', knox_per_person: 40, meeting_per_person: 13, reliability_score: 0.69, correction_factor: 1.11 },
  { center: '생산3센터', bu: '생산5담당', team: '생산3-B팀', employee_count: 152, equipment_per_person: 460, movement_per_person: 170, cluster_type: '현장이동활발형', knox_per_person: 58, meeting_per_person: 18, reliability_score: 0.73, correction_factor: 1.07 },
  { center: '생산3센터', bu: '생산6담당', team: '생산3-C팀', employee_count: 120, equipment_per_person: 340, movement_per_person: 125, cluster_type: '균형업무형', knox_per_person: 145, meeting_per_person: 35, reliability_score: 0.82, correction_factor: 0.97 },
  { center: '생산3센터', bu: '생산6담당', team: '생산3-D팀', employee_count: 95, equipment_per_person: 130, movement_per_person: 42, cluster_type: '저활동형', knox_per_person: 22, meeting_per_person: 8, reliability_score: 0.55, correction_factor: 1.18 },
  { center: '생산3센터', bu: '공정혁신담당', team: '공정혁신팀', employee_count: 48, equipment_per_person: 370, movement_per_person: 68, cluster_type: '시스템운영집중형', knox_per_person: 260, meeting_per_person: 38, reliability_score: 0.86, correction_factor: 0.94 },
  { center: '생산3센터', bu: '품질검사담당', team: '품질검사팀', employee_count: 62, equipment_per_person: 290, movement_per_person: 110, cluster_type: '균형업무형', knox_per_person: 155, meeting_per_person: 30, reliability_score: 0.80, correction_factor: 0.99 },

  // ═══ 기술센터 (7팀) ═══
  { center: '기술센터', bu: '기술1담당', team: '기술1팀', employee_count: 78, equipment_per_person: 440, movement_per_person: 75, cluster_type: '시스템운영집중형', knox_per_person: 320, meeting_per_person: 50, reliability_score: 0.92, correction_factor: 0.89 },
  { center: '기술센터', bu: '기술1담당', team: '기술2팀', employee_count: 82, equipment_per_person: 460, movement_per_person: 82, cluster_type: '시스템운영집중형', knox_per_person: 305, meeting_per_person: 46, reliability_score: 0.90, correction_factor: 0.91 },
  { center: '기술센터', bu: '기술2담당', team: '기술3팀', employee_count: 68, equipment_per_person: 400, movement_per_person: 70, cluster_type: '시스템운영집중형', knox_per_person: 290, meeting_per_person: 44, reliability_score: 0.88, correction_factor: 0.93 },
  { center: '기술센터', bu: '기술2담당', team: '기술4팀', employee_count: 55, equipment_per_person: 150, movement_per_person: 50, cluster_type: '디지털협업중심형', knox_per_person: 380, meeting_per_person: 68, reliability_score: 0.93, correction_factor: 0.87 },
  { center: '기술센터', bu: '기술기획담당', team: '기술기획팀', employee_count: 38, equipment_per_person: 120, movement_per_person: 45, cluster_type: '디지털협업중심형', knox_per_person: 395, meeting_per_person: 75, reliability_score: 0.94, correction_factor: 0.85 },
  { center: '기술센터', bu: '설계담당', team: '설계1팀', employee_count: 92, equipment_per_person: 320, movement_per_person: 58, cluster_type: '시스템운영집중형', knox_per_person: 275, meeting_per_person: 36, reliability_score: 0.85, correction_factor: 0.95 },
  { center: '기술센터', bu: '설계담당', team: '설계2팀', employee_count: 85, equipment_per_person: 310, movement_per_person: 55, cluster_type: '시스템운영집중형', knox_per_person: 265, meeting_per_person: 34, reliability_score: 0.84, correction_factor: 0.96 },

  // ═══ 품질센터 (6팀) ═══
  { center: '품질센터', bu: '품질1담당', team: '품질1팀', employee_count: 110, equipment_per_person: 380, movement_per_person: 135, cluster_type: '균형업무형', knox_per_person: 160, meeting_per_person: 33, reliability_score: 0.83, correction_factor: 0.97 },
  { center: '품질센터', bu: '품질1담당', team: '품질2팀', employee_count: 95, equipment_per_person: 350, movement_per_person: 128, cluster_type: '균형업무형', knox_per_person: 150, meeting_per_person: 30, reliability_score: 0.81, correction_factor: 0.98 },
  { center: '품질센터', bu: '품질2담당', team: '품질3팀', employee_count: 88, equipment_per_person: 420, movement_per_person: 90, cluster_type: '시스템운영집중형', knox_per_person: 245, meeting_per_person: 38, reliability_score: 0.86, correction_factor: 0.94 },
  { center: '품질센터', bu: '품질2담당', team: '품질4팀', employee_count: 75, equipment_per_person: 115, movement_per_person: 38, cluster_type: '저활동형', knox_per_person: 18, meeting_per_person: 6, reliability_score: 0.52, correction_factor: 1.20 },
  { center: '품질센터', bu: '품질혁신담당', team: '품질혁신팀', employee_count: 45, equipment_per_person: 170, movement_per_person: 58, cluster_type: '디지털협업중심형', knox_per_person: 360, meeting_per_person: 70, reliability_score: 0.91, correction_factor: 0.89 },
  { center: '품질센터', bu: '인증담당', team: '인증팀', employee_count: 52, equipment_per_person: 200, movement_per_person: 65, cluster_type: '디지털협업중심형', knox_per_person: 340, meeting_per_person: 62, reliability_score: 0.89, correction_factor: 0.91 },

  // ═══ R&D센터 (6팀) ═══
  { center: 'R&D센터', bu: '연구1담당', team: '연구1팀', employee_count: 72, equipment_per_person: 140, movement_per_person: 48, cluster_type: '디지털협업중심형', knox_per_person: 385, meeting_per_person: 72, reliability_score: 0.93, correction_factor: 0.86 },
  { center: 'R&D센터', bu: '연구1담당', team: '연구2팀', employee_count: 65, equipment_per_person: 155, movement_per_person: 52, cluster_type: '디지털협업중심형', knox_per_person: 375, meeting_per_person: 68, reliability_score: 0.92, correction_factor: 0.87 },
  { center: 'R&D센터', bu: '연구2담당', team: '연구3팀', employee_count: 58, equipment_per_person: 130, movement_per_person: 42, cluster_type: '디지털협업중심형', knox_per_person: 390, meeting_per_person: 76, reliability_score: 0.95, correction_factor: 0.84 },
  { center: 'R&D센터', bu: '연구2담당', team: '연구4팀', employee_count: 48, equipment_per_person: 100, movement_per_person: 35, cluster_type: '저활동형', knox_per_person: 15, meeting_per_person: 5, reliability_score: 0.50, correction_factor: 1.20 },
  { center: 'R&D센터', bu: '개발담당', team: '개발1팀', employee_count: 85, equipment_per_person: 280, movement_per_person: 60, cluster_type: '시스템운영집중형', knox_per_person: 250, meeting_per_person: 35, reliability_score: 0.84, correction_factor: 0.96 },
  { center: 'R&D센터', bu: '개발담당', team: '개발2팀', employee_count: 78, equipment_per_person: 300, movement_per_person: 65, cluster_type: '시스템운영집중형', knox_per_person: 240, meeting_per_person: 32, reliability_score: 0.83, correction_factor: 0.97 },

  // ═══ 설비센터 (6팀) ═══
  { center: '설비센터', bu: '설비1담당', team: '설비1팀', employee_count: 125, equipment_per_person: 580, movement_per_person: 220, cluster_type: '현장이동활발형', knox_per_person: 35, meeting_per_person: 9, reliability_score: 0.63, correction_factor: 1.16 },
  { center: '설비센터', bu: '설비1담당', team: '설비2팀', employee_count: 110, equipment_per_person: 550, movement_per_person: 205, cluster_type: '현장이동활발형', knox_per_person: 40, meeting_per_person: 11, reliability_score: 0.66, correction_factor: 1.14 },
  { center: '설비센터', bu: '설비2담당', team: '설비3팀', employee_count: 95, equipment_per_person: 500, movement_per_person: 185, cluster_type: '현장이동활발형', knox_per_person: 50, meeting_per_person: 14, reliability_score: 0.70, correction_factor: 1.10 },
  { center: '설비센터', bu: '설비기술담당', team: '설비기술팀', employee_count: 68, equipment_per_person: 430, movement_per_person: 88, cluster_type: '시스템운영집중형', knox_per_person: 255, meeting_per_person: 37, reliability_score: 0.85, correction_factor: 0.95 },
  { center: '설비센터', bu: '자동화담당', team: '자동화팀', employee_count: 52, equipment_per_person: 190, movement_per_person: 60, cluster_type: '디지털협업중심형', knox_per_person: 345, meeting_per_person: 64, reliability_score: 0.90, correction_factor: 0.90 },
  { center: '설비센터', bu: '보전담당', team: '보전팀', employee_count: 85, equipment_per_person: 120, movement_per_person: 40, cluster_type: '저활동형', knox_per_person: 20, meeting_per_person: 7, reliability_score: 0.53, correction_factor: 1.19 },

  // ═══ 물류센터 (5팀) ═══
  { center: '물류센터', bu: '물류1담당', team: '물류1팀', employee_count: 135, equipment_per_person: 360, movement_per_person: 160, cluster_type: '균형업무형', knox_per_person: 140, meeting_per_person: 28, reliability_score: 0.78, correction_factor: 1.01 },
  { center: '물류센터', bu: '물류1담당', team: '물류2팀', employee_count: 120, equipment_per_person: 330, movement_per_person: 148, cluster_type: '균형업무형', knox_per_person: 130, meeting_per_person: 25, reliability_score: 0.77, correction_factor: 1.02 },
  { center: '물류센터', bu: '물류2담당', team: '물류3팀', employee_count: 105, equipment_per_person: 470, movement_per_person: 178, cluster_type: '현장이동활발형', knox_per_person: 46, meeting_per_person: 13, reliability_score: 0.69, correction_factor: 1.11 },
  { center: '물류센터', bu: '물류기획담당', team: '물류기획팀', employee_count: 35, equipment_per_person: 145, movement_per_person: 48, cluster_type: '디지털협업중심형', knox_per_person: 365, meeting_per_person: 70, reliability_score: 0.92, correction_factor: 0.88 },
  { center: '물류센터', bu: '물류기획담당', team: '물류분석팀', employee_count: 28, equipment_per_person: 105, movement_per_person: 32, cluster_type: '저활동형', knox_per_person: 16, meeting_per_person: 6, reliability_score: 0.51, correction_factor: 1.19 },

  // ═══ 안전환경센터 (5팀) ═══
  { center: '안전환경센터', bu: '안전담당', team: '안전1팀', employee_count: 92, equipment_per_person: 310, movement_per_person: 155, cluster_type: '균형업무형', knox_per_person: 165, meeting_per_person: 35, reliability_score: 0.82, correction_factor: 0.97 },
  { center: '안전환경센터', bu: '안전담당', team: '안전2팀', employee_count: 78, equipment_per_person: 280, movement_per_person: 140, cluster_type: '균형업무형', knox_per_person: 148, meeting_per_person: 30, reliability_score: 0.80, correction_factor: 0.99 },
  { center: '안전환경센터', bu: '환경담당', team: '환경관리팀', employee_count: 65, equipment_per_person: 250, movement_per_person: 120, cluster_type: '균형업무형', knox_per_person: 170, meeting_per_person: 38, reliability_score: 0.83, correction_factor: 0.96 },
  { center: '안전환경센터', bu: '환경담당', team: '환경분석팀', employee_count: 42, equipment_per_person: 195, movement_per_person: 55, cluster_type: '디지털협업중심형', knox_per_person: 355, meeting_per_person: 66, reliability_score: 0.91, correction_factor: 0.89 },
  { center: '안전환경센터', bu: '방재담당', team: '방재팀', employee_count: 55, equipment_per_person: 90, movement_per_person: 30, cluster_type: '저활동형', knox_per_person: 14, meeting_per_person: 5, reliability_score: 0.50, correction_factor: 1.20 },

  // ═══ 경영지원센터 (5팀) ═══
  { center: '경영지원센터', bu: '경영기획담당', team: '경영기획팀', employee_count: 45, equipment_per_person: 135, movement_per_person: 42, cluster_type: '디지털협업중심형', knox_per_person: 400, meeting_per_person: 80, reliability_score: 0.95, correction_factor: 0.83 },
  { center: '경영지원센터', bu: '경영기획담당', team: '전략기획팀', employee_count: 38, equipment_per_person: 125, movement_per_person: 40, cluster_type: '디지털협업중심형', knox_per_person: 390, meeting_per_person: 78, reliability_score: 0.94, correction_factor: 0.84 },
  { center: '경영지원센터', bu: '인사담당', team: '인사팀', employee_count: 52, equipment_per_person: 160, movement_per_person: 50, cluster_type: '디지털협업중심형', knox_per_person: 378, meeting_per_person: 74, reliability_score: 0.93, correction_factor: 0.86 },
  { center: '경영지원센터', bu: '재무담당', team: '재무팀', employee_count: 48, equipment_per_person: 110, movement_per_person: 35, cluster_type: '저활동형', knox_per_person: 12, meeting_per_person: 5, reliability_score: 0.52, correction_factor: 1.18 },
  { center: '경영지원센터', bu: 'IT담당', team: 'IT인프라팀', employee_count: 62, equipment_per_person: 480, movement_per_person: 92, cluster_type: '시스템운영집중형', knox_per_person: 300, meeting_per_person: 42, reliability_score: 0.88, correction_factor: 0.92 },
];

// ─── 클러스터별 통계 계산 ───────────────────────────────────────────────────────

function computeClusterStats(): ClusterStats[] {
  const clusterTypes: ClusterType[] = [
    '시스템운영집중형',
    '현장이동활발형',
    '디지털협업중심형',
    '저활동형',
    '균형업무형',
  ];

  return clusterTypes.map((clusterName) => {
    const teams = patternData.filter((d) => d.cluster_type === clusterName);
    if (teams.length === 0) {
      throw new Error(`No teams found for cluster: ${clusterName}`);
    }

    const totalEmployees = teams.reduce((sum, t) => sum + t.employee_count, 0);
    const teamCount = teams.length;

    const weightedAvg = (accessor: (t: PatternData) => number): number => {
      const totalWeight = teams.reduce((sum, t) => sum + t.employee_count, 0);
      if (totalWeight === 0) throw new Error(`Zero total weight for cluster: ${clusterName}`);
      const weightedSum = teams.reduce((sum, t) => sum + accessor(t) * t.employee_count, 0);
      return Math.round((weightedSum / totalWeight) * 10) / 10;
    };

    return {
      cluster_name: clusterName,
      team_count: teamCount,
      total_employees: totalEmployees,
      avg_knox_per_person: weightedAvg((t) => t.knox_per_person),
      avg_equipment_per_person: weightedAvg((t) => t.equipment_per_person),
      avg_movement_per_person: weightedAvg((t) => t.movement_per_person),
      avg_meeting_per_person: weightedAvg((t) => t.meeting_per_person),
      avg_reliability: Math.round(weightedAvg((t) => t.reliability_score) * 100) / 100,
      avg_correction_factor: Math.round(weightedAvg((t) => t.correction_factor) * 100) / 100,
    };
  });
}

export const clusterStats: ClusterStats[] = computeClusterStats();

// ─── 헬퍼 함수 ──────────────────────────────────────────────────────────────────

/** 특정 클러스터의 팀 목록 반환 */
export function getTeamsByCluster(clusterType: ClusterType): PatternData[] {
  const teams = patternData.filter((d) => d.cluster_type === clusterType);
  if (teams.length === 0) {
    throw new Error(`No teams found for cluster type: ${clusterType}`);
  }
  return teams;
}

/** 특정 센터의 팀 목록 반환 */
export function getTeamsByCenter(centerName: string): PatternData[] {
  return patternData.filter((d) => d.center === centerName);
}

/** 박스 플롯 통계 계산 (min, Q1, median, Q3, max) */
export function computeBoxPlotStats(
  values: number[]
): { min: number; q1: number; median: number; q3: number; max: number } {
  if (values.length === 0) {
    throw new Error('Cannot compute box plot stats for empty array');
  }

  const sorted = [...values].sort((a, b) => a - b);
  const len = sorted.length;

  const quantile = (p: number): number => {
    const index = p * (len - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    return sorted[lower] * (upper - index) + sorted[upper] * (index - lower);
  };

  return {
    min: sorted[0],
    q1: Math.round(quantile(0.25) * 10) / 10,
    median: Math.round(quantile(0.5) * 10) / 10,
    q3: Math.round(quantile(0.75) * 10) / 10,
    max: sorted[len - 1],
  };
}
