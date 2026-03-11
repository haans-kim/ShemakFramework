"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function StaffingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>HR Agents</span>
          <span>/</span>
          <span className="text-gray-900">조직/채용 Agent</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">조직/채용 Agent</h1>
        <p className="text-sm text-gray-500 mt-1">채용 요건, 추천 스킬 프로필, 워크로드 개선 예측</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-600" />
            채용 계획 결과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Phase 3에서 구현 예정</p>
        </CardContent>
      </Card>
    </div>
  );
}
