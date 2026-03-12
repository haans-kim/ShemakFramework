"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid3X3 } from "lucide-react";
import { BFMMatrix } from "@/components/skills/BFMMatrix";

export default function MatrixPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2">
          <Link href="/pan-hr" className="hover:text-neutral-700 transition-colors">
            Pan HR
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/pan-hr/skills" className="hover:text-neutral-700 transition-colors">
            스킬관리
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">BFM 구조도</span>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">
          BFM (Business Function Matrix) 구조도
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          책임레벨(Direct/Control/Execute) × 직군 매트릭스 — 컴포넌트별 직무/스킬 분포
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Grid3X3 className="w-5 h-5 text-indigo-600" />
            전체 BFM 매트릭스
          </CardTitle>
          <p className="text-sm text-neutral-500">
            9개 직군 × 3개 책임레벨 — 각 셀은 컴포넌트 코드, 이름, 직무수, 스킬수를 표시합니다
          </p>
        </CardHeader>
        <CardContent>
          <BFMMatrix />
        </CardContent>
      </Card>
    </div>
  );
}
