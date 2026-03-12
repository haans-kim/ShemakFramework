// 트렌드 분석 정적 데이터 (익명화)
// 10개 센터 × 4개 레벨 × 12개월 월별 데이터

export interface TrendLevelMonthly {
  month: number;
  weeklyClaimedHours: number;
  weeklyAdjustedHours: number;
}

export interface TrendLevelData {
  level: string;
  monthlyData: TrendLevelMonthly[];
  avgClaimed: number;
  avgAdjusted: number;
}

export interface CenterTrendData {
  centerCode: string;
  centerName: string;
  headcount: number;
  levelData: TrendLevelData[];
}

function generateMonthlyData(base: number, variance: number, seed: number): TrendLevelMonthly[] {
  const months: TrendLevelMonthly[] = [];
  // Deterministic pseudo-random
  let s = seed;
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s % 100) / 100; };
  for (let m = 1; m <= 12; m++) {
    const claimedBase = base + (rand() - 0.5) * variance;
    const adjustedBase = claimedBase * (0.7 + rand() * 0.25);
    months.push({
      month: m,
      weeklyClaimedHours: Math.round(claimedBase * 10) / 10,
      weeklyAdjustedHours: Math.round(adjustedBase * 10) / 10,
    });
  }
  return months;
}

function avg(data: TrendLevelMonthly[], key: "weeklyClaimedHours" | "weeklyAdjustedHours"): number {
  const vals = data.map((d) => d[key]).filter((v) => v > 0);
  if (vals.length === 0) throw new Error(`No valid values for ${key}`);
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function makeLevelData(baseClaimed: number[], variance: number, seedBase: number): TrendLevelData[] {
  const levels = ["Lv.4", "Lv.3", "Lv.2", "Lv.1"];
  return levels.map((level, i) => {
    const monthly = generateMonthlyData(baseClaimed[i], variance, seedBase + i * 1000);
    return {
      level,
      monthlyData: monthly,
      avgClaimed: avg(monthly, "weeklyClaimedHours"),
      avgAdjusted: avg(monthly, "weeklyAdjustedHours"),
    };
  });
}

// 10개 센터별 트렌드 데이터
export const centerTrendData: CenterTrendData[] = [
  {
    centerCode: "C01",
    centerName: "생산1센터",
    headcount: 1580,
    levelData: makeLevelData([44.2, 42.8, 40.5, 38.1], 4, 101),
  },
  {
    centerCode: "C02",
    centerName: "생산2센터",
    headcount: 1420,
    levelData: makeLevelData([43.5, 41.9, 39.8, 37.6], 3.5, 201),
  },
  {
    centerCode: "C03",
    centerName: "생산3센터",
    headcount: 1150,
    levelData: makeLevelData([45.1, 43.2, 41.0, 38.5], 5, 301),
  },
  {
    centerCode: "C04",
    centerName: "기술센터",
    headcount: 1080,
    levelData: makeLevelData([42.0, 40.5, 38.8, 36.2], 3, 401),
  },
  {
    centerCode: "C05",
    centerName: "품질센터",
    headcount: 920,
    levelData: makeLevelData([41.5, 40.0, 38.2, 35.8], 4.5, 501),
  },
  {
    centerCode: "C06",
    centerName: "R&D센터",
    headcount: 880,
    levelData: makeLevelData([46.3, 44.1, 41.5, 39.0], 5, 601),
  },
  {
    centerCode: "C07",
    centerName: "설비센터",
    headcount: 780,
    levelData: makeLevelData([43.8, 42.0, 40.1, 37.5], 4, 701),
  },
  {
    centerCode: "C08",
    centerName: "물류센터",
    headcount: 720,
    levelData: makeLevelData([40.5, 39.2, 37.5, 35.0], 3, 801),
  },
  {
    centerCode: "C09",
    centerName: "안전환경센터",
    headcount: 650,
    levelData: makeLevelData([41.0, 39.8, 38.0, 35.5], 3.5, 901),
  },
  {
    centerCode: "C10",
    centerName: "경영지원센터",
    headcount: 820,
    levelData: makeLevelData([39.5, 38.2, 36.8, 34.5], 2.5, 1001),
  },
];

// 전사 평균 계산
export function getCompanyAverage(metric: "weeklyClaimedHours" | "weeklyAdjustedHours"): TrendLevelMonthly[] {
  const months: TrendLevelMonthly[] = [];
  for (let m = 1; m <= 12; m++) {
    let totalClaimed = 0;
    let totalAdjusted = 0;
    let count = 0;
    for (const center of centerTrendData) {
      for (const level of center.levelData) {
        const md = level.monthlyData.find((d) => d.month === m);
        if (md) {
          totalClaimed += md.weeklyClaimedHours;
          totalAdjusted += md.weeklyAdjustedHours;
          count++;
        }
      }
    }
    if (count === 0) throw new Error(`No data for month ${m}`);
    months.push({
      month: m,
      weeklyClaimedHours: Math.round((totalClaimed / count) * 10) / 10,
      weeklyAdjustedHours: Math.round((totalAdjusted / count) * 10) / 10,
    });
  }
  return months;
}

// 센터 평균 계산
export function getCenterAverage(centerCode: string, metric: "weeklyClaimedHours" | "weeklyAdjustedHours"): TrendLevelMonthly[] {
  const center = centerTrendData.find((c) => c.centerCode === centerCode);
  if (!center) throw new Error(`Center ${centerCode} not found`);
  const months: TrendLevelMonthly[] = [];
  for (let m = 1; m <= 12; m++) {
    let total = 0;
    let count = 0;
    for (const level of center.levelData) {
      const md = level.monthlyData.find((d) => d.month === m);
      if (md) {
        total += md[metric];
        count++;
      }
    }
    if (count === 0) throw new Error(`No data for center ${centerCode} month ${m}`);
    months.push({
      month: m,
      weeklyClaimedHours: metric === "weeklyClaimedHours" ? Math.round((total / count) * 10) / 10 : 0,
      weeklyAdjustedHours: metric === "weeklyAdjustedHours" ? Math.round((total / count) * 10) / 10 : 0,
    });
  }
  return months;
}
