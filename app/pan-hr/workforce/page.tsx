"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function WorkforcePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Pan HR</span>
          <span>/</span>
          <span className="text-gray-900">인력관리</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">인력관리 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">팀별 근무 효율, 초과근무 현황, 번아웃 위험 분석</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            인력관리 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Phase 2에서 구현 예정</p>
        </CardContent>
      </Card>
    </div>
  );
}
