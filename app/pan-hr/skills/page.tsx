"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function SkillsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Pan HR</span>
          <span>/</span>
          <span className="text-gray-900">스킬관리</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">스킬관리 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">스킬 매트릭스, 갭 분석, 스킬 계층 구조</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            스킬관리 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Phase 2에서 구현 예정</p>
        </CardContent>
      </Card>
    </div>
  );
}
