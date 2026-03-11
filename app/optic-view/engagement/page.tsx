"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function EngagementPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Optic View</span>
          <span>/</span>
          <span className="text-gray-900">몰입도 예측</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">몰입도 예측 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">조직별 몰입도 점수 예측 및 주요 영향 요인 분석</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600" />
            몰입도 예측 결과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Phase 3에서 구현 예정</p>
        </CardContent>
      </Card>
    </div>
  );
}
