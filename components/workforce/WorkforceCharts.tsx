"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TEAM_COLORS: Record<string, string> = {
  "A-1-1": "#3b82f6",
  "A-1-2": "#6366f1",
  "A-2-1": "#8b5cf6",
  "A-2-2": "#a78bfa",
  "B-1-1": "#ef4444",
  "B-1-2": "#f59e0b",
  "B-2-1": "#10b981",
  "C-1-1": "#06b6d4",
};

interface TrendDataPoint {
  month: string;
  [teamCode: string]: string | number;
}

interface WorkforceChartsProps {
  trendData: TrendDataPoint[];
  teamCodes: string[];
}

export function WorkforceEfficiencyChart({
  trendData,
  teamCodes,
}: WorkforceChartsProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickFormatter={(v: string) => v.slice(5)}
        />
        <YAxis
          domain={[50, 100]}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, ""]}
          labelFormatter={(label) => `${label}`}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          iconType="circle"
        />
        {teamCodes.map((code) => (
          <Line
            key={code}
            type="monotone"
            dataKey={code}
            stroke={TEAM_COLORS[code]}
            strokeWidth={code === "B-1-1" ? 3 : 1.5}
            dot={false}
            strokeDasharray={code === "B-1-1" ? undefined : undefined}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
