"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

export default function HRDiagnosisPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Optic View</span>
          <span>/</span>
          <span className="text-gray-900">인력수준 진단</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">인력수준 진단 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">설문 기반 조직/리더십 진단 결과 요약</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            진단 결과 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Phase 3에서 구현 예정</p>
        </CardContent>
      </Card>
    </div>
  );
}
