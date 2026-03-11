"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SkillInferencePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="px-6 py-3 border-b bg-white">
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          <Link href="/agents" className="hover:text-neutral-700">
            HR Agents
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">
            채용공고 기반 Skill 추론
          </span>
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">
          채용공고에서 필요 스킬 자동 추출
        </p>
      </div>
      <iframe
        src="/skill-inference.html"
        className="flex-1 w-full border-0"
        title="채용공고 기반 Skill 추론"
      />
    </div>
  );
}
