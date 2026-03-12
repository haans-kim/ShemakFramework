"use client";

import { useState } from "react";
import { CaseCard } from "@/components/poc/case-card";
import { cn } from "@/lib/utils";
import {
  Bot,
  BrainCircuit,
  DollarSign,
  Database,
  FileSearch,
  BarChart3,
  GitBranch,
  FileText,
} from "lucide-react";

const performanceSkillCases = [
  {
    href: "/agents/skill",
    client: "P***",
    title: "스킬 Agent 대시보드 -- HR팀",
    description:
      "HR팀 성과/스킬 Agent 기반 통합 대시보드. OCA 진단, RACI, JD/PP, 업무 매뉴얼, EOS 패턴, KPI/Skill/역량, 급여 수준 분석.",
    icon: BrainCircuit,
    metrics: [
      { label: "팀 인원", value: "4명" },
      { label: "L3 업무", value: "91개" },
      { label: "개선 과제", value: "16건" },
    ],
    tags: [
      { text: "Skill Agent", variant: "info" as const },
      { text: "OCA 진단", variant: "success" as const },
      { text: "RACI", variant: "warning" as const },
    ],
    accentColor: "bg-indigo-500",
  },
  {
    href: "/agents/skill-leveling",
    client: "현***",
    title: "DB 기반 Skill Leveling",
    description:
      "설계직군 Skill Level 결측치를 DB 기반으로 예측하는 대시보드. 레이더 차트, 테이블, 요약 카드로 숙련도 분석.",
    icon: Database,
    metrics: [
      { label: "대시보드", value: "22p" },
      { label: "직군", value: "Design" },
      { label: "분석", value: "Level 예측" },
    ],
    tags: [
      { text: "Skill Level", variant: "info" as const },
      { text: "결측치 예측", variant: "success" as const },
      { text: "DB 기반", variant: "warning" as const },
    ],
    accentColor: "bg-indigo-500",
  },
  {
    href: "/agents/skill-inference",
    client: "현***",
    title: "채용공고 기반 Skill 추론",
    description:
      "채용 공고에서 AI가 스킬을 자동 추출하고, 스킬 의존성 그래프를 구축하여 암묵적 스킬까지 추론하는 파이프라인.",
    icon: FileSearch,
    metrics: [
      { label: "대시보드", value: "23p" },
      { label: "파이프라인", value: "6단계" },
      { label: "추론", value: "AI 기반" },
    ],
    tags: [
      { text: "Skill 추론", variant: "info" as const },
      { text: "Dependency Graph", variant: "success" as const },
      { text: "Embedding", variant: "warning" as const },
    ],
    accentColor: "bg-cyan-500",
  },
];

const compensationCases = [
  {
    href: "/agents/ilji",
    client: "일***",
    title: "기본급 인상률 최적 배분 시뮬레이션",
    description:
      "비승진자 대상 평가등급 x 몰입유형 x 보상정책선 3요소 가중 배분. AI 시나리오 기반 최적 인상률 도출.",
    icon: DollarSign,
    metrics: [
      { label: "비승진자", value: "112명" },
      { label: "몰입유형", value: "4종" },
      { label: "만족유형", value: "4종" },
    ],
    tags: [
      { text: "AI Powered", variant: "info" as const },
      { text: "시장 Percentile", variant: "success" as const },
      { text: "시뮬레이션", variant: "warning" as const },
    ],
    accentColor: "bg-emerald-500",
  },
  {
    href: "/agents/wh",
    client: "W***",
    title: "기본급 인상률 최적 배분 시뮬레이션",
    description:
      "비승진자 대상 평가등급 x 몰입유형 x 보상정책선 3요소 가중 배분. AI 시나리오 기반 최적 인상률 도출.",
    icon: DollarSign,
    metrics: [
      { label: "비승진자", value: "112명" },
      { label: "몰입유형", value: "4종" },
      { label: "만족유형", value: "4종" },
    ],
    tags: [
      { text: "AI Powered", variant: "info" as const },
      { text: "시장 Percentile", variant: "success" as const },
      { text: "시뮬레이션", variant: "warning" as const },
    ],
    accentColor: "bg-teal-500",
  },
];

const orgRecruitCases = [
  {
    href: "/agents/gap-monitoring",
    client: "현***",
    title: "Gap 모니터링",
    description:
      "R&D BFM 기반 채용 전략 대시보드. 전략적 중요도 vs 경쟁우위 분석, 컴포넌트별 Gap 분석, BFM Matrix 시각화.",
    icon: BarChart3,
    metrics: [
      { label: "대시보드", value: "27p" },
      { label: "분석", value: "BFM Gap" },
      { label: "전략", value: "R&D" },
    ],
    tags: [
      { text: "Gap Analysis", variant: "info" as const },
      { text: "BFM Matrix", variant: "success" as const },
      { text: "채용전략", variant: "warning" as const },
    ],
    accentColor: "bg-purple-500",
  },
  {
    href: "/agents/recruit-rqmt",
    client: "현***",
    title: "채용 Rqmt 자동생성",
    description:
      "AI 기반 채용 요건 자동 생성 파이프라인. 데이터 수집부터 스킬 추출, 결측 보완, 요건 생성, 효과성 검증까지 6단계.",
    icon: GitBranch,
    metrics: [
      { label: "대시보드", value: "28p" },
      { label: "파이프라인", value: "6단계" },
      { label: "분류", value: "KSAT" },
    ],
    tags: [
      { text: "Rqmt 생성", variant: "info" as const },
      { text: "Graph Traversal", variant: "success" as const },
      { text: "KSAT", variant: "warning" as const },
    ],
    accentColor: "bg-emerald-500",
  },
  {
    href: "/agents/recruit-posting",
    client: "현***",
    title: "채용공고 생성",
    description:
      "설계직군 채용공고 생성 대시보드. 팀별 요건 현황, Gap 분석, AI 기반 채용공고 자동 생성.",
    icon: FileText,
    metrics: [
      { label: "대시보드", value: "29p" },
      { label: "포지션", value: "3개" },
      { label: "요건", value: "31개" },
    ],
    tags: [
      { text: "채용공고", variant: "info" as const },
      { text: "Gap 분석", variant: "success" as const },
      { text: "AI 생성", variant: "warning" as const },
    ],
    accentColor: "bg-rose-500",
  },
];

const tabs = [
  { key: "performance" as const, label: "성과/스킬", description: "AI Agent 기반 성과 진단 및 스킬 분석 자동화", cases: performanceSkillCases },
  { key: "compensation" as const, label: "보상", description: "AI 시나리오 기반 보상 최적화 및 인상률 시뮬레이션", cases: compensationCases },
  { key: "org-recruit" as const, label: "조직/채용", description: "BFM 기반 Gap 분석 및 채용 요건·공고 자동화", cases: orgRecruitCases },
];

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === activeTab) ?? tabs[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">HR Agents</h1>
        </div>
        <p className="text-sm text-gray-500">
          AI Agent 기반 HR 업무 자동화 — 스킬 진단, 보상 시뮬레이션, 채용 자동화
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex gap-2 max-w-3xl">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 px-5 py-2.5 text-sm font-semibold rounded-t-lg border border-b-0 transition-colors",
                activeTab === tab.key
                  ? "bg-white text-gray-900 border-gray-300"
                  : "bg-gray-100 text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50"
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-xs font-normal text-gray-400">
                {tab.cases.length}
              </span>
            </button>
          ))}
        </nav>
        <div className="border-t border-gray-300" />
      </div>

      {/* Tab Description */}
      <p className="text-sm text-gray-500 mb-6">{current.description}</p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {current.cases.map((c) => (
          <CaseCard key={c.href} {...c} />
        ))}
      </div>
    </div>
  );
}
