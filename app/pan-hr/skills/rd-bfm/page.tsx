"use client";

import Link from "next/link";
import { ChevronRight, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HRDBrowser } from "@/components/skills/HRDBrowser";

export default function RdBfmPage() {
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
          <span className="text-neutral-900 font-medium">Automotive R&D BFM</span>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Automotive R&D 스킬 프레임워크
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          자동차 R&D 직군별 BFM 기반 스킬 프레임워크 — Job Family → Task → Skill → Level 정의
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Car className="w-5 h-5 text-orange-600" />
            R&D 직군 스킬 프레임워크 브라우저
          </CardTitle>
          <p className="text-sm text-neutral-500">
            좌측에서 R&D 직군을 선택하면 해당 직군의 Task, Skill, Level 정의를 순서대로 탐색할 수 있습니다
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] border-t border-neutral-200">
            <HRDBrowser />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
