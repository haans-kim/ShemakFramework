"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  centerTrendData,
  getCompanyAverage,
  getCenterAverage,
  type CenterTrendData,
} from "@/lib/data/workforce-trends-data";

type MetricKey = "weeklyClaimedHours" | "weeklyAdjustedHours";

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MONTH_LABELS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const BAR_COLORS = ["#374151", "#6b7280", "#9ca3af", "#d1d5db"]; // gray-700, gray-500, gray-400, gray-300

function calculatePercentileThresholds(values: number[]): { p20: number; p80: number } {
  if (values.length === 0) throw new Error("Cannot calculate percentiles from empty array");
  const sorted = [...values].sort((a, b) => a - b);
  const p20Index = Math.floor(sorted.length * 0.2);
  const p80Index = Math.floor(sorted.length * 0.8);
  return {
    p20: sorted[p20Index],
    p80: sorted[p80Index],
  };
}

function getCellStyle(value: number, p20: number, p80: number): string {
  if (value >= p80) {
    return "bg-red-50 border-2 border-red-300 text-red-700";
  }
  if (value <= p20) {
    return "bg-blue-50 border-2 border-blue-300 text-blue-700";
  }
  return "bg-green-50 border-2 border-green-300 text-green-700";
}

export default function TrendsPage() {
  const [selectedCenterCode, setSelectedCenterCode] = useState<string>(
    centerTrendData[0].centerCode
  );
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("weeklyClaimedHours");

  const selectedCenter = useMemo(() => {
    const found = centerTrendData.find((c) => c.centerCode === selectedCenterCode);
    if (!found) throw new Error(`Center ${selectedCenterCode} not found in centerTrendData`);
    return found;
  }, [selectedCenterCode]);

  const companyAvg = useMemo(() => getCompanyAverage(selectedMetric), [selectedMetric]);
  const centerAvg = useMemo(
    () => getCenterAverage(selectedCenterCode, selectedMetric),
    [selectedCenterCode, selectedMetric]
  );

  // Build all visible values for percentile calculation
  const { allValues, thresholds } = useMemo(() => {
    const vals: number[] = [];

    // Company average values
    for (const m of companyAvg) {
      vals.push(m[selectedMetric]);
    }

    // Center average values
    for (const m of centerAvg) {
      vals.push(m[selectedMetric]);
    }

    // Level data values
    for (const level of selectedCenter.levelData) {
      for (const md of level.monthlyData) {
        vals.push(md[selectedMetric]);
      }
      // Average values
      vals.push(selectedMetric === "weeklyClaimedHours" ? level.avgClaimed : level.avgAdjusted);
    }

    // Company and center avg averages
    const companyAvgVal = vals.length > 0
      ? Math.round((companyAvg.reduce((s, m) => s + m[selectedMetric], 0) / companyAvg.length) * 10) / 10
      : 0;
    const centerAvgVal = vals.length > 0
      ? Math.round((centerAvg.reduce((s, m) => s + m[selectedMetric], 0) / centerAvg.length) * 10) / 10
      : 0;
    vals.push(companyAvgVal, centerAvgVal);

    return { allValues: vals, thresholds: calculatePercentileThresholds(vals) };
  }, [companyAvg, centerAvg, selectedCenter, selectedMetric]);

  const companyAvgTotal = useMemo(
    () => Math.round((companyAvg.reduce((s, m) => s + m[selectedMetric], 0) / companyAvg.length) * 10) / 10,
    [companyAvg, selectedMetric]
  );

  const centerAvgTotal = useMemo(
    () => Math.round((centerAvg.reduce((s, m) => s + m[selectedMetric], 0) / centerAvg.length) * 10) / 10,
    [centerAvg, selectedMetric]
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2">
          <Link href="/pan-hr" className="hover:text-neutral-700 transition-colors">
            Pan HR
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/pan-hr/workforce" className="hover:text-neutral-700 transition-colors">
            인력관리
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">트렌드 분석</span>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">트렌드 분석</h1>
        <p className="text-sm text-neutral-600 mt-1">
          2025년 1월 ~ 12월 레벨별 근무시간 추이
        </p>
      </div>

      {/* Center Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-6">
        {centerTrendData.map((center) => (
          <button
            key={center.centerCode}
            onClick={() => setSelectedCenterCode(center.centerCode)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors truncate ${
              selectedCenterCode === center.centerCode
                ? "bg-neutral-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {center.centerName}
          </button>
        ))}
      </div>

      {/* Monthly Data Grid Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
        {/* Header with metric toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">월별통계</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMetric("weeklyClaimedHours")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === "weeklyClaimedHours"
                  ? "bg-neutral-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              주간 근태시간
            </button>
            <button
              onClick={() => setSelectedMetric("weeklyAdjustedHours")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === "weeklyAdjustedHours"
                  ? "bg-neutral-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              주간 근무추정시간
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="w-20 min-w-[80px] px-2 py-3 text-left text-neutral-500 font-medium">
                  구분
                </th>
                {MONTH_LABELS.map((label) => (
                  <th key={label} className="px-2 py-3 text-center text-neutral-500 font-medium min-w-[72px]">
                    {label}
                  </th>
                ))}
                <th className="w-24 min-w-[96px] px-2 py-3 text-center text-neutral-500 font-medium">
                  평균
                </th>
              </tr>
            </thead>
            <tbody>
              {/* 전사평균 */}
              <tr className="border-b border-neutral-100">
                <td className="px-2 py-1 text-neutral-700 font-medium whitespace-nowrap">전사평균</td>
                {MONTHS.map((m) => {
                  const monthData = companyAvg.find((d) => d.month === m);
                  if (!monthData) throw new Error(`Company average data missing for month ${m}`);
                  const val = monthData[selectedMetric];
                  return (
                    <td key={m} className="px-1 py-1 text-center">
                      <div
                        className={`min-h-[52px] flex items-center justify-center rounded-md text-sm font-semibold ${getCellStyle(val, thresholds.p20, thresholds.p80)}`}
                      >
                        {val.toFixed(1)}
                      </div>
                    </td>
                  );
                })}
                <td className="px-1 py-1 text-center">
                  <div
                    className={`min-h-[52px] flex items-center justify-center rounded-md text-sm font-semibold ${getCellStyle(companyAvgTotal, thresholds.p20, thresholds.p80)}`}
                  >
                    {companyAvgTotal.toFixed(1)}
                  </div>
                </td>
              </tr>

              {/* 센터평균 */}
              <tr className="border-b border-neutral-100">
                <td className="px-2 py-1 text-neutral-700 font-medium whitespace-nowrap">센터평균</td>
                {MONTHS.map((m) => {
                  const monthData = centerAvg.find((d) => d.month === m);
                  if (!monthData) throw new Error(`Center average data missing for month ${m}`);
                  const val = monthData[selectedMetric];
                  return (
                    <td key={m} className="px-1 py-1 text-center">
                      <div
                        className={`min-h-[52px] flex items-center justify-center rounded-md text-sm font-semibold ${getCellStyle(val, thresholds.p20, thresholds.p80)}`}
                      >
                        {val.toFixed(1)}
                      </div>
                    </td>
                  );
                })}
                <td className="px-1 py-1 text-center">
                  <div
                    className={`min-h-[52px] flex items-center justify-center rounded-md text-sm font-semibold ${getCellStyle(centerAvgTotal, thresholds.p20, thresholds.p80)}`}
                  >
                    {centerAvgTotal.toFixed(1)}
                  </div>
                </td>
              </tr>

              {/* Level rows */}
              {selectedCenter.levelData.map((level) => {
                const levelAvg = selectedMetric === "weeklyClaimedHours" ? level.avgClaimed : level.avgAdjusted;
                return (
                  <tr key={level.level} className="border-b border-neutral-100">
                    <td className="px-2 py-1 text-neutral-700 font-medium whitespace-nowrap">
                      {level.level}
                    </td>
                    {MONTHS.map((m) => {
                      const md = level.monthlyData.find((d) => d.month === m);
                      if (!md) throw new Error(`Level ${level.level} data missing for month ${m}`);
                      const val = md[selectedMetric];
                      return (
                        <td key={m} className="px-1 py-1 text-center">
                          <div
                            className={`min-h-[52px] flex items-center justify-center rounded-md text-sm font-semibold ${getCellStyle(val, thresholds.p20, thresholds.p80)}`}
                          >
                            {val.toFixed(1)}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-1 py-1 text-center">
                      <div
                        className={`min-h-[52px] flex items-center justify-center rounded-md text-sm font-semibold ${getCellStyle(levelAvg, thresholds.p20, thresholds.p80)}`}
                      >
                        {levelAvg.toFixed(1)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Bar Charts */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">월별 레벨별 근무시간</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {MONTHS.map((m, mi) => {
              const levelValues = selectedCenter.levelData.map((level) => {
                const md = level.monthlyData.find((d) => d.month === m);
                if (!md) throw new Error(`Chart data missing for level ${level.level} month ${m}`);
                return md[selectedMetric];
              });

              const maxVal = 55;
              const chartHeight = 256;
              const gridLines = [0, 10, 20, 30, 40, 50];

              return (
                <div key={m} className="flex flex-col items-center">
                  {/* Chart area */}
                  <div className="relative" style={{ height: chartHeight, width: 80 }}>
                    {/* Grid lines */}
                    {gridLines.map((gl) => (
                      <div
                        key={gl}
                        className="absolute left-0 right-0 border-t border-neutral-100"
                        style={{ bottom: `${(gl / maxVal) * 100}%` }}
                      >
                        {mi === 0 && (
                          <span className="absolute -left-7 -top-2 text-[10px] text-neutral-400">
                            {gl}
                          </span>
                        )}
                      </div>
                    ))}
                    {/* Bars */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 px-1">
                      {levelValues.map((val, li) => {
                        const barHeight = (val / maxVal) * chartHeight;
                        return (
                          <div key={li} className="flex flex-col items-center">
                            <span className="text-[9px] text-neutral-600 font-medium mb-0.5">
                              {val.toFixed(1)}
                            </span>
                            <div
                              className="rounded-t-sm"
                              style={{
                                width: 14,
                                height: barHeight,
                                backgroundColor: BAR_COLORS[li],
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Month label */}
                  <div className="text-xs text-neutral-600 font-medium mt-2">
                    {MONTH_LABELS[mi]}
                  </div>
                  {/* Level labels */}
                  <div className="flex gap-1 mt-1">
                    {["L4", "L3", "L2", "L1"].map((label, li) => (
                      <span
                        key={label}
                        className="text-[8px] font-medium"
                        style={{ color: BAR_COLORS[li], width: 14, textAlign: "center" }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-red-50 border-2 border-red-300" />
          <span>상위 20%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-green-50 border-2 border-green-300" />
          <span>중위 60%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-blue-50 border-2 border-blue-300" />
          <span>하위 20%</span>
        </div>
        <span className="text-neutral-400 text-xs">
          * 주간 근무시간은 월별 주 평균 기준으로 산출됩니다
        </span>
      </div>
    </div>
  );
}
