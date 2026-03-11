"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Shield, Stethoscope, ArrowRight } from "lucide-react";

const cases = [
  {
    title: "몰입도 예측",
    description: "조직별 몰입도 점수 예측 및 주요 영향 요인 분석",
    href: "/optic-view/engagement",
    icon: Activity,
    color: "text-amber-600",
    bgColor: "from-amber-50 to-white",
    borderColor: "border-l-amber-500",
  },
  {
    title: "조직 리스크",
    description: "이탈 위험, 번아웃 리스크 히트맵 분석",
    href: "/optic-view/org-risk",
    icon: Shield,
    color: "text-red-600",
    bgColor: "from-red-50 to-white",
    borderColor: "border-l-red-500",
  },
  {
    title: "인력수준 진단",
    description: "설문 기반 조직/리더십 진단 결과 요약",
    href: "/optic-view/hr-diagnosis",
    icon: Stethoscope,
    color: "text-teal-600",
    bgColor: "from-teal-50 to-white",
    borderColor: "border-l-teal-500",
  },
];

export default function OpticViewPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Optic View</h1>
        <p className="text-sm text-gray-500 mt-1">
          몰입도 예측 및 관리 - 조직 진단, 리스크 분석
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cases.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href}>
              <Card
                className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${c.borderColor} bg-gradient-to-br ${c.bgColor} h-full`}
              >
                <CardHeader>
                  <Icon className={`w-5 h-5 ${c.color}`} />
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">{c.description}</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                    <span>분석 결과 보기</span>
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
