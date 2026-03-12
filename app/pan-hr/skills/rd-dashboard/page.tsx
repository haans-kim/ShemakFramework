"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Data ────────────────────────────────────────────────────

const BFM_FUNCTIONS = [
  { id: "F1", name: "R&D기획/전략", short: "R&D기획", color: "#1e3a5f", org: "연구개발기획조정실" },
  { id: "F2", name: "선행연구", short: "선행연구", color: "#1e40af", org: "중앙연구소" },
  { id: "F3", name: "미래기술", short: "미래기술", color: "#2563eb", org: "META·수소·배터리" },
  { id: "F4", name: "디자인", short: "디자인", color: "#7c3aed", org: "디자인센터" },
  { id: "F5", name: "차량설계/검증", short: "차량설계", color: "#6d28d9", org: "TVD 본부" },
  { id: "F6", name: "차량개발관리", short: "개발관리", color: "#059669", org: "차량개발관리" },
  { id: "F7", name: "SW/전자개발", short: "SW/전자", color: "#0891b2", org: "차량SW 담당" },
  { id: "F8", name: "상용차개발", short: "상용차", color: "#dc2626", org: "상용LCM 담당" },
  { id: "F9", name: "품질/안전", short: "품질/안전", color: "#ea580c", org: "통합안전품질" },
];

const LEVELS = [
  { id: "total", label: "전체 평균" },
  { id: "lv4", label: "Lv.4" },
  { id: "lv3", label: "Lv.3" },
  { id: "lv2", label: "Lv.2" },
  { id: "lv1", label: "Lv.1" },
];

interface ScoreData {
  score: number;
  hc: number;
  trend: "up" | "down" | "flat";
}

const BFM_SCORES: Record<string, ScoreData[]> = {
  F1: [{ score: 79, hc: 330, trend: "flat" }, { score: 88, hc: 63, trend: "up" }, { score: 82, hc: 94, trend: "up" }, { score: 76, hc: 110, trend: "flat" }, { score: 71, hc: 63, trend: "down" }],
  F2: [{ score: 74, hc: 1220, trend: "flat" }, { score: 85, hc: 220, trend: "up" }, { score: 78, hc: 375, trend: "up" }, { score: 71, hc: 405, trend: "flat" }, { score: 65, hc: 220, trend: "down" }],
  F3: [{ score: 72, hc: 700, trend: "up" }, { score: 83, hc: 125, trend: "up" }, { score: 76, hc: 220, trend: "up" }, { score: 70, hc: 235, trend: "flat" }, { score: 63, hc: 120, trend: "down" }],
  F4: [{ score: 81, hc: 1830, trend: "up" }, { score: 90, hc: 330, trend: "up" }, { score: 84, hc: 595, trend: "up" }, { score: 79, hc: 625, trend: "flat" }, { score: 72, hc: 280, trend: "flat" }],
  F5: [{ score: 76, hc: 3225, trend: "flat" }, { score: 87, hc: 530, trend: "up" }, { score: 79, hc: 1000, trend: "flat" }, { score: 73, hc: 1160, trend: "down" }, { score: 66, hc: 535, trend: "down" }],
  F6: [{ score: 73, hc: 770, trend: "flat" }, { score: 84, hc: 140, trend: "up" }, { score: 77, hc: 250, trend: "flat" }, { score: 70, hc: 250, trend: "flat" }, { score: 64, hc: 130, trend: "down" }],
  F7: [{ score: 78, hc: 2445, trend: "up" }, { score: 88, hc: 405, trend: "up" }, { score: 82, hc: 765, trend: "up" }, { score: 75, hc: 845, trend: "flat" }, { score: 68, hc: 430, trend: "flat" }],
  F8: [{ score: 70, hc: 1395, trend: "down" }, { score: 82, hc: 220, trend: "flat" }, { score: 74, hc: 440, trend: "flat" }, { score: 68, hc: 485, trend: "down" }, { score: 61, hc: 250, trend: "down" }],
  F9: [{ score: 75, hc: 2085, trend: "flat" }, { score: 86, hc: 345, trend: "up" }, { score: 79, hc: 655, trend: "up" }, { score: 73, hc: 735, trend: "flat" }, { score: 66, hc: 350, trend: "down" }],
};

const DESIGN_SUBS = [
  { id: "D1", name: "외장디자인", short: "외장", color: "#2563eb" },
  { id: "D2", name: "내장디자인", short: "내장", color: "#7c3aed" },
  { id: "D3", name: "CMF/컬러소재", short: "CMF", color: "#059669" },
  { id: "D4", name: "UI/UX디자인", short: "UI/UX", color: "#0891b2" },
  { id: "D5", name: "컨셉디자인", short: "컨셉", color: "#d97706" },
  { id: "D6", name: "상용디자인", short: "상용", color: "#dc2626" },
  { id: "D7", name: "글로벌디자인", short: "글로벌", color: "#6d28d9" },
  { id: "D8", name: "디자인기획", short: "기획", color: "#0f766e" },
  { id: "D9", name: "디지털디자인", short: "디지털", color: "#4338ca" },
  { id: "D10", name: "스타일링", short: "스타일링", color: "#be185d" },
];

const DESIGN_SCORES: Record<string, ScoreData[]> = {
  D1: [{ score: 84, hc: 335, trend: "up" }, { score: 93, hc: 56, trend: "up" }, { score: 87, hc: 112, trend: "up" }, { score: 80, hc: 112, trend: "flat" }, { score: 75, hc: 55, trend: "flat" }],
  D2: [{ score: 80, hc: 295, trend: "flat" }, { score: 89, hc: 50, trend: "up" }, { score: 83, hc: 98, trend: "flat" }, { score: 78, hc: 98, trend: "flat" }, { score: 70, hc: 49, trend: "down" }],
  D3: [{ score: 77, hc: 165, trend: "flat" }, { score: 87, hc: 28, trend: "up" }, { score: 81, hc: 55, trend: "up" }, { score: 74, hc: 55, trend: "flat" }, { score: 67, hc: 27, trend: "down" }],
  D4: [{ score: 82, hc: 195, trend: "up" }, { score: 91, hc: 35, trend: "up" }, { score: 85, hc: 63, trend: "up" }, { score: 79, hc: 62, trend: "up" }, { score: 72, hc: 35, trend: "flat" }],
  D5: [{ score: 79, hc: 125, trend: "up" }, { score: 89, hc: 21, trend: "up" }, { score: 82, hc: 42, trend: "up" }, { score: 76, hc: 42, trend: "flat" }, { score: 69, hc: 20, trend: "flat" }],
  D6: [{ score: 75, hc: 225, trend: "flat" }, { score: 85, hc: 35, trend: "flat" }, { score: 78, hc: 77, trend: "flat" }, { score: 72, hc: 77, trend: "down" }, { score: 65, hc: 36, trend: "down" }],
  D7: [{ score: 83, hc: 155, trend: "up" }, { score: 92, hc: 28, trend: "up" }, { score: 86, hc: 49, trend: "up" }, { score: 80, hc: 49, trend: "flat" }, { score: 73, hc: 29, trend: "flat" }],
  D8: [{ score: 76, hc: 85, trend: "flat" }, { score: 86, hc: 14, trend: "flat" }, { score: 79, hc: 28, trend: "up" }, { score: 74, hc: 29, trend: "flat" }, { score: 67, hc: 14, trend: "down" }],
  D9: [{ score: 80, hc: 110, trend: "up" }, { score: 90, hc: 21, trend: "up" }, { score: 83, hc: 35, trend: "up" }, { score: 78, hc: 33, trend: "flat" }, { score: 70, hc: 21, trend: "flat" }],
  D10: [{ score: 78, hc: 140, trend: "flat" }, { score: 88, hc: 28, trend: "up" }, { score: 81, hc: 42, trend: "flat" }, { score: 76, hc: 42, trend: "flat" }, { score: 68, hc: 28, trend: "down" }],
};

const JOB_DETAIL = {
  title: "상용디자인 디자이너",
  level: "Lv.3",
  grade: "과장 (G3)",
  headcount: 77,
  avgScore: 78,
  openReqs: 4,
  jd: {
    summary: "상용차(트럭·버스·특장차) 외장 및 내장 디자인을 독립적으로 수행하고, 양산 프로젝트 전 과정에 주도적으로 참여하는 역할입니다.",
    responsibilities: [
      "상용차 외장·내장 디자인 컨셉 수립 및 독립 수행",
      "양산 디자인 프로세스(Kick-Off ~ Sign-Off) 주관",
      "설계·생산기술 부서와의 기술협의 및 양산성 검토",
      "내부·경영진 디자인 품평 대응 및 발표",
      "글로벌 상용차 디자인 트렌드 분석 및 미래 방향 제안",
      "후배 디자이너 멘토링 및 업무 지도",
    ],
    requirements: [
      "상용차 또는 자동차 디자인 경력 5~8년",
      "Alias, VRED, 포토샵/일러스트레이터 활용 가능",
      "양산 디자인 프로젝트 1건 이상 완수 경험",
      "트럭·버스·특장차 디자인 이해 우대",
    ],
  },
  pp: {
    mission: "상용차(트럭·버스·특장차) 디자인 영역의 핵심 실무자로서, 양산 디자인 프로젝트를 독립적으로 주관하고 팀 역량 강화에 기여하는 중견 디자이너",
    successFactors: [
      "양산 디자인 프로세스(Kick-Off ~ Sign-Off) 전 과정 독립 수행",
      "설계·생산기술 유관 부서와의 기술협의 주도 능력",
      "내부 및 경영진 품평 독립 대응 및 발표 역량",
      "글로벌 상용차 디자인 트렌드 분석 및 미래 방향 제안",
      "주니어 디자이너 멘토링 및 팀 역량 개발 기여",
    ],
    background: [
      { label: "경력", value: "자동차·상용차 디자인 경력 5~8년" },
      { label: "프로젝트", value: "양산 디자인 프로젝트 완수 1건 이상" },
      { label: "툴 역량", value: "Alias, VRED, Photoshop/Illustrator 고급" },
      { label: "우대 경험", value: "트럭·버스·특장차 디자인 이해" },
    ],
    orgContext: [
      { role: "보고 라인", desc: "상용디자인팀장 (Lv.4)" },
      { role: "협업 부서", desc: "설계팀, 생산기술팀, R&D 기획팀" },
      { role: "지도 대상", desc: "주니어 디자이너 (Lv.1~2)" },
      { role: "성장 경로", desc: "핵심 실무 → 선임 디자이너 (Lv.4)" },
    ],
  },
  skills: [
    {
      category: "상용디자인 역량", color: "#dc2626",
      items: [
        { name: "상용차 외장 디자인", reqLevel: 3, kst: "S", desc: "트럭·버스 외장 컨셉 및 양산 디자인 수행" },
        { name: "상용차 내장 디자인", reqLevel: 3, kst: "K", desc: "운전석·캡 내장 공간 디자인 이해" },
        { name: "양산 디자인 프로세스", reqLevel: 3, kst: "K", desc: "Kick-Off~Sign-Off 전 과정 주관 경험" },
        { name: "차종별 규제·법규 이해", reqLevel: 2, kst: "K", desc: "상용차 안전·환경 규제 기본 이해" },
      ],
    },
    {
      category: "디자인 툴 활용", color: "#7c3aed",
      items: [
        { name: "Alias 3D 모델링", reqLevel: 3, kst: "T", desc: "Autodesk Alias 기반 서피스 모델링" },
        { name: "2D 디자인(PS/AI)", reqLevel: 4, kst: "T", desc: "포토샵·일러스트레이터 고급 활용" },
        { name: "VRED 비주얼라이제이션", reqLevel: 3, kst: "T", desc: "실시간 렌더링 및 디자인 검토" },
        { name: "프레젠테이션 제작", reqLevel: 3, kst: "T", desc: "PPT·동영상 기반 경영진 보고" },
      ],
    },
    {
      category: "프로젝트·협업 역량", color: "#059669",
      items: [
        { name: "디자인 품평 수행", reqLevel: 3, kst: "S", desc: "내부·경영진 품평 주관 및 발표" },
        { name: "설계·생기 협업", reqLevel: 3, kst: "S", desc: "양산성 확보를 위한 기술 협의" },
        { name: "프로젝트 일정 관리", reqLevel: 3, kst: "S", desc: "마일스톤 기반 디자인 일정 관리" },
      ],
    },
    {
      category: "핵심역량", color: "#0891b2",
      items: [
        { name: "창의적 사고", reqLevel: 3, kst: "S", desc: "상용차 특성을 반영한 혁신적 디자인 발상" },
        { name: "디테일 지향", reqLevel: 4, kst: "S", desc: "미세한 조형 차이 인지 및 완성도 추구" },
        { name: "자기주도성", reqLevel: 3, kst: "S", desc: "능동적 업무 추진 및 자기 개발" },
      ],
    },
  ],
  talent: {
    employees: [
      { name: "김지훈", level: "Lv.3", years: 8, score: 88, tags: ["수석급", "양산4건"] },
      { name: "최은서", level: "Lv.3", years: 5, score: 82, tags: ["선임", "CMF경험"] },
      { name: "정민준", level: "Lv.3", years: 3, score: 75, tags: ["신차TF"] },
    ],
    applicantsCurrent: 7,
    applicantsPast: 22,
    avgScore: 78,
    topScore: 88,
  },
};

const DESIGN_COMPETENCY_MAP = {
  roles: [
    { id: "ext", name: "외장디자인" }, { id: "int", name: "내장디자인" },
    { id: "cmf", name: "CMF디자인" }, { id: "ux", name: "UX/HMI디자인" },
    { id: "con", name: "콘셉트디자인" }, { id: "dig", name: "디지털디자인" },
    { id: "res", name: "디자인리서치" }, { id: "brd", name: "브랜드디자인" },
    { id: "mod", name: "모델링/목업" },
  ],
  levels: [
    { id: 5, sublabel: "Expert" }, { id: 4, sublabel: "Advanced" },
    { id: 3, sublabel: "Proficient" }, { id: 2, sublabel: "Foundational" },
    { id: 1, sublabel: "Awareness" },
  ],
  cells: {
    ext: {
      5: ["미래 외장 디자인 비전 및 전략 제시", "차세대 차량 외장 컨셉 총괄 개발", "글로벌 디자인 트렌드 선도 및 혁신"],
      4: ["외장 디자인 방향성 독립 수립", "브랜드 아이덴티티 외장 적용 전략", "글로벌 시장별 외장 디자인 전략"],
      3: null,
      2: ["외장 형태 분석 및 스케치 렌더링", "Alias Autostudio 기초~중급 활용", "시장·경쟁차 트렌드 조사"],
      1: ["자동차 외장 디자인 구성 요소 이해", "스케치 및 2D 드로잉 기초", "디자인 소프트웨어 기초"],
    },
    int: {
      5: ["미래 내장 공간 경험 비전 수립", "자율주행 시대 내장 패러다임 개발", "인간 중심 디자인 철학 체계화"],
      4: ["내장 전체 디자인 방향성 설정", "럭셔리/대중화 내장 전략 수립", "글로벌 협업 및 지역별 특화 전략"],
      3: null, 2: null,
      1: ["내장 구성 요소 및 명칭 이해", "인체공학 기초 개념 학습", "공간감 및 레이아웃 스케치 기초"],
    },
    cmf: {
      5: ["글로벌 CMF 트렌드 선도 및 혁신", "미래 지속가능 소재 전략 수립"],
      4: ["차량금속 CMF 전략 독립 수립", "브랜드 컬러 아이덴티티 관리"],
      3: ["차량 전체 CMF 패키지 독립 개발", "글로벌 트렌드 기반 컬러 기획", "소재 혁신 및 신소재 제안"],
      2: null,
      1: ["색채 이론 기초 학습", "소재(플라스틱·패브릭·금속) 종류 이해"],
    },
    ux: {
      5: ["미래 이동 경험(MX) 비전 수립", "자동주행 UX 패러다임 개발"],
      4: ["통합 차량 UX 전략 수립", "차량-모바일 연동 경험 설계"],
      3: ["HMI 통합 시스템 디자인 수행", "클러스터·CID 화면 독립 설계", "사용자 여정 맵 개발 및 적용"],
      2: null,
      1: ["UI/UX 기초 개념 및 원칙 학습", "Figma·XD 등 툴 기초 활용"],
    },
    con: {
      5: ["10년 이상 미래 모빌리티 비전 제시", "혁신적 이동 수단 패러다임 정의"],
      4: ["차량 미래 가치 및 철학 수립", "글로벌 소카 기획 및 실행"],
      3: ["풀 콘셉트카 내외장 독립 개발", "컨셉 스토리텔링 및 프레젠테이션"],
      2: ["컨셉 스케치 기초 기법 학습", "장르별 컨셉 스터디 수행"],
      1: ["컨셉 스케치 기초 기법 학습", "유명 컨셉카 사례 분석"],
    },
    dig: {
      5: ["메타버스 기반 디자인 프로세스 혁신", "AI 활용 차세대 디자인 방법론 개발"],
      4: ["디지털 협업 플랫폼 운영", "실시간 렌더링 품질 기준 수립"],
      3: ["Unreal Engine / V-Ray 실시간 렌더링", "AR/VR 활용 디자인 검증 수행"],
      2: ["포토리얼 렌더링 제작", "3D 시각화 기초~중급"],
      1: ["그래픽 디자인 기초 원칙 학습", "Adobe Photoshop·Illustrator 기초"],
    },
    res: { 5: null, 4: null, 3: null, 2: null, 1: null },
    brd: {
      5: ["브랜드 장기 비전 및 포지셔닝 수립", "미래 브랜드 생태계 전략 구축"],
      4: ["브랜드 캠페인 총괄 기획", "대내외 협력사 브랜드 협업 관리"],
      3: ["브랜드 캠페인 독립 수행", "서브브랜드 아이덴티티 개발"],
      2: ["전시·이벤트 그래픽 제작", "경쟁사 디자인 분석"],
      1: ["브랜드 아이덴티티 기초 이해", "로고·타이포그래피 원칙 학습"],
    },
    mod: {
      5: ["차세대 모델링 기술 혁신 전략", "글로벌 모델 제작 역량 총괄"],
      4: ["디자인-연구자 외부 연계 협업", "모델링 팀 리딩 및 방향 통솔"],
      3: ["클레이 풀사이즈 모델 독립 제작", "디지털 데이터 기반 목업 제작"],
      2: ["클레이 모델링 기초~중급", "스케일 모델 제작 보조"],
      1: ["스케일 모델 제작 보조 실습", "3D프린팅 기초 학습"],
    },
  } as Record<string, Record<number, string[] | null>>,
};

const DESIGN_AI_CELLS: Record<string, string[]> = {
  "ext-3": ["외장 풀패키지 디자인 독립 수행", "Alias Autostudio 고급 서피싱", "경쟁차 벤치마크 분석 및 적용"],
  "int-3": ["콕핏 레이아웃 독립 디자인 수행", "인터랙션 요소 디자인 개발", "HMI 레이아웃 내장 통합"],
  "int-2": ["내장 레이아웃 및 구성 요소 설계", "재료 특성 및 적용 범위 이해", "3D 모델링 기초~중급 활용"],
  "cmf-2": ["컬러 팔레트 및 테마 개발", "소재 샘플링 및 비교 분석", "CMF 트렌드 보드 구성"],
  "ux-2": ["와이어프레임 작성", "인터랙션 프로토타이핑", "사용성 테스트 보조 수행"],
  "res-5": ["미래 이동 라이프스타일 정의", "혁신적 리서치 방법론 개발", "글로벌 사용자 트렌드 예측 모델"],
  "res-4": ["글로벌 리서치 기획 및 수행", "미래 사용자 니즈 예측 모델 개발", "리서치-디자인 연계 체계 수립"],
  "res-3": ["리서치 기반 디자인 브리프 작성", "에스노그래픽·심층 인터뷰 수행", "경쟁사·트렌드 전략 인사이트 도출"],
  "res-2": ["사용자 인터뷰 설계 및 수행", "에스노그래픽 관찰 조사", "인사이트 도출 및 정리"],
  "res-1": ["리서치 방법론 기초 이해", "경쟁차·브랜드 분석 기초", "트렌드 자료 수집 및 정리"],
};

// ─── Helpers ─────────────────────────────────────────────────

const getScoreStyle = (score: number) => {
  if (score >= 80) return { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" };
  if (score >= 70) return { bg: "#dcfce7", color: "#15803d", border: "#86efac" };
  return { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" };
};

const getHCStyle = (hc: number, max: number) => {
  const ratio = max > 0 ? hc / max : 0;
  if (ratio >= 0.6) return { bg: "#1e40af", color: "white", border: "#1e3a8a" };
  if (ratio >= 0.35) return { bg: "#3b82f6", color: "white", border: "#2563eb" };
  if (ratio >= 0.15) return { bg: "#bfdbfe", color: "#1e40af", border: "#93c5fd" };
  return { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" };
};

const getTrend = (trend: string) => {
  if (trend === "up") return { icon: "▲", color: "#059669" };
  if (trend === "down") return { icon: "▼", color: "#dc2626" };
  return { icon: "●", color: "#94a3b8" };
};

const maxHCBFM = Math.max(...Object.values(BFM_SCORES).flatMap((rows) => rows.map((r) => r.hc)));
const maxHCDesign = Math.max(...Object.values(DESIGN_SCORES).flatMap((rows) => rows.map((r) => r.hc)));

// ─── Sub-Components ──────────────────────────────────────────

function KSTBadge({ type }: { type: string }) {
  const MAP: Record<string, { bg: string; color: string; label: string }> = {
    K: { bg: "#dbeafe", color: "#1d4ed8", label: "K" },
    S: { bg: "#dcfce7", color: "#15803d", label: "S" },
    T: { bg: "#fef3c7", color: "#b45309", label: "T" },
  };
  const s = MAP[type];
  if (!s) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 800, backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function LevelDots({ reqLevel }: { reqLevel: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: n <= reqLevel ? "#1e40af" : "#e2e8f0" }} />
      ))}
    </div>
  );
}

function ScoreCell({ data, mode, maxHC, onClick, highlight }: { data: ScoreData; mode: string; maxHC: number; onClick?: () => void; highlight?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const style = mode === "score" ? getScoreStyle(data.score) : getHCStyle(data.hc, maxHC);
  const { icon, color: tColor } = getTrend(data.trend);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "8px 4px", borderRadius: 6, minWidth: 72,
        backgroundColor: style.bg,
        border: `1px solid ${highlight ? "#f59e0b" : style.border}`,
        outline: highlight ? "2px solid #f59e0b" : hovered && onClick ? `2px solid ${style.color}` : "none",
        outlineOffset: 2, cursor: onClick ? "pointer" : "default", transition: "all 0.1s",
        transform: hovered && onClick ? "scale(1.04)" : "scale(1)",
      }}
    >
      {mode === "score" ? (
        <>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: style.color, lineHeight: 1, letterSpacing: -1 }}>{data.score}</span>
            <span style={{ fontSize: 9, color: tColor, marginTop: 2, lineHeight: 1 }}>{icon}</span>
          </div>
          <span style={{ fontSize: 9, color: style.color, opacity: 0.6, marginTop: 2 }}>{data.hc}명</span>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: style.color, lineHeight: 1 }}>{data.hc}</span>
            <span style={{ fontSize: 9, color: tColor, marginTop: 2, lineHeight: 1 }}>{icon}</span>
          </div>
          <span style={{ fontSize: 9, color: style.color, opacity: 0.6, marginTop: 2 }}>명</span>
        </>
      )}
    </div>
  );
}

function ModeToggle({ mode, setMode }: { mode: string; setMode: (m: string) => void }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-neutral-200">
      {[{ id: "score", label: "역량 점수" }, { id: "hc", label: "인원 현황" }].map((btn) => (
        <button
          key={btn.id}
          onClick={() => setMode(btn.id)}
          className={`px-3.5 py-1.5 text-xs font-semibold border-none cursor-pointer transition-all ${mode === btn.id ? "bg-neutral-900 text-white" : "bg-white text-neutral-500"}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

function ScoreLegend({ mode }: { mode: string }) {
  if (mode === "score") {
    return (
      <div className="flex gap-4 items-center">
        {[
          { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd", label: "상위 (80+)" },
          { bg: "#dcfce7", color: "#15803d", border: "#86efac", label: "중위 (70–79)" },
          { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5", label: "하위 (<70)" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div style={{ width: 13, height: 13, borderRadius: 3, backgroundColor: item.bg, border: `1.5px solid ${item.border}` }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: item.color }}>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-3 items-center">
      {[
        { bg: "#1e40af", label: "최다" }, { bg: "#3b82f6", label: "많음" },
        { bg: "#bfdbfe", label: "중간" }, { bg: "#eff6ff", label: "적음" },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: item.bg, border: "1px solid #93c5fd" }} />
          <span className="text-[10px] text-neutral-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

interface FuncItem { id: string; short: string; color: string; name?: string; org?: string }

function MatrixGrid({ functions, levels, scores, mode, maxHC, onCellClick, highlightFn }: {
  functions: FuncItem[];
  levels: { id: string; label: string }[];
  scores: Record<string, ScoreData[]>;
  mode: string;
  maxHC: number;
  onCellClick?: (fId: string, li: number) => void;
  highlightFn?: (fId: string, li: number) => boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table style={{ borderCollapse: "separate", borderSpacing: "4px", width: "100%" }}>
        <thead>
          <tr>
            <th className="px-3.5 py-2 text-left text-[11px] text-neutral-400" style={{ width: 80 }}>구분</th>
            {functions.map((f) => (
              <th key={f.id} className="px-1 py-1.5 text-center" style={{ minWidth: 76 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: f.color }}>{f.short}</div>
              </th>
            ))}
            <th className="px-1 py-1.5 text-center" style={{ minWidth: 76 }}>
              <div className="text-xs font-extrabold text-neutral-500">평균</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {levels.map((level, li) => {
            const rowAvgScore = Math.round(functions.reduce((s, f) => s + scores[f.id][li].score, 0) / functions.length);
            const rowTotalHC = functions.reduce((s, f) => s + scores[f.id][li].hc, 0);
            const rowAvgStyle = getScoreStyle(rowAvgScore);
            const rowHCStyle = getHCStyle(rowTotalHC, maxHC * levels.length);
            return (
              <tr key={level.id}>
                <td className={`px-3.5 py-1 whitespace-nowrap ${li === 0 ? "font-extrabold text-[13px] text-neutral-900 bg-neutral-50" : "font-semibold text-xs text-neutral-600"}`} style={{ borderRadius: 6 }}>
                  {level.label}
                </td>
                {functions.map((f) => {
                  const d = scores[f.id][li];
                  const isHL = highlightFn ? highlightFn(f.id, li) : false;
                  return (
                    <td key={f.id} className="p-1">
                      <ScoreCell data={d} mode={mode} maxHC={maxHC} highlight={isHL} onClick={onCellClick ? () => onCellClick(f.id, li) : undefined} />
                    </td>
                  );
                })}
                <td className="p-1">
                  {mode === "score" ? (
                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-md" style={{ minWidth: 72, backgroundColor: rowAvgStyle.bg, border: `1px solid ${rowAvgStyle.border}` }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: rowAvgStyle.color, lineHeight: 1, letterSpacing: -1 }}>{rowAvgScore}</span>
                      <span style={{ fontSize: 9, color: rowAvgStyle.color, opacity: 0.6, marginTop: 2 }}>평균</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-md" style={{ minWidth: 72, backgroundColor: rowHCStyle.bg, border: `1px solid ${rowHCStyle.border}` }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: rowHCStyle.color, lineHeight: 1 }}>{rowTotalHC}</span>
                      <span style={{ fontSize: 9, color: rowHCStyle.color, opacity: 0.6, marginTop: 2 }}>명 합계</span>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Screen Components ───────────────────────────────────────

function Screen1_BFMMatrix({ onCellClick }: { onCellClick: () => void }) {
  const [mode, setMode] = useState("score");
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-neutral-900">R&D 역량 현황 매트릭스</h2>
          <p className="text-xs text-neutral-500 mt-1">9개 BFM Function × 레벨별 역량 점수 / 인원 현황 · 셀 클릭 시 세부 직무 보기</p>
        </div>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>
      <div className="flex items-center justify-between mb-3 px-3.5 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
        <ScoreLegend mode={mode} />
        <div className="flex gap-3.5 items-center">
          <span className="text-[10px] text-emerald-600">▲ 상승</span>
          <span className="text-[10px] text-red-600">▼ 하락</span>
          <span className="text-[10px] text-neutral-400">● 유지</span>
          {mode === "score" && <span className="text-[11px] text-amber-500 font-bold">★ 디자인 Lv.3 클릭</span>}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <MatrixGrid functions={BFM_FUNCTIONS} levels={LEVELS} scores={BFM_SCORES} mode={mode} maxHC={maxHCBFM} onCellClick={onCellClick} highlightFn={(fId, li) => fId === "F4" && li === 2} />
      </div>
      <div className="flex gap-3 mt-3">
        {[
          { label: "전체 R&D 인원", value: "14,000명", color: "#1e40af" },
          { label: "평균 역량 점수", value: "75.4점", color: "#059669" },
          { label: "역량 우수 Function", value: "디자인 (81점)", color: "#7c3aed" },
          { label: "역량 개선 필요", value: "상용차 (70점)", color: "#dc2626" },
        ].map((item) => (
          <div key={item.label} className="flex-1 bg-white rounded-lg border border-neutral-200 px-3.5 py-2.5">
            <div className="text-[10px] text-neutral-400">{item.label}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: item.color, marginTop: 3 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen2_DesignMatrix({ onCellClick, onBack }: { onCellClick: () => void; onBack: () => void }) {
  const [mode, setMode] = useState("score");
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-neutral-200 bg-white cursor-pointer text-xs text-neutral-500 mb-2 hover:bg-neutral-50">← 전체 BFM으로</button>
          <h2 className="text-lg font-extrabold text-neutral-900">디자인 Function 세부 현황</h2>
          <p className="text-xs text-neutral-500 mt-1">10개 디자인 직무 × 레벨별 역량 점수 / 인원 현황 · 셀 클릭 시 직무 상세 보기</p>
        </div>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>
      <div className="flex items-center justify-between mb-3 px-3 py-2 bg-violet-50 rounded-lg border border-violet-200">
        <ScoreLegend mode={mode} />
        {mode === "score" && <span className="text-[10px] text-amber-500 font-bold">★ 상용디자인 Lv.3 클릭</span>}
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <MatrixGrid functions={DESIGN_SUBS} levels={LEVELS} scores={DESIGN_SCORES} mode={mode} maxHC={maxHCDesign} onCellClick={onCellClick} highlightFn={(fId, li) => fId === "D6" && li === 2} />
      </div>
      <div className="flex gap-3 mt-3">
        {[
          { label: "디자인 총 인원", value: "1,830명", color: "#7c3aed" },
          { label: "평균 역량 점수", value: "81.2점", color: "#059669" },
          { label: "역량 최우수", value: "외장디자인 (84점)", color: "#2563eb" },
          { label: "개선 필요", value: "상용디자인 (75점)", color: "#dc2626" },
        ].map((item) => (
          <div key={item.label} className="flex-1 bg-white rounded-lg border border-neutral-200 px-3.5 py-2.5">
            <div className="text-[10px] text-neutral-400">{item.label}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: item.color, marginTop: 3 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen3_JobDetail({ onBack, onGoStaffing }: { onBack: () => void; onGoStaffing: () => void }) {
  const [tab, setTab] = useState("map");
  const [aiGenerated, setAiGenerated] = useState<Record<string, string[]>>({});
  const d = JOB_DETAIL;
  const tabs = [
    { id: "map", label: "역량 맵핑" }, { id: "jd", label: "직무기술서 (JD)" },
    { id: "pp", label: "포지션 프로파일 (PP)" }, { id: "skill", label: "역량 요건" },
    { id: "talent", label: "인재 현황" },
  ];

  return (
    <div>
      <div className="mb-4">
        <button onClick={onBack} className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-neutral-200 bg-white cursor-pointer text-xs text-neutral-500 mb-2.5 hover:bg-neutral-50">← 디자인 세부로</button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-neutral-900">{d.title}</h2>
            <div className="flex gap-2 mt-1.5 items-center">
              <span className="px-2.5 py-0.5 rounded-xl bg-red-100 text-red-600 text-[11px] font-bold">{d.level}</span>
              <span className="px-2.5 py-0.5 rounded-xl bg-neutral-100 text-neutral-600 text-[11px] font-semibold">{d.grade}</span>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {[
              { label: "재직 인원", value: `${d.headcount}명`, color: "#1e40af" },
              { label: "평균 역량", value: `${d.avgScore}점`, color: "#059669" },
              { label: "채용 중", value: `${d.openReqs}건`, color: "#dc2626" },
            ].map((kpi) => (
              <div key={kpi.label} className="text-center px-4 py-2.5 bg-white rounded-xl border border-neutral-200">
                <div style={{ fontSize: 18, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">{kpi.label}</div>
              </div>
            ))}
            <button onClick={onGoStaffing} className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold cursor-pointer whitespace-nowrap hover:bg-neutral-800">
              채용 대시보드 →
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b-2 border-neutral-200 mb-5">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-[13px] bg-transparent cursor-pointer border-b-2 -mb-[2px] transition-all ${tab === t.id ? "font-extrabold text-neutral-900 border-neutral-900" : "font-medium text-neutral-400 border-transparent"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Competency Map Tab */}
      {tab === "map" && (() => {
        const missingCount = DESIGN_COMPETENCY_MAP.roles.reduce((acc, r) =>
          acc + DESIGN_COMPETENCY_MAP.levels.filter(lv => DESIGN_COMPETENCY_MAP.cells[r.id][lv.id] === null && !aiGenerated[`${r.id}-${lv.id}`]).length, 0);
        const totalCells = DESIGN_COMPETENCY_MAP.roles.length * DESIGN_COMPETENCY_MAP.levels.length;
        const definedCount = totalCells - missingCount - Object.keys(aiGenerated).length;
        return (
          <div>
            <div className="flex justify-between items-start mb-4 gap-4">
              <div>
                <div className="text-[13px] font-extrabold text-neutral-900 mb-1">디자인 직군 역량 정의 현황</div>
                <div className="text-[11px] text-neutral-500">채용 공고·내부 자료 기반 역량 정의 / 결측치는 IG AI 추론으로 보완 가능</div>
              </div>
              <div className="flex gap-2 shrink-0">
                {[
                  { label: "정의 완료", value: definedCount, bg: "#dbeafe", color: "#1e40af" },
                  { label: "결측", value: missingCount, bg: "#fef3c7", color: "#d97706" },
                  { label: "AI 생성", value: Object.keys(aiGenerated).length, bg: "#dcfce7", color: "#15803d" },
                ].map(s => (
                  <div key={s.label} className="text-center px-3.5 py-2 rounded-lg" style={{ backgroundColor: s.bg, minWidth: 68 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: s.color }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="border-collapse w-full" style={{ minWidth: 1050 }}>
                <thead>
                  <tr className="bg-neutral-900">
                    <th className="px-3 py-2.5 text-[11px] font-bold text-white text-left" style={{ minWidth: 80 }}>Level</th>
                    {DESIGN_COMPETENCY_MAP.roles.map(r => (
                      <th key={r.id} className="px-1.5 py-2.5 text-[11px] font-bold text-white text-center" style={{ minWidth: 100 }}>{r.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DESIGN_COMPETENCY_MAP.levels.map((lv, li) => (
                    <tr key={lv.id} className={`border-b border-neutral-200 ${li % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}>
                      <td className="px-3 py-2.5 align-top border-r border-neutral-200">
                        <div className="text-xs font-extrabold text-neutral-900">Lv.{lv.id}</div>
                        <div className="text-[10px] text-neutral-400">{lv.sublabel}</div>
                      </td>
                      {DESIGN_COMPETENCY_MAP.roles.map(r => {
                        const cellKey = `${r.id}-${lv.id}`;
                        const cell = DESIGN_COMPETENCY_MAP.cells[r.id][lv.id];
                        const generated = aiGenerated[cellKey];
                        if (!cell && !generated) {
                          return (
                            <td key={r.id} className="px-1.5 py-2 align-top bg-amber-50 border-r border-neutral-100">
                              <div className="flex flex-col items-start gap-1.5">
                                <span className="text-[10px] font-bold text-amber-800 px-1.5 py-px bg-amber-200 rounded-full">결측</span>
                                <button onClick={() => setAiGenerated(prev => ({ ...prev, [cellKey]: DESIGN_AI_CELLS[cellKey] ?? ["AI 추론 데이터 준비 중"] }))}
                                  className="text-[10px] px-2 py-0.5 bg-blue-700 text-white rounded-md cursor-pointer whitespace-nowrap hover:bg-blue-800">
                                  ✦ AI 생성
                                </button>
                              </div>
                            </td>
                          );
                        }
                        const items = generated ?? cell;
                        if (!items) return <td key={r.id} className="px-1.5 py-2 align-top border-r border-neutral-100" />;
                        return (
                          <td key={r.id} className={`px-1.5 py-2 align-top border-r border-neutral-100 ${generated ? "bg-green-50" : ""}`}>
                            {generated && <span className="text-[9px] font-bold text-emerald-700 px-1.5 py-px bg-emerald-100 rounded-lg inline-block mb-1">AI 생성</span>}
                            {items.map((skill, si) => (
                              <div key={si} className={`text-[10px] leading-snug mb-0.5 flex items-start gap-1 ${generated ? "text-emerald-800" : "text-neutral-700"}`}>
                                <span className="text-neutral-300 shrink-0 mt-px">·</span>
                                <span>{skill}</span>
                              </div>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-lg flex gap-2.5 items-start">
              <span className="text-[13px] shrink-0">⚠️</span>
              <div>
                <div className="text-[11px] font-bold text-amber-800 mb-0.5">결측치 발생 원인</div>
                <div className="text-[11px] text-amber-900 leading-relaxed">
                  최근 3년간 해당 직무의 채용 공고가 없어 역량 정의 원본 데이터가 부족합니다. IG 내부 DB와 현업 제공 데이터를 결합하여 <strong>AI 추론 생성으로 보완</strong>할 수 있습니다.
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* JD Tab */}
      {tab === "jd" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-sm font-extrabold text-neutral-900 mb-3">직무 개요</h3>
            <p className="text-[13px] text-neutral-600 leading-relaxed">{d.jd.summary}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-sm font-extrabold text-neutral-900 mb-3">자격 요건</h3>
            <ul className="pl-4.5 m-0">
              {d.jd.requirements.map((r, i) => (
                <li key={i} className="text-[13px] text-neutral-600 leading-8">{r}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5 col-span-2">
            <h3 className="text-sm font-extrabold text-neutral-900 mb-3">주요 직무·역할 (R&R)</h3>
            <div className="grid grid-cols-2 gap-2">
              {d.jd.responsibilities.map((r, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 bg-neutral-50 rounded-lg">
                  <span className="text-[13px] text-violet-600 font-extrabold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[13px] text-neutral-700 leading-relaxed">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PP Tab */}
      {tab === "pp" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-sm font-extrabold text-neutral-900 mb-2">포지션 미션</h3>
            <p className="text-xs text-neutral-700 leading-relaxed mb-5 px-3.5 py-2.5 bg-blue-50 rounded-lg border-l-[3px] border-blue-700">{d.pp.mission}</p>
            <h4 className="text-xs font-bold text-neutral-600 mb-2.5">핵심 성공 요소</h4>
            {d.pp.successFactors.map((sf, i) => (
              <div key={i} className="flex items-start gap-2 px-2.5 py-2 bg-neutral-50 rounded-md mb-1.5">
                <span className="text-xs text-blue-700 font-extrabold shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xs text-neutral-700 leading-relaxed">{sf}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <h3 className="text-sm font-extrabold text-neutral-900 mb-3">필요 경험·배경</h3>
              {d.pp.background.map((b, i) => (
                <div key={i} className={`flex gap-3 py-2 ${i < d.pp.background.length - 1 ? "border-b border-neutral-100" : ""}`}>
                  <span className="text-[11px] font-bold text-neutral-500 min-w-14 shrink-0 pt-px">{b.label}</span>
                  <span className="text-xs text-neutral-700">{b.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <h3 className="text-sm font-extrabold text-neutral-900 mb-3">조직 내 역할</h3>
              {d.pp.orgContext.map((o, i) => (
                <div key={i} className={`flex gap-3 py-2 ${i < d.pp.orgContext.length - 1 ? "border-b border-neutral-100" : ""}`}>
                  <span className="text-[11px] font-bold text-neutral-500 min-w-14 shrink-0 pt-px">{o.role}</span>
                  <span className="text-xs text-neutral-700">{o.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skills Tab */}
      {tab === "skill" && (
        <div className="grid grid-cols-2 gap-4">
          {d.skills.map((cat) => (
            <div key={cat.category} className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center gap-2 mb-3.5">
                <div className="w-1 h-4.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                <h3 className="text-[13px] font-extrabold" style={{ color: cat.color }}>{cat.category}</h3>
              </div>
              {cat.items.map((item, i) => (
                <div key={i} className={`py-2.5 ${i < cat.items.length - 1 ? "border-b border-neutral-100" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <KSTBadge type={item.kst} />
                    <span className="text-[13px] font-bold text-neutral-900">{item.name}</span>
                    <div className="ml-auto"><LevelDots reqLevel={item.reqLevel} /></div>
                  </div>
                  <div className="text-[11px] text-neutral-500">{item.desc}</div>
                </div>
              ))}
            </div>
          ))}
          <div className="col-span-2 flex gap-4 px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200">
            {[{ type: "K", label: "Knowledge", desc: "직무 수행에 필요한 지식" }, { type: "S", label: "Skill", desc: "실제 수행 능력과 기술" }, { type: "T", label: "Tool", desc: "활용 가능한 도구/시스템" }].map((kst) => (
              <div key={kst.type} className="flex items-center gap-2">
                <KSTBadge type={kst.type} />
                <span className="text-[11px] text-neutral-500"><b>{kst.label}</b> — {kst.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Talent Tab */}
      {tab === "talent" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-sm font-extrabold text-neutral-900 mb-4">재직자 현황</h3>
            <div className="flex gap-3 mb-4">
              {[
                { label: "재직 인원", value: `${d.talent.employees.length}명`, color: "#1e40af" },
                { label: "평균 역량", value: `${d.talent.avgScore}점`, color: "#059669" },
                { label: "최고 역량", value: `${d.talent.topScore}점`, color: "#7c3aed" },
              ].map((s) => (
                <div key={s.label} className="flex-1 text-center py-2.5 bg-neutral-50 rounded-lg">
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div className="text-[10px] text-neutral-400">{s.label}</div>
                </div>
              ))}
            </div>
            {d.talent.employees.map((emp, i) => {
              const sc = getScoreStyle(emp.score);
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-50 mb-2">
                  <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
                    <span className="text-[13px] font-extrabold text-white">{emp.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-neutral-900">{emp.name}</span>
                      <span className="text-[10px] text-neutral-500">{emp.level} · {emp.years}년</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {emp.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-px rounded bg-blue-100 text-blue-700 text-[9px] font-semibold">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg text-center" style={{ backgroundColor: sc.bg, border: `1px solid ${sc.border}` }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: sc.color }}>{emp.score}</div>
                    <div style={{ fontSize: 9, color: sc.color }}>역량점수</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-sm font-extrabold text-neutral-900 mb-4">채용 현황</h3>
            <div className="flex gap-3 mb-4">
              {[
                { label: "현재 지원자", value: `${d.talent.applicantsCurrent}명`, color: "#0891b2" },
                { label: "누적 지원자", value: `${d.talent.applicantsPast}명`, color: "#64748b" },
                { label: "채용 공고", value: `${d.openReqs}건`, color: "#dc2626" },
              ].map((s) => (
                <div key={s.label} className="flex-1 text-center py-2.5 bg-neutral-50 rounded-lg">
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div className="text-[10px] text-neutral-400">{s.label}</div>
                </div>
              ))}
            </div>
            <h4 className="text-xs font-bold text-neutral-600 mb-2.5">채용 파이프라인</h4>
            {[
              { stage: "서류 검토 중", count: 4, color: "#0891b2", bg: "#ecfeff" },
              { stage: "면접 예정", count: 2, color: "#7c3aed", bg: "#f5f3ff" },
              { stage: "최종 심사", count: 1, color: "#059669", bg: "#f0fdf4" },
            ].map((s) => (
              <div key={s.stage} className="flex items-center gap-3 px-3 py-2 rounded-lg mb-2" style={{ backgroundColor: s.bg }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-neutral-700 flex-1">{s.stage}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.count}명</span>
              </div>
            ))}
            <button onClick={onGoStaffing} className="w-full mt-4 py-3 rounded-xl bg-neutral-900 text-white text-[13px] font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-neutral-800">
              채용 현황 대시보드 전체 보기 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────

export default function RDDashboardPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<"bfm" | "design" | "job">("bfm");

  const breadcrumbs = [
    { id: "bfm" as const, label: "① BFM 매트릭스" },
    ...(screen === "design" || screen === "job" ? [{ id: "design" as const, label: "② 디자인 세부" }] : []),
    ...(screen === "job" ? [{ id: "job" as const, label: "③ 상용디자인 Lv.3" }] : []),
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Page Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-4">
          <Link href="/pan-hr" className="hover:text-neutral-700 transition-colors">Pan HR</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/pan-hr/skills" className="hover:text-neutral-700 transition-colors">스킬관리</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">R&D 역량대시보드</span>
        </div>
      </div>

      {/* Dashboard Header */}
      <div className="bg-neutral-900 px-7 py-3.5 flex items-center justify-between">
        <div>
          <div className="text-base font-black text-white tracking-tight">Automotive R&D 역량대시보드</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">BFM 기반 역량 분석 시스템 · 2025년 기준</div>
        </div>
        <div className="flex gap-1">
          {[
            { id: "bfm", label: "① BFM 현황" },
            { id: "design", label: "② 디자인 세부" },
            { id: "job", label: "③ 직무 상세" },
            { id: "recruit", label: "④ 채용 대시보드" },
          ].map((s) => (
            <button key={s.id}
              onClick={() => {
                if (s.id === "recruit") { router.push("/pan-hr/skills/staffing"); return; }
                setScreen(s.id as "bfm" | "design" | "job");
              }}
              className={`px-3.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-all ${screen === s.id ? "bg-white text-neutral-900 font-extrabold" : "bg-transparent text-neutral-400 font-medium hover:text-neutral-200"}`}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {breadcrumbs.map((bc, i) => (
            <span key={bc.id} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-neutral-600 text-xs">›</span>}
              <button onClick={() => setScreen(bc.id)}
                className={`bg-transparent cursor-pointer text-[11px] px-1 py-0.5 ${i === breadcrumbs.length - 1 ? "text-neutral-100 font-bold" : "text-neutral-500 font-normal"}`}>
                {bc.label}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-7 py-6">
        {screen === "bfm" && <Screen1_BFMMatrix onCellClick={() => setScreen("design")} />}
        {screen === "design" && <Screen2_DesignMatrix onCellClick={() => setScreen("job")} onBack={() => setScreen("bfm")} />}
        {screen === "job" && <Screen3_JobDetail onBack={() => setScreen("design")} onGoStaffing={() => router.push("/pan-hr/skills/staffing")} />}
      </div>
    </div>
  );
}
