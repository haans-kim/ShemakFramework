"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

interface FteBarDataPoint {
  team: string;
  org_code: string;
  fte_required: number;
  fte_actual: number;
  gap_status: string;
}

interface PlanningChartsProps {
  fteData: FteBarDataPoint[];
}

export function FteGapBarChart({ fteData }: PlanningChartsProps) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart
        data={fteData}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        barGap={2}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="team"
          tick={{ fontSize: 12, fill: "#6b7280" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickFormatter={(v: number) => `${v}`}
        />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          formatter={(value, name) => [
            `${value} FTE`,
            name === "fte_required" ? "필요 FTE" : "실제 FTE",
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value: string) =>
            value === "fte_required" ? "필요 FTE" : "실제 FTE"
          }
        />
        <ReferenceLine y={0} stroke="#d1d5db" />
        <Bar dataKey="fte_required" fill="#94a3b8" radius={[4, 4, 0, 0]}>
          {fteData.map((entry, index) => (
            <Cell
              key={`req-${index}`}
              fill={entry.gap_status === "shortage" ? "#fca5a5" : "#94a3b8"}
            />
          ))}
        </Bar>
        <Bar dataKey="fte_actual" fill="#3b82f6" radius={[4, 4, 0, 0]}>
          {fteData.map((entry, index) => (
            <Cell
              key={`act-${index}`}
              fill={entry.gap_status === "shortage" ? "#ef4444" : "#3b82f6"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
