"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillRecord {
  skillNameKR: string;
  skillNameEN: string;
  componentCode: string;
  componentName: string;
  jobFamily: string;
  accountabilityLevel: "Direct" | "Control" | "Execute";
  skillType: "Hard Skill" | "Soft Skill" | "Certification";
  coveragePct: number;
  priority: "High" | "Medium" | "Low";
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const SKILL_DATA: SkillRecord[] = [
  // IT/디지털 - SW개발 (IT-E1)
  {
    skillNameKR: "클라우드 아키텍처 설계",
    skillNameEN: "Cloud Architecture Design",
    componentCode: "IT-E1",
    componentName: "SW개발",
    jobFamily: "IT/디지털",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 58,
    priority: "High",
  },
  {
    skillNameKR: "마이크로서비스 구축",
    skillNameEN: "Microservices Development",
    componentCode: "IT-E1",
    componentName: "SW개발",
    jobFamily: "IT/디지털",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 45,
    priority: "High",
  },
  {
    skillNameKR: "DevOps 파이프라인",
    skillNameEN: "DevOps Pipeline",
    componentCode: "IT-E1",
    componentName: "SW개발",
    jobFamily: "IT/디지털",
    accountabilityLevel: "Execute",
    skillType: "Certification",
    coveragePct: 39,
    priority: "Medium",
  },
  // IT/디지털 - 데이터분석 (IT-E3)
  {
    skillNameKR: "머신러닝 모델링",
    skillNameEN: "Machine Learning Modeling",
    componentCode: "IT-E3",
    componentName: "데이터분석",
    jobFamily: "IT/디지털",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 42,
    priority: "High",
  },
  {
    skillNameKR: "데이터 시각화",
    skillNameEN: "Data Visualization",
    componentCode: "IT-E3",
    componentName: "데이터분석",
    jobFamily: "IT/디지털",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 63,
    priority: "Medium",
  },
  // IT/디지털 - IT거버넌스 (IT-D2)
  {
    skillNameKR: "IT 거버넌스 체계 수립",
    skillNameEN: "IT Governance Framework",
    componentCode: "IT-D2",
    componentName: "IT거버넌스",
    jobFamily: "IT/디지털",
    accountabilityLevel: "Direct",
    skillType: "Hard Skill",
    coveragePct: 72,
    priority: "High",
  },
  // 기술/공학 - 설계/시뮬레이션 (TE-E1)
  {
    skillNameKR: "CAD/CAE 모델링",
    skillNameEN: "CAD/CAE Modeling",
    componentCode: "TE-E1",
    componentName: "설계/시뮬레이션",
    jobFamily: "기술/공학",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 77,
    priority: "High",
  },
  {
    skillNameKR: "유한요소해석",
    skillNameEN: "Finite Element Analysis",
    componentCode: "TE-E1",
    componentName: "설계/시뮬레이션",
    jobFamily: "기술/공학",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 52,
    priority: "High",
  },
  {
    skillNameKR: "설계 도면 검토",
    skillNameEN: "Design Drawing Review",
    componentCode: "TE-E1",
    componentName: "설계/시뮬레이션",
    jobFamily: "기술/공학",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 84,
    priority: "Medium",
  },
  // 기술/공학 - 품질관리 (TE-C1)
  {
    skillNameKR: "품질관리 시스템 운영",
    skillNameEN: "Quality Management System",
    componentCode: "TE-C1",
    componentName: "품질관리",
    jobFamily: "기술/공학",
    accountabilityLevel: "Control",
    skillType: "Certification",
    coveragePct: 81,
    priority: "High",
  },
  {
    skillNameKR: "6시그마 방법론",
    skillNameEN: "Six Sigma Methodology",
    componentCode: "TE-C1",
    componentName: "품질관리",
    jobFamily: "기술/공학",
    accountabilityLevel: "Control",
    skillType: "Certification",
    coveragePct: 48,
    priority: "Medium",
  },
  // 생산/제조 - 조립/가공 (MF-E1)
  {
    skillNameKR: "자동화 설비 운용",
    skillNameEN: "Automated Equipment Operation",
    componentCode: "MF-E1",
    componentName: "조립/가공",
    jobFamily: "생산/제조",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 68,
    priority: "High",
  },
  {
    skillNameKR: "생산 라인 최적화",
    skillNameEN: "Production Line Optimization",
    componentCode: "MF-E1",
    componentName: "조립/가공",
    jobFamily: "생산/제조",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 55,
    priority: "Medium",
  },
  // 생산/제조 - 생산전략 (MF-D1)
  {
    skillNameKR: "스마트팩토리 전략 수립",
    skillNameEN: "Smart Factory Strategy",
    componentCode: "MF-D1",
    componentName: "생산전략",
    jobFamily: "생산/제조",
    accountabilityLevel: "Direct",
    skillType: "Hard Skill",
    coveragePct: 37,
    priority: "High",
  },
  // 영업/마케팅 - 고객관리 (SM-C1)
  {
    skillNameKR: "CRM 시스템 활용",
    skillNameEN: "CRM System Management",
    componentCode: "SM-C1",
    componentName: "고객관리",
    jobFamily: "영업/마케팅",
    accountabilityLevel: "Control",
    skillType: "Hard Skill",
    coveragePct: 71,
    priority: "High",
  },
  {
    skillNameKR: "고객 여정 분석",
    skillNameEN: "Customer Journey Analysis",
    componentCode: "SM-C1",
    componentName: "고객관리",
    jobFamily: "영업/마케팅",
    accountabilityLevel: "Control",
    skillType: "Hard Skill",
    coveragePct: 49,
    priority: "Medium",
  },
  // 영업/마케팅 - 영업실행 (SM-E1)
  {
    skillNameKR: "영업 협상 스킬",
    skillNameEN: "Sales Negotiation Skills",
    componentCode: "SM-E1",
    componentName: "영업실행",
    jobFamily: "영업/마케팅",
    accountabilityLevel: "Execute",
    skillType: "Soft Skill",
    coveragePct: 62,
    priority: "High",
  },
  // 운영/공급망 - 공급망전략 (SC-D1)
  {
    skillNameKR: "글로벌 공급망 설계",
    skillNameEN: "Global Supply Chain Design",
    componentCode: "SC-D1",
    componentName: "공급망전략",
    jobFamily: "운영/공급망",
    accountabilityLevel: "Direct",
    skillType: "Hard Skill",
    coveragePct: 43,
    priority: "High",
  },
  // 운영/공급망 - 물류관리 (SC-C1)
  {
    skillNameKR: "물류 네트워크 최적화",
    skillNameEN: "Logistics Network Optimization",
    componentCode: "SC-C1",
    componentName: "물류관리",
    jobFamily: "운영/공급망",
    accountabilityLevel: "Control",
    skillType: "Hard Skill",
    coveragePct: 56,
    priority: "Medium",
  },
  {
    skillNameKR: "창고관리시스템(WMS)",
    skillNameEN: "Warehouse Management System",
    componentCode: "SC-C1",
    componentName: "물류관리",
    jobFamily: "운영/공급망",
    accountabilityLevel: "Control",
    skillType: "Hard Skill",
    coveragePct: 73,
    priority: "Medium",
  },
  // 경영/전략 - 경영전략 (BS-D1)
  {
    skillNameKR: "전략 기획 수립",
    skillNameEN: "Strategic Planning",
    componentCode: "BS-D1",
    componentName: "경영전략",
    jobFamily: "경영/전략",
    accountabilityLevel: "Direct",
    skillType: "Hard Skill",
    coveragePct: 66,
    priority: "High",
  },
  {
    skillNameKR: "비즈니스 모델 혁신",
    skillNameEN: "Business Model Innovation",
    componentCode: "BS-D1",
    componentName: "경영전략",
    jobFamily: "경영/전략",
    accountabilityLevel: "Direct",
    skillType: "Soft Skill",
    coveragePct: 41,
    priority: "High",
  },
  // 경영/전략 - 리스크관리 (BS-C1)
  {
    skillNameKR: "리스크 평가 및 대응",
    skillNameEN: "Risk Assessment & Response",
    componentCode: "BS-C1",
    componentName: "리스크관리",
    jobFamily: "경영/전략",
    accountabilityLevel: "Control",
    skillType: "Hard Skill",
    coveragePct: 59,
    priority: "High",
  },
  // 재무/회계 - 재무전략 (FA-D1)
  {
    skillNameKR: "재무 모델링",
    skillNameEN: "Financial Modeling",
    componentCode: "FA-D1",
    componentName: "재무전략",
    jobFamily: "재무/회계",
    accountabilityLevel: "Direct",
    skillType: "Hard Skill",
    coveragePct: 54,
    priority: "High",
  },
  // 재무/회계 - 회계관리 (FA-C1)
  {
    skillNameKR: "IFRS 회계기준 적용",
    skillNameEN: "IFRS Accounting Standards",
    componentCode: "FA-C1",
    componentName: "회계관리",
    jobFamily: "재무/회계",
    accountabilityLevel: "Control",
    skillType: "Certification",
    coveragePct: 76,
    priority: "High",
  },
  {
    skillNameKR: "내부통제 시스템",
    skillNameEN: "Internal Control System",
    componentCode: "FA-C1",
    componentName: "회계관리",
    jobFamily: "재무/회계",
    accountabilityLevel: "Control",
    skillType: "Hard Skill",
    coveragePct: 61,
    priority: "Medium",
  },
  // 인사/조직 - 인사전략 (HR-D1)
  {
    skillNameKR: "인재 전략 수립",
    skillNameEN: "Talent Strategy Development",
    componentCode: "HR-D1",
    componentName: "인사전략",
    jobFamily: "인사/조직",
    accountabilityLevel: "Direct",
    skillType: "Hard Skill",
    coveragePct: 67,
    priority: "High",
  },
  // 인사/조직 - 인재개발 (HR-C1)
  {
    skillNameKR: "역량 모델 설계",
    skillNameEN: "Competency Model Design",
    componentCode: "HR-C1",
    componentName: "인재개발",
    jobFamily: "인사/조직",
    accountabilityLevel: "Control",
    skillType: "Hard Skill",
    coveragePct: 53,
    priority: "High",
  },
  {
    skillNameKR: "HRD 프로그램 기획",
    skillNameEN: "HRD Program Design",
    componentCode: "HR-C1",
    componentName: "인재개발",
    jobFamily: "인사/조직",
    accountabilityLevel: "Control",
    skillType: "Soft Skill",
    coveragePct: 48,
    priority: "Medium",
  },
  // 인사/조직 - 채용/배치 (HR-E1)
  {
    skillNameKR: "채용 면접 기법",
    skillNameEN: "Recruitment Interviewing",
    componentCode: "HR-E1",
    componentName: "채용/배치",
    jobFamily: "인사/조직",
    accountabilityLevel: "Execute",
    skillType: "Soft Skill",
    coveragePct: 70,
    priority: "Medium",
  },
  // 경영지원 - 경영기획 (GA-D1)
  {
    skillNameKR: "경영 성과 분석",
    skillNameEN: "Business Performance Analysis",
    componentCode: "GA-D1",
    componentName: "경영기획",
    jobFamily: "경영지원",
    accountabilityLevel: "Direct",
    skillType: "Hard Skill",
    coveragePct: 60,
    priority: "High",
  },
  // 경영지원 - 총무관리 (GA-C1)
  {
    skillNameKR: "시설 및 자산 관리",
    skillNameEN: "Facilities & Asset Management",
    componentCode: "GA-C1",
    componentName: "총무관리",
    jobFamily: "경영지원",
    accountabilityLevel: "Control",
    skillType: "Hard Skill",
    coveragePct: 82,
    priority: "Low",
  },
  // 경영지원 - 법무관리 (GA-C2)
  {
    skillNameKR: "계약 법무 검토",
    skillNameEN: "Contract Legal Review",
    componentCode: "GA-C2",
    componentName: "법무관리",
    jobFamily: "경영지원",
    accountabilityLevel: "Control",
    skillType: "Certification",
    coveragePct: 35,
    priority: "High",
  },
  // Cross-family soft skills
  {
    skillNameKR: "프로젝트 리더십",
    skillNameEN: "Project Leadership",
    componentCode: "TE-C2",
    componentName: "프로젝트관리",
    jobFamily: "기술/공학",
    accountabilityLevel: "Control",
    skillType: "Soft Skill",
    coveragePct: 57,
    priority: "High",
  },
  {
    skillNameKR: "이해관계자 커뮤니케이션",
    skillNameEN: "Stakeholder Communication",
    componentCode: "BS-D2",
    componentName: "사업개발",
    jobFamily: "경영/전략",
    accountabilityLevel: "Direct",
    skillType: "Soft Skill",
    coveragePct: 65,
    priority: "Medium",
  },
  {
    skillNameKR: "변화관리",
    skillNameEN: "Change Management",
    componentCode: "HR-C2",
    componentName: "조직개발",
    jobFamily: "인사/조직",
    accountabilityLevel: "Control",
    skillType: "Soft Skill",
    coveragePct: 44,
    priority: "High",
  },
  {
    skillNameKR: "데이터 기반 의사결정",
    skillNameEN: "Data-Driven Decision Making",
    componentCode: "IT-D1",
    componentName: "디지털전략",
    jobFamily: "IT/디지털",
    accountabilityLevel: "Direct",
    skillType: "Soft Skill",
    coveragePct: 50,
    priority: "High",
  },
  {
    skillNameKR: "검사 측정 기법",
    skillNameEN: "Inspection & Measurement",
    componentCode: "MF-E2",
    componentName: "검사/측정",
    jobFamily: "생산/제조",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 78,
    priority: "Medium",
  },
  {
    skillNameKR: "재고 정확도 관리",
    skillNameEN: "Inventory Accuracy Management",
    componentCode: "SC-E2",
    componentName: "재고관리",
    jobFamily: "운영/공급망",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 69,
    priority: "Low",
  },
  {
    skillNameKR: "급여 시스템 운영",
    skillNameEN: "Payroll System Operation",
    componentCode: "HR-E2",
    componentName: "급여/복리후생",
    jobFamily: "인사/조직",
    accountabilityLevel: "Execute",
    skillType: "Hard Skill",
    coveragePct: 87,
    priority: "Low",
  },
  {
    skillNameKR: "세무신고 및 절세전략",
    skillNameEN: "Tax Filing & Tax Planning",
    componentCode: "FA-C2",
    componentName: "세무관리",
    jobFamily: "재무/회계",
    accountabilityLevel: "Control",
    skillType: "Certification",
    coveragePct: 72,
    priority: "Medium",
  },
];

const FAMILIES = [
  "IT/디지털",
  "기술/공학",
  "생산/제조",
  "영업/마케팅",
  "운영/공급망",
  "경영/전략",
  "재무/회계",
  "인사/조직",
  "경영지원",
] as const;

const SKILL_TYPES = ["Hard Skill", "Soft Skill", "Certification"] as const;
const PRIORITIES = ["High", "Medium", "Low"] as const;

// ─── Badge Components ─────────────────────────────────────────────────────────

function SkillTypeBadge({ type }: { type: SkillRecord["skillType"] }) {
  const styles: Record<SkillRecord["skillType"], string> = {
    "Hard Skill": "bg-blue-100 text-blue-700 border border-blue-200",
    "Soft Skill": "bg-purple-100 text-purple-700 border border-purple-200",
    Certification: "bg-amber-100 text-amber-700 border border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${styles[type]}`}
    >
      {type}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: SkillRecord["priority"] }) {
  const styles: Record<SkillRecord["priority"], string> = {
    High: "bg-red-100 text-red-700 border border-red-200",
    Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Low: "bg-green-100 text-green-700 border border-green-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function AccountabilityBadge({
  level,
}: {
  level: SkillRecord["accountabilityLevel"];
}) {
  const styles: Record<SkillRecord["accountabilityLevel"], string> = {
    Direct: "bg-blue-600 text-white",
    Control: "bg-orange-500 text-white",
    Execute: "bg-green-600 text-white",
  };
  const labelKR: Record<SkillRecord["accountabilityLevel"], string> = {
    Direct: "전략수립",
    Control: "관리통제",
    Execute: "실행운영",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${styles[level]}`}
    >
      {level} · {labelKR[level]}
    </span>
  );
}

function CoverageBar({ pct }: { pct: number }) {
  const color =
    pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden min-w-[60px]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-neutral-600 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SkillSearchPage() {
  const [searchText, setSearchText] = useState("");
  const [skillTypeFilter, setSkillTypeFilter] = useState<string>("");
  const [jobFamilyFilter, setJobFamilyFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [results, setResults] = useState<SkillRecord[] | null>(null);

  function handleSearch() {
    const filtered = SKILL_DATA.filter((skill) => {
      const textMatch =
        searchText.trim() === "" ||
        skill.skillNameKR.includes(searchText.trim()) ||
        skill.skillNameEN.toLowerCase().includes(searchText.trim().toLowerCase());

      const typeMatch =
        skillTypeFilter === "" || skill.skillType === skillTypeFilter;

      const familyMatch =
        jobFamilyFilter === "" || skill.jobFamily === jobFamilyFilter;

      const priorityMatch =
        priorityFilter === "" || skill.priority === priorityFilter;

      return textMatch && typeMatch && familyMatch && priorityMatch;
    });
    setResults(filtered);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  // Group results by job family (preserving canonical order)
  const groupedResults: Record<string, SkillRecord[]> = {};
  if (results !== null) {
    for (const family of FAMILIES) {
      const inFamily = results.filter((s) => s.jobFamily === family);
      if (inFamily.length > 0) {
        groupedResults[family] = inFamily;
      }
    }
  }

  const totalResultCount = results !== null ? results.length : 0;
  const familyGroupCount = Object.keys(groupedResults).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2">
          <Link
            href="/pan-hr"
            className="hover:text-neutral-700 transition-colors"
          >
            Pan HR
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href="/pan-hr/skills"
            className="hover:text-neutral-700 transition-colors"
          >
            스킬관리
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">스킬 검색</span>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">스킬 검색</h1>
        <p className="text-sm text-neutral-600 mt-1">
          스킬명, 직군, 유형별로 BFM 스킬 프레임워크를 검색합니다
        </p>
      </div>

      {/* Search Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="w-4 h-4 text-blue-600" />
            검색 조건
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Text search */}
            <div className="flex gap-3">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="스킬명 검색 (한글 또는 영문)"
                className="flex-1 h-9 px-3 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-neutral-400"
              />
            </div>

            {/* Filter dropdowns + search button */}
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={skillTypeFilter}
                onChange={(e) => setSkillTypeFilter(e.target.value)}
                className="h-9 px-3 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-700"
              >
                <option value="">스킬 유형 전체</option>
                {SKILL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={jobFamilyFilter}
                onChange={(e) => setJobFamilyFilter(e.target.value)}
                className="h-9 px-3 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-700"
              >
                <option value="">직군 전체</option>
                {FAMILIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-9 px-3 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-700"
              >
                <option value="">우선순위 전체</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <Button onClick={handleSearch} className="h-9 px-6">
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>

              {results !== null && (
                <button
                  onClick={() => {
                    setSearchText("");
                    setSkillTypeFilter("");
                    setJobFamilyFilter("");
                    setPriorityFilter("");
                    setResults(null);
                  }}
                  className="h-9 px-4 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  초기화
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results === null ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <Search className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">검색 조건을 입력하고 검색 버튼을 누르세요</p>
          <p className="text-xs mt-1">
            전체 {SKILL_DATA.length}개 스킬 · {FAMILIES.length}개 직군
          </p>
        </div>
      ) : totalResultCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <Search className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">검색 결과가 없습니다</p>
          <p className="text-xs mt-1">다른 조건으로 다시 검색해 보세요</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Result summary */}
          <div className="flex items-center justify-between px-1 mb-4">
            <p className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">
                {totalResultCount}
              </span>
              개 스킬 검색됨 ·{" "}
              <span className="font-semibold text-neutral-900">
                {familyGroupCount}
              </span>
              개 직군
            </p>
          </div>

          {/* Grouped tables by job family */}
          {Object.entries(groupedResults).map(([family, skills]) => (
            <Card key={family} className="overflow-hidden">
              <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-800">
                  {family}
                </span>
                <span className="text-xs text-neutral-500">
                  {skills.length}개
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-neutral-500 border-b border-neutral-100">
                      <th className="text-left px-4 py-2 font-medium">
                        스킬명
                      </th>
                      <th className="text-left px-4 py-2 font-medium">
                        컴포넌트
                      </th>
                      <th className="text-left px-4 py-2 font-medium">
                        책임레벨
                      </th>
                      <th className="text-left px-4 py-2 font-medium">유형</th>
                      <th className="text-left px-4 py-2 font-medium">
                        보유율
                      </th>
                      <th className="text-left px-4 py-2 font-medium">
                        우선순위
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill, idx) => (
                      <tr
                        key={`${skill.componentCode}-${skill.skillNameEN}`}
                        className={
                          idx % 2 === 0
                            ? "bg-white"
                            : "bg-neutral-50/50"
                        }
                      >
                        <td className="px-4 py-2.5">
                          <div className="font-medium text-neutral-900">
                            {skill.skillNameKR}
                          </div>
                          <div className="text-xs text-neutral-400 mt-0.5">
                            {skill.skillNameEN}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="text-xs font-mono text-neutral-400">
                            {skill.componentCode}
                          </div>
                          <div className="text-xs text-neutral-600 mt-0.5">
                            {skill.componentName}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <AccountabilityBadge
                            level={skill.accountabilityLevel}
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <SkillTypeBadge type={skill.skillType} />
                        </td>
                        <td className="px-4 py-2.5 min-w-[120px]">
                          <CoverageBar pct={skill.coveragePct} />
                        </td>
                        <td className="px-4 py-2.5">
                          <PriorityBadge priority={skill.priority} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
