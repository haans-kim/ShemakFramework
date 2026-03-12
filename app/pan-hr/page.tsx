"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, BarChart3, ArrowRight } from "lucide-react";

const modules = [
  {
    title: "인력관리",
    description: "팀별 근무 효율, 초과근무 현황, 번아웃 위험 분석",
    href: "/pan-hr/workforce",
    icon: Users,
    color: "text-blue-600",
    bgColor: "from-blue-50 to-white",
    borderColor: "border-l-blue-500",
    tags: ["근무 효율", "초과근무", "번아웃 위험"],
  },
  {
    title: "인력계획",
    description: "인원 예측, FTE 갭 분석, 시나리오 비교",
    href: "/pan-hr/planning",
    icon: TrendingUp,
    color: "text-emerald-600",
    bgColor: "from-emerald-50 to-white",
    borderColor: "border-l-emerald-500",
    tags: ["FTE 분석", "인원 예측", "시나리오"],
  },
  {
    title: "스킬관리",
    description: "스킬 매트릭스, 갭 분석, 스킬 계층 구조",
    href: "/pan-hr/skills",
    icon: BarChart3,
    color: "text-violet-600",
    bgColor: "from-violet-50 to-white",
    borderColor: "border-l-violet-500",
    tags: ["스킬 갭", "역량 매트릭스", "계층 구조"],
  },
];

export default function PanHRPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Pan HR</h1>
        <p className="text-sm text-gray-500 mt-1">
          주기적 적정 인력 관리 - 인력관리, 인력계획, 스킬관리
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
