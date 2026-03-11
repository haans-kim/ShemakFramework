"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FAMILIES = [
  "IT/디지털",
  "기술/공학",
  "생산/제조",
  "영업/마케팅",
  "운영/공급망",
  "경영/전략",
  "재무/회계",
  "인사/조직",
  "경영지원",
];

const LEVELS = ["Direct", "Control", "Execute"] as const;
const LEVEL_KR: Record<string, string> = {
  Direct: "전략수립",
  Control: "관리통제",
  Execute: "실행운영",
};

const LEVEL_HEADER_STYLE: Record<string, string> = {
  Direct: "bg-blue-600 text-white",
  Control: "bg-orange-500 text-white",
  Execute: "bg-green-600 text-white",
};

const FAMILY_COLORS: Record<string, string> = {
  "IT/디지털": "#2563eb",
  "기술/공학": "#7c3aed",
  "생산/제조": "#ea580c",
  "영업/마케팅": "#16a34a",
  "운영/공급망": "#0d9488",
  "경영/전략": "#4338ca",
  "재무/회계": "#dc2626",
  "인사/조직": "#db2777",
  "경영지원": "#6b7280",
};

interface BFMCell {
  code: string;
  name: string;
  jobCount: number;
  skillCount: number;
}

// Static BFM data: accountability level -> family -> components
const STATIC_MATRIX: Record<string, Record<string, BFMCell[]>> = {
  Direct: {
    "IT/디지털": [
      { code: "IT-D1", name: "디지털전략", jobCount: 3, skillCount: 12 },
      { code: "IT-D2", name: "IT거버넌스", jobCount: 2, skillCount: 8 },
    ],
    "기술/공학": [
      { code: "TE-D1", name: "기술전략", jobCount: 4, skillCount: 18 },
      { code: "TE-D2", name: "R&D기획", jobCount: 3, skillCount: 14 },
    ],
    "생산/제조": [
      { code: "MF-D1", name: "생산전략", jobCount: 2, skillCount: 9 },
    ],
    "영업/마케팅": [
      { code: "SM-D1", name: "영업전략", jobCount: 3, skillCount: 11 },
    ],
    "운영/공급망": [
      { code: "SC-D1", name: "공급망전략", jobCount: 2, skillCount: 10 },
    ],
    "경영/전략": [
      { code: "BS-D1", name: "경영전략", jobCount: 4, skillCount: 16 },
      { code: "BS-D2", name: "사업개발", jobCount: 3, skillCount: 12 },
    ],
    "재무/회계": [
      { code: "FA-D1", name: "재무전략", jobCount: 2, skillCount: 8 },
    ],
    "인사/조직": [
      { code: "HR-D1", name: "인사전략", jobCount: 3, skillCount: 13 },
    ],
    "경영지원": [
      { code: "GA-D1", name: "경영기획", jobCount: 2, skillCount: 7 },
    ],
  },
  Control: {
    "IT/디지털": [
      { code: "IT-C1", name: "시스템관리", jobCount: 4, skillCount: 15 },
      { code: "IT-C2", name: "보안관리", jobCount: 3, skillCount: 12 },
      { code: "IT-C3", name: "데이터관리", jobCount: 3, skillCount: 11 },
    ],
    "기술/공학": [
      { code: "TE-C1", name: "품질관리", jobCount: 5, skillCount: 22 },
      { code: "TE-C2", name: "프로젝트관리", jobCount: 4, skillCount: 16 },
    ],
    "생산/제조": [
      { code: "MF-C1", name: "공정관리", jobCount: 3, skillCount: 14 },
      { code: "MF-C2", name: "설비관리", jobCount: 3, skillCount: 12 },
    ],
    "영업/마케팅": [
      { code: "SM-C1", name: "고객관리", jobCount: 3, skillCount: 10 },
      { code: "SM-C2", name: "마케팅관리", jobCount: 2, skillCount: 9 },
    ],
    "운영/공급망": [
      { code: "SC-C1", name: "물류관리", jobCount: 3, skillCount: 13 },
      { code: "SC-C2", name: "구매관리", jobCount: 3, skillCount: 11 },
    ],
    "경영/전략": [
      { code: "BS-C1", name: "리스크관리", jobCount: 2, skillCount: 9 },
    ],
    "재무/회계": [
      { code: "FA-C1", name: "회계관리", jobCount: 3, skillCount: 11 },
      { code: "FA-C2", name: "세무관리", jobCount: 2, skillCount: 8 },
    ],
    "인사/조직": [
      { code: "HR-C1", name: "인재개발", jobCount: 3, skillCount: 14 },
      { code: "HR-C2", name: "조직개발", jobCount: 2, skillCount: 10 },
    ],
    "경영지원": [
      { code: "GA-C1", name: "총무관리", jobCount: 2, skillCount: 8 },
      { code: "GA-C2", name: "법무관리", jobCount: 2, skillCount: 7 },
    ],
  },
  Execute: {
    "IT/디지털": [
      { code: "IT-E1", name: "SW개발", jobCount: 6, skillCount: 28 },
      { code: "IT-E2", name: "인프라운영", jobCount: 4, skillCount: 16 },
      { code: "IT-E3", name: "데이터분석", jobCount: 3, skillCount: 14 },
    ],
    "기술/공학": [
      { code: "TE-E1", name: "설계/시뮬레이션", jobCount: 6, skillCount: 32 },
      { code: "TE-E2", name: "시험/검증", jobCount: 5, skillCount: 24 },
      { code: "TE-E3", name: "소재/공법", jobCount: 4, skillCount: 18 },
    ],
    "생산/제조": [
      { code: "MF-E1", name: "조립/가공", jobCount: 5, skillCount: 20 },
      { code: "MF-E2", name: "검사/측정", jobCount: 3, skillCount: 12 },
    ],
    "영업/마케팅": [
      { code: "SM-E1", name: "영업실행", jobCount: 4, skillCount: 14 },
      { code: "SM-E2", name: "딜러관리", jobCount: 2, skillCount: 8 },
    ],
    "운영/공급망": [
      { code: "SC-E1", name: "입고/출하", jobCount: 3, skillCount: 10 },
      { code: "SC-E2", name: "재고관리", jobCount: 2, skillCount: 8 },
    ],
    "경영/전략": [
      { code: "BS-E1", name: "전략실행", jobCount: 2, skillCount: 7 },
    ],
    "재무/회계": [
      { code: "FA-E1", name: "결산/보고", jobCount: 3, skillCount: 10 },
    ],
    "인사/조직": [
      { code: "HR-E1", name: "채용/배치", jobCount: 3, skillCount: 12 },
      { code: "HR-E2", name: "급여/복리후생", jobCount: 2, skillCount: 8 },
    ],
    "경영지원": [
      { code: "GA-E1", name: "시설관리", jobCount: 2, skillCount: 6 },
      { code: "GA-E2", name: "문서관리", jobCount: 1, skillCount: 4 },
    ],
  },
};

function getTotalComponents(): number {
  let count = 0;
  for (const level of Object.values(STATIC_MATRIX)) {
    for (const cells of Object.values(level)) {
      count += cells.length;
    }
  }
  return count;
}

function getTotalSkills(): number {
  let count = 0;
  for (const level of Object.values(STATIC_MATRIX)) {
    for (const cells of Object.values(level)) {
      for (const cell of cells) {
        count += cell.skillCount;
      }
    }
  }
  return count;
}

export function BFMMatrix() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const totalComponents = getTotalComponents();
  const totalSkills = getTotalSkills();

  return (
    <div className="space-y-3">
      {/* Summary stats */}
      <div className="flex items-center gap-6 text-xs text-neutral-500">
        <span>
          <span className="font-semibold text-neutral-700">{totalComponents}</span> 컴포넌트
        </span>
        <span>
          <span className="font-semibold text-neutral-700">{FAMILIES.length}</span> 직군
        </span>
        <span>
          <span className="font-semibold text-neutral-700">{LEVELS.length}</span> 책임레벨
        </span>
        <span>
          <span className="font-semibold text-neutral-700">{totalSkills}</span> 스킬
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header row */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `120px repeat(${FAMILIES.length}, minmax(100px, 1fr))`,
            }}
          >
            <div className="px-2 py-2" />
            {FAMILIES.map((fam) => {
              const color = FAMILY_COLORS[fam];
              if (!color) {
                throw new Error(`Color not found for family: ${fam}`);
              }
              return (
                <div
                  key={fam}
                  className="px-1.5 py-2 text-center text-[11px] font-bold border-b-2"
                  style={{ borderColor: color, color: color }}
                >
                  {fam}
                </div>
              );
            })}
          </div>

          {/* Level rows */}
          {LEVELS.map((level) => {
            const levelData = STATIC_MATRIX[level];
            if (!levelData) {
              throw new Error(`Matrix data not found for level: ${level}`);
            }
            return (
              <div
                key={level}
                className="grid border-t border-neutral-200"
                style={{
                  gridTemplateColumns: `120px repeat(${FAMILIES.length}, minmax(100px, 1fr))`,
                }}
              >
                {/* Level header */}
                <div
                  className={cn(
                    "flex flex-col items-center justify-center px-2 py-3 min-h-[80px]",
                    LEVEL_HEADER_STYLE[level]
                  )}
                >
                  <span className="text-xs font-bold">{level}</span>
                  <span className="text-[10px] opacity-80 mt-0.5">
                    {LEVEL_KR[level]}
                  </span>
                </div>

                {/* Family cells */}
                {FAMILIES.map((fam) => {
                  const items = levelData[fam];
                  const cellKey = `${level}-${fam}`;
                  const isHovered = hoveredCell === cellKey;

                  return (
                    <div
                      key={fam}
                      className={cn(
                        "border-l border-neutral-200 p-1.5 min-h-[80px] transition-colors",
                        isHovered ? "bg-neutral-100" : "bg-white hover:bg-neutral-50"
                      )}
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {!items || items.length === 0 ? (
                        <span className="text-[10px] text-neutral-300 italic">
                          --
                        </span>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          {items.map((item) => {
                            const color = FAMILY_COLORS[fam];
                            return (
                              <div key={item.code} className="leading-tight">
                                <div className="text-[10px] font-mono text-neutral-400">
                                  {item.code}
                                </div>
                                <div
                                  className="text-[11px] font-medium leading-tight"
                                  style={{ color: color }}
                                >
                                  {item.name}
                                </div>
                                <div className="text-[9px] text-neutral-400">
                                  {item.jobCount}직무 {item.skillCount}스킬
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
