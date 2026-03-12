"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type {
  MetricType,
  CenterStats,
  MatrixData,
  ThresholdInfo,
} from "@/lib/data/workforce-matrix-data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CenterLevelGridProps {
  centers: CenterStats[];
  gradeMatrix: MatrixData;
  weeklyClaimedHoursMatrix: MatrixData;
  adjustedWeeklyWorkHoursMatrix: MatrixData;
  avgEfficiency: number;
  avgWeeklyClaimedHours: number;
  avgAdjustedWeeklyWorkHours: number;
  selectedMetric: MetricType;
  thresholds: Record<string, ThresholdInfo>;
}

interface MetricIndicatorProps {
  value: number;
  metricType: MetricType;
  thresholds?: { low: number; high: number };
  isAverage?: boolean;
}

// ─── MetricIndicator (Cell) ──────────────────────────────────────────────────

function MetricIndicator({
  value,
  metricType,
  thresholds,
  isAverage = false,
}: MetricIndicatorProps) {
  const getStatusIcon = () => {
    if (isAverage) return "";
    if (!thresholds) return "";
    if (value >= thresholds.high) return "▲";
    if (value <= thresholds.low) return "▼";
    return "●";
  };

  const getIconColor = () => {
    if (!thresholds) return "text-gray-400";
    if (value >= thresholds.high) return "text-red-600";
    if (value <= thresholds.low) return "text-blue-600";
    return "text-green-600";
  };

  const getIconStyle = () => {
    if (!thresholds) return "text-lg";
    const isCircle = value > thresholds.low && value < thresholds.high;
    return isCircle ? "text-lg scale-[1.35]" : "text-lg";
  };

  const getBorderColor = () => {
    if (isAverage) return "border-gray-400 bg-gray-100";
    if (!thresholds) {
      // Fallback for missing thresholds
      if (metricType === "efficiency") {
        if (value >= 86.0) return "border-red-400 bg-red-50";
        if (value > 80.0) return "border-green-400 bg-green-50";
        return "border-blue-400 bg-blue-50";
      } else {
        if (value >= 45.0) return "border-red-400 bg-red-50";
        if (value >= 40.0) return "border-green-400 bg-green-50";
        return "border-blue-400 bg-blue-50";
      }
    }
    if (value >= thresholds.high) return "border-red-400 bg-red-50";
    if (value <= thresholds.low) return "border-blue-400 bg-blue-50";
    return "border-green-400 bg-green-50";
  };

  const formatValue = () => {
    if (metricType === "efficiency") return `${value.toFixed(1)}%`;
    return `${value.toFixed(1)}h`;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 px-1.5 py-2.5 rounded-lg border transition-all w-full",
        getBorderColor()
      )}
    >
      <span className="text-base font-medium">{formatValue()}</span>
      <span className={cn(getIconStyle(), getIconColor())}>
        {getStatusIcon()}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function CenterLevelGrid({
  centers,
  gradeMatrix,
  weeklyClaimedHoursMatrix,
  adjustedWeeklyWorkHoursMatrix,
  avgEfficiency,
  avgWeeklyClaimedHours,
  avgAdjustedWeeklyWorkHours,
  selectedMetric,
  thresholds,
}: CenterLevelGridProps) {
  const router = useRouter();
  const levels = gradeMatrix.grades.filter((level) => level !== "Special");

  const handleCenterClick = (centerCode: string) => {
    router.push(`/pan-hr/workforce/divisions?parent=${centerCode}`);
  };

  // 현재 선택된 메트릭의 매트릭스 가져오기
  const getCurrentMatrix = (): MatrixData => {
    if (selectedMetric === "efficiency") return gradeMatrix;
    if (selectedMetric === "weeklyClaimedHours") return weeklyClaimedHoursMatrix;
    return adjustedWeeklyWorkHoursMatrix;
  };

  // 동적 임계값 계산 (화면에 표시된 모든 값 기반 20th/80th 백분위수)
  const calculateDynamicThresholds = (): { low: number; high: number } | null => {
    const values: number[] = [];
    const currentMatrix = getCurrentMatrix();

    // 센터 평균값 수집
    for (const center of centers) {
      let value = 0;
      if (selectedMetric === "efficiency") value = center.avgWorkEfficiency;
      else if (selectedMetric === "weeklyClaimedHours") value = center.avgWeeklyClaimedHours;
      else value = center.avgAdjustedWeeklyWorkHours;
      if (value > 0) values.push(value);
    }

    // 레벨별 데이터 값 수집
    if (currentMatrix.matrix) {
      for (const level of levels) {
        for (const center of centers) {
          const value = currentMatrix.matrix[level]?.[center.orgName];
          if (value && value > 0) values.push(value);
        }
      }
    }

    values.sort((a, b) => a - b);
    if (values.length === 0) return null;

    const percentile20 = values[Math.floor(values.length * 0.2)];
    const percentile80 = values[Math.floor(values.length * 0.8)];
    return { low: percentile20, high: percentile80 };
  };

  const dynamicThresholds = calculateDynamicThresholds();

  // 전체 평균값
  const getOverallAvg = (): number => {
    if (selectedMetric === "efficiency") return avgEfficiency;
    if (selectedMetric === "weeklyClaimedHours") return avgWeeklyClaimedHours;
    return avgAdjustedWeeklyWorkHours;
  };

  // 센터별 메트릭 값
  const getCenterValue = (center: CenterStats): number => {
    if (selectedMetric === "efficiency") return center.avgWorkEfficiency;
    if (selectedMetric === "weeklyClaimedHours") return center.avgWeeklyClaimedHours;
    return center.avgAdjustedWeeklyWorkHours;
  };

  // 레벨별 센터 값
  const getMatrixValue = (level: string, centerName: string): number => {
    const currentMatrix = getCurrentMatrix();
    return currentMatrix.matrix[level]?.[centerName] ?? 0;
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 shadow-lg p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">전체 현황</h2>
        <span className="text-sm text-gray-500">대상 인원: {centers.reduce((s, c) => s + c.headcount, 0).toLocaleString()}명</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-center p-2 text-base font-semibold text-gray-600 w-[90px]">
                구분
              </th>
              {centers.map((center) => (
                <th
                  key={center.orgCode}
                  className="text-center p-2 text-sm font-medium text-gray-600 w-[120px] cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleCenterClick(center.orgCode)}
                >
                  <span className="text-base font-semibold hover:text-blue-600 transition-colors">{center.orgName}</span>
                </th>
              ))}
              <th className="text-center p-2 text-base font-semibold text-gray-600 w-[100px]">
                평균
              </th>
            </tr>
          </thead>
          <tbody>
            {/* 센터 평균 행 */}
            <tr className="border-t-2 border-gray-400">
              <td className="p-2 font-semibold text-gray-700 text-base bg-gray-50 whitespace-nowrap text-center">
                전체 평균
              </td>
              {centers.map((center) => {
                const value = getCenterValue(center);
                return (
                  <td
                    key={`avg-${center.orgCode}`}
                    className="p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleCenterClick(center.orgCode)}
                  >
                    <MetricIndicator
                      value={value}
                      metricType={selectedMetric}
                      thresholds={dynamicThresholds ?? thresholds[selectedMetric]?.thresholds}
                    />
                  </td>
                );
              })}
              <td className="p-2 bg-gray-50">
                <MetricIndicator
                  value={getOverallAvg()}
                  metricType={selectedMetric}
                  thresholds={{ low: getOverallAvg() - 1, high: getOverallAvg() + 1 }}
                  isAverage={true}
                />
              </td>
            </tr>

            {/* 직급별 행 */}
            {levels.map((level, levelIndex) => (
              <tr
                key={level}
                className={
                  levelIndex === 0
                    ? "border-t-2 border-gray-400"
                    : "border-t border-gray-200"
                }
              >
                <td className="p-2 font-semibold text-gray-700 text-base whitespace-nowrap text-center">
                  {level}
                </td>
                {centers.map((center) => {
                  const value = getMatrixValue(level, center.orgName);
                  return (
                    <td key={`${level}-${center.orgCode}`} className="p-2">
                      <MetricIndicator
                        value={value}
                        metricType={selectedMetric}
                        thresholds={dynamicThresholds ?? thresholds[selectedMetric]?.thresholds}
                      />
                    </td>
                  );
                })}
                {/* 레벨별 평균 */}
                <td className="p-2">
                  {(() => {
                    const levelValues = centers
                      .map((center) => getMatrixValue(level, center.orgName))
                      .filter((v) => v > 0);
                    const avg =
                      levelValues.length > 0
                        ? levelValues.reduce((sum, val) => sum + val, 0) / levelValues.length
                        : 0;
                    return (
                      <MetricIndicator
                        value={avg}
                        metricType={selectedMetric}
                        thresholds={{ low: avg - 1, high: avg + 1 }}
                        isAverage={true}
                      />
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 메트릭별 정보 섹션 */}
      <div className="mt-4">
        <div className="p-3 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm shadow-sm">
          {selectedMetric === "efficiency" ? (
            <>
              <div className="font-semibold text-gray-900">
                평균 효율성 : {avgEfficiency.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-700 mt-1">
                실제 근무시간 ÷ 총 근무시간 × 100 | 30일 평균 데이터
              </div>
              <div className="text-xs text-gray-700 mt-1">
                ▲ 상위({thresholds.efficiency.high}) | ● 중위({thresholds.efficiency.middle}) | ▼ 하위({thresholds.efficiency.low})
              </div>
            </>
          ) : selectedMetric === "weeklyClaimedHours" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-gray-900">
                  주간 근태시간 : {avgWeeklyClaimedHours.toFixed(1)}h
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  주당 신고 근무시간 평균 | 30일 평균 데이터
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  ▲ 상위({thresholds.weeklyClaimedHours.high}) | ● 중위({thresholds.weeklyClaimedHours.middle}) | ▼ 하위({thresholds.weeklyClaimedHours.low})
                </div>
              </div>
              <div className="border-l pl-4">
                <div className="font-semibold text-gray-900">포함된 시간</div>
                <div className="text-xs text-gray-700 mt-1">
                  ✓ 실제 근태시간 (출퇴근 기록)
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  ✓ 연차·휴가 시간 (8h/일, 4h/반차, 시간연차)
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  ✓ 출장·교육 시간 (8h 기본값)
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-0">
              <div className="pr-4">
                <div className="font-semibold text-gray-900">
                  주간 근무추정시간 : {avgAdjustedWeeklyWorkHours.toFixed(1)}h
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  주당 근무추정시간 평균 | 30일 평균 데이터
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  ▲ 상위({thresholds.adjustedWeeklyWorkHours.high}) | ● 중위({thresholds.adjustedWeeklyWorkHours.middle}) | ▼ 하위({thresholds.adjustedWeeklyWorkHours.low})
                </div>
              </div>
              <div className="pl-4 border-l border-gray-300 grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xs font-medium text-gray-800">포함된 시간</div>
                  <div className="text-xs text-gray-600 mt-1">✓ 실제 근무시간 (출퇴근 기록)</div>
                  <div className="text-xs text-gray-600">✓ 연차·휴가 시간</div>
                  <div className="text-xs text-gray-600">✓ 출장·교육 시간</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-800">제외된 시간</div>
                  <div className="text-xs text-gray-600 mt-1">- 비업무구역체류</div>
                  <div className="text-xs text-gray-600">- 비업무이동</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-800">AI 보정 요소</div>
                  <div className="text-xs text-gray-600 mt-1">✓ 데이터 신뢰도 기반 조정</div>
                  <div className="text-xs text-gray-600">✓ 팀별 업무 패턴 분석</div>
                  <div className="text-xs text-gray-600">✓ 개인별 근무 특성 반영</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
