"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function CompensationPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>HR Agents</span>
          <span>/</span>
          <span className="text-gray-900">보상 Agent</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">보상 Agent</h1>
        <p className="text-sm text-gray-500 mt-1">급여 시뮬레이션, 평가등급 x 몰입유형 히트맵</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            보상 시뮬레이션 결과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Phase 3에서 구현 예정</p>
        </CardContent>
      </Card>
    </div>
  );
}
