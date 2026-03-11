"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, DollarSign, UserPlus, ArrowRight } from "lucide-react";

const agents = [
  {
    title: "성과/스킬 Agent",
    description: "OCA 진단 결과, RACI 매트릭스, 스킬 갭 리포트",
    href: "/agents/performance-skill",
    icon: TrendingUp,
    color: "text-indigo-600",
    bgColor: "from-indigo-50 to-white",
    borderColor: "border-l-indigo-500",
    status: "AI Agent",
  },
  {
    title: "보상 Agent",
    description: "급여 시뮬레이션, 평가등급 x 몰입유형 히트맵",
    href: "/agents/compensation",
    icon: DollarSign,
    color: "text-orange-600",
    bgColor: "from-orange-50 to-white",
    borderColor: "border-l-orange-500",
    status: "AI Agent",
  },
  {
    title: "조직/채용 Agent",
    description: "채용 요건, 추천 스킬 프로필, 워크로드 개선 예측",
    href: "/agents/staffing",
    icon: UserPlus,
    color: "text-cyan-600",
    bgColor: "from-cyan-50 to-white",
    borderColor: "border-l-cyan-500",
    status: "AI Agent",
  },
];

export default function AgentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-gray-700" />
          <h1 className="text-xl font-semibold text-gray-900">HR Agents</h1>
        </div>
        <p className="text-sm text-gray-500">
          AI Agent 기반 HR 운영 - 사전 생성된 분석 결과 대시보드
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Link key={agent.href} href={agent.href}>
              <Card
                className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${agent.borderColor} bg-gradient-to-br ${agent.bgColor} h-full`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${agent.color}`} />
                    <Badge variant="secondary" className="text-xs">
                      {agent.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{agent.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    {agent.description}
                  </p>
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
