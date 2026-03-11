"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href, label }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (href) {
          router.push(href);
        } else {
          router.back();
        }
      }}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-all cursor-pointer mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      {label ? label : "목록으로 돌아가기"}
    </button>
  );
}
