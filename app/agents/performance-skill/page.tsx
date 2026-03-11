"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function PerformanceSkillPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>HR Agents</span>
          <span>/</span>
          <span className="text-gray-900">성과/스킬 Agent</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">성과/스킬 Agent</h1>
        <p className="text-sm text-gray-500 mt-1">OCA 진단 결과, RACI 매트릭스, 스킬 갭 리포트</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Agent 분석 결과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Phase 3에서 구현 예정</p>
        </CardContent>
      </Card>
    </div>
  );
}
