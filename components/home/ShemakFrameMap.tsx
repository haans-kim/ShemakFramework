"use client";

import { motion } from "framer-motion";
import { Users, Eye, Bot } from "lucide-react";
import { PillarCard } from "./PillarCard";
import { OntologyBar } from "./OntologyBar";

const pillars = [
  {
    title: "Pan HR",
    subtitle: "주기적 적정 인력 관리",
    href: "/pan-hr",
    icon: Users,
    color: "blue" as const,
    hiItems: [
      { label: "적정 인력 산출", detail: "조직별 현황" },
      { label: "거시/미시 예측", detail: "중장기 계획" },
      { label: "스킬 매핑", detail: "역량 체계" },
    ],
    aiItems: [
      { label: "적정 인력 모델링", detail: "AI 예측" },
      { label: "근무량/스킬 분석", detail: "패턴 분석" },
      { label: "번아웃 리스크 예측", detail: "조기 경보" },
    ],
  },
  {
    title: "HR Agents",
    subtitle: "AI Agent 기반 HR 운영",
    href: "/agents",
    icon: Bot,
    color: "indigo" as const,
    hiItems: [
      { label: "제도 설계", detail: "인사제도" },
      { label: "보상/평가 체계", detail: "시뮬레이션" },
      { label: "채용/배치 계획", detail: "최적화" },
    ],
    aiItems: [
      { label: "성과/스킬 Agent", detail: "OCA 진단" },
      { label: "보상 Agent", detail: "급여 분석" },
      { label: "조직/채용 Agent", detail: "인력 배치" },
    ],
  },
  {
    title: "Optic View",
    subtitle: "몰입도 예측 및 관리",
    href: "/optic-view",
    icon: Eye,
    color: "amber" as const,
    hiItems: [
      { label: "진단: 설문", detail: "조직 진단" },
      { label: "조직/리더십", detail: "역량 평가" },
      { label: "이탈 리스크 분석", detail: "조기 감지" },
    ],
    aiItems: [
      { label: "설문 분석", detail: "NLP 분석" },
      { label: "예측 모델링", detail: "몰입도 예측" },
      { label: "SHAP 요인 분석", detail: "영향 요인" },
    ],
  },
];

export function ShemakFrameMap() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Pediment - 삼각 박공 영역 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-500 tracking-wider">
              InsightGroup HR AI Platform
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Shemak Framework
          </h1>
          <p className="text-sm text-gray-500">
            Human Intelligence + Artificial Intelligence
          </p>
        </motion.div>

        {/* Entablature - 가로 빔 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="my-6"
        >
          <div className="h-1 rounded-full bg-gray-400" />
          <div className="h-0.5 mt-0.5 rounded-full bg-gray-300" />
        </motion.div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.title} {...pillar} index={index} />
          ))}
        </div>

        {/* Stylobate - 기단 (Foundation Ontologies) */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-5 mb-2"
        >
          <div className="h-0.5 rounded-full bg-gray-300" />
          <div className="h-1 mt-0.5 rounded-full bg-gray-400" />
        </motion.div>

        <OntologyBar />
      </div>
    </div>
  );
}
