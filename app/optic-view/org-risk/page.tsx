"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function OrgRiskPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Optic View</span>
          <span>/</span>
          <span className="text-gray-900">조직 리스크</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">조직 리스크 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">이탈 위험, 번아웃 리스크 히트맵 분석</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            리스크 히트맵
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Phase 3에서 구현 예정</p>
        </CardContent>
      </Card>
    </div>
  );
}
