"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RadarDataPoint {
  category: string;
  categoryLabel: string;
  avg_proficiency: number;
  required_level: number;
}

interface SkillsRadarChartProps {
  radarData: RadarDataPoint[];
}

export function SkillsRadarChart({ radarData }: SkillsRadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="categoryLabel"
          tick={{ fontSize: 13, fill: "#374151", fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickCount={6}
        />
        <Radar
          name="보유 수준"
          dataKey="avg_proficiency"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Radar
          name="필요 수준"
          dataKey="required_level"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.1}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          iconType="circle"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
