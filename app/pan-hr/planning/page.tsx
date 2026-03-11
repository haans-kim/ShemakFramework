"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function PlanningPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Pan HR</span>
          <span>/</span>
          <span className="text-gray-900">인력계획</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">인력계획 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">인원 예측, FTE 갭 분석, 시나리오 비교</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            인력계획 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Phase 2에서 구현 예정</p>
        </CardContent>
      </Card>
    </div>
  );
}
