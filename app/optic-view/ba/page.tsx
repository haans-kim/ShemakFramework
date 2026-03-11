"use client";

import { BackButton } from "@/components/poc/back-button";
import { KpiCard } from "@/components/poc/kpi-card";
import { SectionHeader } from "@/components/poc/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  kpiData,
  inputDataTypes,
  pipelineSteps,
  outputFeatures,
  selfAssessment,
} from "@/lib/data/ba-data";

export default function BaDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <BackButton />

      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">
          RAG 기반 AI 가설 자동생성 PoC
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          오*** 데이터 | 46명 x 62문항 | 멀티소스 교차검증 | 2026.03
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <KpiCard
          title="데이터 규모"
          value={kpiData.dataScale.value}
          subtitle={kpiData.dataScale.label}
          status="info"
        />
        <KpiCard
          title="투입 데이터"
          value={kpiData.dataTypes.value}
          subtitle={kpiData.dataTypes.label}
          status="success"
        />
        <KpiCard
          title="AI 처리시간"
          value={kpiData.processingTime.value}
          subtitle={kpiData.processingTime.label}
          status="warning"
        />
      </div>

      {/* Input Data Types */}
      <SectionHeader
        title="투입 데이터 구성"
        subtitle="4종의 데이터를 교차 투입하여 AI 분석 기반 구축"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {inputDataTypes.map((item) => (
          <div
            key={item.title}
            className="rounded-lg p-4 border-2 border-gray-300 border-l-4 border-l-blue-500 shadow-sm bg-gradient-to-br from-blue-50 to-white"
          >
            <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            <p className="text-xs text-neutral-400 mt-1">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <SectionHeader
        title="분석 파이프라인"
        subtitle="3단계 순차 처리 구조"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {pipelineSteps.map((step) => (
          <div key={step.step} className="relative">
            <Card className="h-full">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <Badge variant={step.method === "수작업" ? "default" : "info"}>
                    {step.method}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500">{step.description}</p>
                {step.note && (
                  <p className="text-xs text-amber-600 mt-2">
                    {step.note}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Output Features */}
      <SectionHeader
        title="기대 OUTPUT"
        subtitle="AI가 생성하는 3가지 핵심 결과물"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {outputFeatures.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg p-5 border-2 border-gray-300 border-l-4 border-l-green-500 shadow-sm bg-gradient-to-br from-green-50 to-white"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
            <p className="text-xs text-neutral-400 mt-2">{feature.detail}</p>
          </div>
        ))}
      </div>

      {/* Chat Interface Mockup */}
      <SectionHeader
        title="심층 분석 인터페이스"
        subtitle="컨설턴트가 자연어 질의로 AI 생성 가설 및 원본 데이터 기반 심층 탐색"
      />
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 text-sm font-bold">
                Q
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">컨설턴트 질의 예시</p>
                <p className="text-sm text-gray-500 mt-1">
                  &quot;보상 만족도가 낮은 직급은 어디인가? 해당 직급의 시장 대비 급여 수준은?&quot;
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600 text-sm font-bold">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">AI 응답 (RAG 기반)</p>
                <p className="text-sm text-gray-500 mt-1">
                  설문 데이터, 인사제도, 시장보상 데이터를 교차 인용하여 근거 기반 답변 생성
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-3">
            * 가설 생성 버튼 클릭 후 3~5분 소요. 채팅 기반 자유 탐색 지원.
          </p>
        </CardContent>
      </Card>

      {/* Self Assessment */}
      <SectionHeader
        title="PoC 자평 및 시사점"
      />
      <div className="rounded-lg p-6 border-2 border-gray-300 border-l-4 border-l-amber-500 shadow-sm bg-gradient-to-br from-amber-50 to-white mb-8">
        <div className="flex items-start gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900">현재 상태</h3>
              <Badge variant="warning">{selfAssessment.status}</Badge>
            </div>
            <p className="text-sm text-gray-600">{selfAssessment.finding}</p>
          </div>
        </div>

        <div className="ml-8 space-y-2">
          {selfAssessment.implications.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs text-gray-400 mt-0.5">{i + 1}.</span>
              <p className="text-sm text-gray-500">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">PoC 목적</h3>
          <p className="text-sm text-gray-500">
            데이터가 주어졌을 때, 사람의 Input이 최소화된다면 AI는 어떤 분석과 개선안을 도출하는지를 확인해보고자 함.
            개입할 수 있는 곳은 어떤 데이터를 줄 것이냐, 어떤 AI Model을 사용할 것이냐, Output의 Tone &amp; Manner 변경 여부 등.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
