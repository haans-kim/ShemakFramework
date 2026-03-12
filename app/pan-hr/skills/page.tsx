"use client";

import Link from "next/link";
import { ChevronRight, Table2, LayoutGrid, Search, Car, Activity, BarChart2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const modules = [
  {
    title: "BFM 구조도",
    description: "책임레벨(Direct/Control/Execute) × 직군 매트릭스 구조 — 9개 직군, 3개 레벨, 컴포넌트별 직무/스킬 분포",
    href: "/pan-hr/skills/matrix",
    icon: Table2,
    color: "text-indigo-600",
    bgColor: "from-indigo-50 to-white",
    borderColor: "border-l-indigo-500",
    tags: ["9개 직군", "3개 책임레벨", "직무/스킬 매핑"],
  },
  {
    title: "BFM 탐색",
    description: "직군 → Task → 스킬 → L1-L5 레벨 정의를 Miller Column 방식으로 탐색",
    href: "/pan-hr/skills/browser",
    icon: LayoutGrid,
    color: "text-blue-600",
    bgColor: "from-blue-50 to-white",
    borderColor: "border-l-blue-500",
    tags: ["Miller Columns", "레벨 정의", "스킬 프레임워크"],
  },
  {
    title: "스킬 검색",
    description: "BFM 전체 스킬셋 검색 — 직군, 스킬 유형, 우선순위 필터링",
    href: "/pan-hr/skills/search",
    icon: Search,
    color: "text-emerald-600",
    bgColor: "from-emerald-50 to-white",
    borderColor: "border-l-emerald-500",
    tags: ["스킬 검색", "필터링", "직군별 그룹"],
  },
  {
    title: "Automotive R&D BFM",
    description: "자동차 R&D 직군 스킬 프레임워크 — 직군별 Task/Skill/Level 탐색",
    href: "/pan-hr/skills/rd-bfm",
    icon: Car,
    color: "text-orange-600",
    bgColor: "from-orange-50 to-white",
    borderColor: "border-l-orange-500",
    tags: ["R&D 직군", "스킬 프레임워크", "레벨 정의"],
  },
  {
    title: "R&D 역량대시보드",
    description: "R&D 9개 Function별 역량 점수/인원 매트릭스 — 디자인 직군 상세 분석",
    href: "/pan-hr/skills/rd-dashboard",
    icon: Activity,
    color: "text-violet-600",
    bgColor: "from-violet-50 to-white",
    borderColor: "border-l-violet-500",
    tags: ["역량 점수", "인원 현황", "디자인 상세"],
  },
  {
    title: "Staffing 대시보드",
    description: "BFM 기반 채용 평가 시스템 — 채용 공고별 지원자 역량 Gap 분석",
    href: "/pan-hr/skills/staffing",
    icon: BarChart2,
    color: "text-rose-600",
    bgColor: "from-rose-50 to-white",
    borderColor: "border-l-rose-500",
    tags: ["채용 공고", "지원자 분석", "Gap 분석"],
  },
];

export default function SkillsOverviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2">
          <Link href="/pan-hr" className="hover:text-neutral-700 transition-colors">
            Pan HR
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">스킬관리</span>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">
          스킬관리 대시보드
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          BFM 기반 스킬 탐색, 역량 분석, 채용 평가 시스템
        </p>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.href} href={mod.href}>
              <Card
                className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${mod.borderColor} bg-gradient-to-br ${mod.bgColor} h-full`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${mod.color}`} />
                  </div>
                  <CardTitle className="text-lg">{mod.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    {mod.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mod.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                    <span>대시보드 보기</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
