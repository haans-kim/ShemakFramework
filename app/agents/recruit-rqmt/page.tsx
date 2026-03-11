"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function RecruitRqmtPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="px-6 py-3 border-b bg-white">
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          <Link href="/agents" className="hover:text-neutral-700">
            HR Agents
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">
            채용 Rqmt 자동생성
          </span>
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">
          6단계 파이프라인 기반 채용 요건 자동 생성
        </p>
      </div>
      <iframe
        src="/recruit-rqmt.html"
        className="flex-1 w-full border-0"
        title="채용 Rqmt 자동생성"
      />
    </div>
  );
}
