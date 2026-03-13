"use client";

import { CaseCard } from "@/components/poc/case-card";
import { Activity, Layers, Users, Shield, BarChart3, Cpu, Shirt } from "lucide-react";

const cases = [
  {
    href: "/optic-view/ons",
    client: "오***",
    title: "조직진단 Survey 몰입도 예측",
    description:
      "조직진단 설문 결과를 AI Modeling 하여 몰입 유형 예측하고 개선 과제를 도출. SHAP What-If 시뮬레이터로 요인별 영향 분석.",
    icon: Activity,
    metrics: [
      { label: "분석 대상", value: "1,007명" },
      { label: "몰입도", value: "57.8%" },
      { label: "주의 필요", value: "34.6%" },
    ],
    tags: [
      { text: "K-Means", variant: "info" as const },
      { text: "SHAP", variant: "success" as const },
      { text: "What-If", variant: "warning" as const },
    ],
    accentColor: "bg-purple-500",
  },
  {
    href: "/optic-view/clothing",
    client: "S***",
    title: "의류업종 HR Analytics",
    description:
      "의류업종 HR Analytics. H-S 모델 기반 심화 분석, 조직별 상세 진단, 개선 시나리오 시뮬레이션.",
    icon: Shirt,
    metrics: [
      { label: "분석 대상", value: "331명" },
      { label: "조직 수", value: "44명" },
      { label: "유형", value: "4종" },
    ],
    tags: [
      { text: "H-S 모델", variant: "info" as const },
      { text: "H-S 분석", variant: "success" as const },
      { text: "조직진단", variant: "warning" as const },
    ],
    accentColor: "bg-rose-500",
  },
  {
    href: "/optic-view/cross",
    client: "O***",
    title: "Cross-Company Prediction",
    description:
      "기준 모델(S*** 255명) 응답 패턴으로 타사(O*** 45명) HR 실적을 예측. 유형별 평가등급·시장 보상 백분위 전이 검증.",
    icon: Layers,
    metrics: [
      { label: "학습 데이터", value: "255명" },
      { label: "예측 대상", value: "45명" },
      { label: "F1 Score", value: "0.554" },
    ],
    tags: [
      { text: "K-Means", variant: "info" as const },
      { text: "Cross-Company", variant: "success" as const },
      { text: "검증", variant: "warning" as const },
    ],
    accentColor: "bg-cyan-500",
  },
  {
    href: "/optic-view/ga",
    client: "도***",
    title: "M&A 문화통합 리스크 진단",
    description:
      "T**+T** 합병 후 문화적 거리 측정, 4개 에너지 클러스터 분류, Quiet Quitting 리스크 조기탐지",
    icon: Users,
    metrics: [
      { label: "분석 대상", value: "1,717명" },
      { label: "냉소이탈", value: "23.9%" },
      { label: "문화거리", value: "+51%" },
    ],
    tags: [
      { text: "t-SNE", variant: "info" as const },
      { text: "K-Means", variant: "info" as const },
      { text: "Isolation Forest", variant: "warning" as const },
      { text: "GBM SHAP", variant: "success" as const },
    ],
    accentColor: "bg-red-500",
  },
  {
    href: "/optic-view/da",
    client: "파***",
    title: "조직 리스크 조기탐지",
    description:
      "3개년 종단 데이터 분석으로 2024년에 이미 감지 가능했던 리스크 신호 입증. 리더십 역설 검증.",
    icon: Shield,
    metrics: [
      { label: "분석 대상", value: "671명" },
      { label: "리스크군", value: "18.8%" },
      { label: "악화 영역", value: "20/22" },
    ],
    tags: [
      { text: "PCA", variant: "info" as const },
      { text: "K-Means", variant: "info" as const },
      { text: "3개년 종단", variant: "success" as const },
    ],
    accentColor: "bg-amber-500",
  },
  {
    href: "/optic-view/ra",
    client: "제***",
    title: "인력수준 진단 + 몰입도 예측",
    description:
      "SHAP 기반 설명가능 AI로 몰입도 핵심 동인 분석. What-if 시뮬레이션으로 개선 시나리오 예측.",
    icon: BarChart3,
    metrics: [
      { label: "분석 대상", value: "1,203명" },
      { label: "몰입도", value: "3.76" },
      { label: "개선 예측", value: "+3.4%" },
    ],
    tags: [
      { text: "K-Means", variant: "info" as const },
      { text: "SHAP", variant: "success" as const },
      { text: "OLS 시뮬레이션", variant: "warning" as const },
    ],
    accentColor: "bg-green-500",
  },
  {
    href: "/optic-view/ba",
    client: "오***",
    title: "RAG 기반 AI 가설 자동생성",
    description:
      "설문+인사제도+보상 데이터를 RAG로 통합, AI가 자동으로 가설을 생성하고 근거를 매칭하는 실험적 PoC.",
    icon: Cpu,
    metrics: [
      { label: "데이터 규모", value: "46x62" },
      { label: "투입 데이터", value: "4종" },
      { label: "처리시간", value: "3~5분" },
    ],
    tags: [
      { text: "RAG", variant: "info" as const },
      { text: "LLM", variant: "success" as const },
      { text: "실험적 PoC", variant: "warning" as const },
    ],
    accentColor: "bg-blue-500",
  },
];

export default function OpticViewPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Optic View</h1>
        <p className="text-sm text-gray-500 mt-1">
          Foundation DB 기반 AI 분석 사례 — 몰입도 예측, 조직 리스크, 문화통합, 인력진단
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c) => (
          <CaseCard key={c.href} {...c} />
        ))}
      </div>
    </div>
  );
}
