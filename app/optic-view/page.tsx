"use client";

import { CaseCard } from "@/components/poc/case-card";
import { Activity, Layers, Users, Shield, BarChart3, Cpu } from "lucide-react";

const cases = [
  {
    href: "/optic-view/ons",
    client: "\uC624***",
    title: "\uC870\uC9C1\uC9C4\uB2E8 Survey \uBAB0\uC785\uB3C4 \uC608\uCE21",
    description:
      "\uC870\uC9C1\uC9C4\uB2E8 \uC124\uBB38 \uACB0\uACFC\uB97C AI Modeling \uD558\uC5EC \uBAB0\uC785 \uC720\uD615 \uC608\uCE21\uD558\uACE0 \uAC1C\uC120 \uACFC\uC81C\uB97C \uB3C4\uCD9C. SHAP What-If \uC2DC\uBBAC\uB808\uC774\uD130\uB85C \uC694\uC778\uBCC4 \uC601\uD5A5 \uBD84\uC11D.",
    icon: Activity,
    metrics: [
      { label: "\uBD84\uC11D \uB300\uC0C1", value: "1,007\uBA85" },
      { label: "\uBAB0\uC785\uB3C4", value: "57.8%" },
      { label: "\uC8FC\uC758 \uD544\uC694", value: "34.6%" },
    ],
    tags: [
      { text: "K-Means", variant: "info" as const },
      { text: "SHAP", variant: "success" as const },
      { text: "What-If", variant: "warning" as const },
    ],
    accentColor: "bg-purple-500",
  },
  {
    href: "/optic-view/cross",
    client: "O***",
    title: "Cross-Company Prediction",
    description:
      "\uAE30\uC900 \uBAA8\uB378(S*** 255\uBA85) \uC751\uB2F5 \uD328\uD134\uC73C\uB85C \uD0C0\uC0AC(O*** 45\uBA85) HR \uC2E4\uC801\uC744 \uC608\uCE21. \uC720\uD615\uBCC4 \uD3C9\uAC00\uB4F1\uAE09\u00B7\uC2DC\uC7A5 \uBCF4\uC0C1 \uBC31\uBD84\uC704 \uC804\uC774 \uAC80\uC99D.",
    icon: Layers,
    metrics: [
      { label: "\uD559\uC2B5 \uB370\uC774\uD130", value: "255\uBA85" },
      { label: "\uC608\uCE21 \uB300\uC0C1", value: "45\uBA85" },
      { label: "F1 Score", value: "0.554" },
    ],
    tags: [
      { text: "K-Means", variant: "info" as const },
      { text: "Cross-Company", variant: "success" as const },
      { text: "\uAC80\uC99D", variant: "warning" as const },
    ],
    accentColor: "bg-cyan-500",
  },
  {
    href: "/optic-view/ga",
    client: "\uB3C4***",
    title: "M&A \uBB38\uD654\uD1B5\uD569 \uB9AC\uC2A4\uD06C \uC9C4\uB2E8",
    description:
      "T**+T** \uD569\uBCD1 \uD6C4 \uBB38\uD654\uC801 \uAC70\uB9AC \uCE21\uC815, 4\uAC1C \uC5D0\uB108\uC9C0 \uD074\uB7EC\uC2A4\uD130 \uBD84\uB958, Quiet Quitting \uB9AC\uC2A4\uD06C \uC870\uAE30\uD0D0\uC9C0",
    icon: Users,
    metrics: [
      { label: "\uBD84\uC11D \uB300\uC0C1", value: "1,717\uBA85" },
      { label: "\uB0C9\uC18C\uC774\uD0C8", value: "23.9%" },
      { label: "\uBB38\uD654\uAC70\uB9AC", value: "+51%" },
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
    client: "\uD30C***",
    title: "\uC870\uC9C1 \uB9AC\uC2A4\uD06C \uC870\uAE30\uD0D0\uC9C0",
    description:
      "3\uAC1C\uB144 \uC885\uB2E8 \uB370\uC774\uD130 \uBD84\uC11D\uC73C\uB85C 2024\uB144\uC5D0 \uC774\uBBF8 \uAC10\uC9C0 \uAC00\uB2A5\uD588\uB358 \uB9AC\uC2A4\uD06C \uC2E0\uD638 \uC785\uC99D. \uB9AC\uB354\uC2ED \uC5ED\uC124 \uAC80\uC99D.",
    icon: Shield,
    metrics: [
      { label: "\uBD84\uC11D \uB300\uC0C1", value: "671\uBA85" },
      { label: "\uB9AC\uC2A4\uD06C\uAD70", value: "18.8%" },
      { label: "\uC545\uD654 \uC601\uC5ED", value: "20/22" },
    ],
    tags: [
      { text: "PCA", variant: "info" as const },
      { text: "K-Means", variant: "info" as const },
      { text: "3\uAC1C\uB144 \uC885\uB2E8", variant: "success" as const },
    ],
    accentColor: "bg-amber-500",
  },
  {
    href: "/optic-view/ra",
    client: "\uC81C***",
    title: "\uC778\uB825\uC218\uC900 \uC9C4\uB2E8 + \uBAB0\uC785\uB3C4 \uC608\uCE21",
    description:
      "SHAP \uAE30\uBC18 \uC124\uBA85\uAC00\uB2A5 AI\uB85C \uBAB0\uC785\uB3C4 \uD575\uC2EC \uB3D9\uC778 \uBD84\uC11D. What-if \uC2DC\uBBAC\uB808\uC774\uC158\uC73C\uB85C \uAC1C\uC120 \uC2DC\uB098\uB9AC\uC624 \uC608\uCE21.",
    icon: BarChart3,
    metrics: [
      { label: "\uBD84\uC11D \uB300\uC0C1", value: "1,203\uBA85" },
      { label: "\uBAB0\uC785\uB3C4", value: "3.76" },
      { label: "\uAC1C\uC120 \uC608\uCE21", value: "+3.4%" },
    ],
    tags: [
      { text: "K-Means", variant: "info" as const },
      { text: "SHAP", variant: "success" as const },
      { text: "OLS \uC2DC\uBBAC\uB808\uC774\uC158", variant: "warning" as const },
    ],
    accentColor: "bg-green-500",
  },
  {
    href: "/optic-view/ba",
    client: "\uC624***",
    title: "RAG \uAE30\uBC18 AI \uAC00\uC124 \uC790\uB3D9\uC0DD\uC131",
    description:
      "\uC124\uBB38+\uC778\uC0AC\uC81C\uB3C4+\uBCF4\uC0C1 \uB370\uC774\uD130\uB97C RAG\uB85C \uD1B5\uD569, AI\uAC00 \uC790\uB3D9\uC73C\uB85C \uAC00\uC124\uC744 \uC0DD\uC131\uD558\uACE0 \uADFC\uAC70\uB97C \uB9E4\uCE6D\uD558\uB294 \uC2E4\uD5D8\uC801 PoC.",
    icon: Cpu,
    metrics: [
      { label: "\uB370\uC774\uD130 \uADDC\uBAA8", value: "46x62" },
      { label: "\uD22C\uC785 \uB370\uC774\uD130", value: "4\uC885" },
      { label: "\uCC98\uB9AC\uC2DC\uAC04", value: "3~5\uBD84" },
    ],
    tags: [
      { text: "RAG", variant: "info" as const },
      { text: "LLM", variant: "success" as const },
      { text: "\uC2E4\uD5D8\uC801 PoC", variant: "warning" as const },
    ],
    accentColor: "bg-blue-500",
  },
];

export default function OpticViewPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Optic View</h1>
        <p className="text-sm text-gray-500 mt-1">
          Foundation DB \uAE30\uBC18 AI \uBD84\uC11D \uC0AC\uB840 \u2014 \uBAB0\uC785\uB3C4 \uC608\uCE21, \uC870\uC9C1 \uB9AC\uC2A4\uD06C, \uBB38\uD654\uD1B5\uD569, \uC778\uB825\uC9C4\uB2E8
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
