"use client";

import { useState, useMemo } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

// ============================================================
// TYPES
// ============================================================

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  period: string;
  status: string;
  applicantsCurrent: number;
  applicantsPast: number;
  avgScore: number;
  topScore: number;
  categories: string[];
}

interface Skill {
  id: string;
  name: string;
  kst: "K" | "S" | "T";
  reqLevel: string;
  desc: string;
}

interface CompetencyCategory {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  skills: Skill[];
}

interface Applicant {
  id: string;
  name: string;
  status: string;
  applyDate: string;
  experience: number;
  education: string;
  scores: Record<string, number>;
  skillDetails: Record<string, number>;
  tags: string[];
}

// ============================================================
// DATA: Job Postings
// ============================================================

const jobPostings: JobPosting[] = [
  {
    id: "JOB-001", title: "외장 디자이너",
    department: "디자인", location: "남양연구소", type: "경력",
    period: "2025.02.11 ~ 채용시", status: "진행중",
    applicantsCurrent: 4, applicantsPast: 4, avgScore: 79, topScore: 88,
    categories: ["외장디자인", "디자인툴", "프로젝트수행", "글로벌협업", "디자인커뮤니케이션", "핵심역량"],
  },
  {
    id: "JOB-002", title: "파워트레인 제어 SW 개발",
    department: "연구개발", location: "남양연구소", type: "경력",
    period: "2025.02.05 ~ 채용시", status: "진행중",
    applicantsCurrent: 12, applicantsPast: 8, avgScore: 72, topScore: 91,
    categories: ["임베디드SW", "제어알고리즘", "AUTOSAR", "시뮬레이션", "협업", "핵심역량"],
  },
  {
    id: "JOB-003", title: "자율주행 인지 알고리즘 개발",
    department: "연구개발", location: "남양연구소", type: "경력",
    period: "2025.01.20 ~ 채용시", status: "진행중",
    applicantsCurrent: 9, applicantsPast: 15, avgScore: 68, topScore: 85,
    categories: ["딥러닝", "센서퓨전", "영상처리", "클라우드", "논문실적", "핵심역량"],
  },
  {
    id: "JOB-004", title: "차량 네트워크 설계",
    department: "전자개발", location: "남양연구소", type: "경력",
    period: "2025.02.01 ~ 2025.03.15", status: "진행중",
    applicantsCurrent: 6, applicantsPast: 3, avgScore: 74, topScore: 88,
    categories: ["CAN/LIN", "이더넷", "네트워크설계", "진단통신", "협업", "핵심역량"],
  },
  {
    id: "JOB-005", title: "배터리 시스템 설계",
    department: "연구개발", location: "의왕연구소", type: "경력",
    period: "2025.01.15 ~ 2025.02.28", status: "마감임박",
    applicantsCurrent: 18, applicantsPast: 22, avgScore: 71, topScore: 93,
    categories: ["배터리셀", "BMS", "열관리", "시뮬레이션", "안전규격", "핵심역량"],
  },
  {
    id: "JOB-006", title: "구매전략 기획",
    department: "구매", location: "서울 양재", type: "경력",
    period: "2024.12.15 ~ 2025.01.31", status: "마감",
    applicantsCurrent: 0, applicantsPast: 14, avgScore: 76, topScore: 89,
    categories: ["원가분석", "공급망관리", "협상전략", "글로벌소싱", "데이터분석", "핵심역량"],
  },
  {
    id: "JOB-007", title: "생산기술 (차체)",
    department: "생산", location: "울산공장", type: "경력",
    period: "2024.11.01 ~ 2024.12.20", status: "마감",
    applicantsCurrent: 0, applicantsPast: 9, avgScore: 70, topScore: 84,
    categories: ["용접기술", "자동화설비", "품질관리", "공정설계", "안전관리", "핵심역량"],
  },
];

// ============================================================
// DATA: Competency Framework for JOB-001
// ============================================================

const competencyFramework: CompetencyCategory[] = [
  {
    id: "C1", name: "외장디자인 역량", nameEn: "Exterior Design", color: "#2563eb",
    skills: [
      { id: "C1-01", name: "외장 컨셉 디자인", kst: "S", reqLevel: "L4", desc: "차량 외장 컨셉 빌드업 및 디자인 방향 수립" },
      { id: "C1-02", name: "양산 디자인 프로세스", kst: "K", reqLevel: "L4", desc: "Design Kick Off ~ Sign Off 전 과정 이해" },
      { id: "C1-03", name: "클레이 모델링 이해", kst: "K", reqLevel: "L3", desc: "클레이 모델 기반 디자인 완성도 향상 프로세스" },
      { id: "C1-04", name: "차종별 디자인 적용", kst: "S", reqLevel: "L3", desc: "승용/SUV/CUV/세단/미니밴/PBV/픽업트럭 디자인" },
      { id: "C1-05", name: "컨셉카 개발", kst: "S", reqLevel: "L3", desc: "모터쇼 출품용 컨셉카 디자인 개발" },
      { id: "C1-06", name: "디자인 트렌드 분석", kst: "K", reqLevel: "L3", desc: "자동차 디자인 트렌드 및 미래 방향성 분석" },
    ]
  },
  {
    id: "C2", name: "디자인 툴 활용", nameEn: "Design Tools", color: "#7c3aed",
    skills: [
      { id: "C2-01", name: "Alias 모델링", kst: "T", reqLevel: "L4", desc: "Autodesk Alias 기반 3D 서피스 모델링" },
      { id: "C2-02", name: "Blender 모델링", kst: "T", reqLevel: "L3", desc: "Blender 3D 모델링 및 동영상 제작" },
      { id: "C2-03", name: "VRED 비주얼라이제이션", kst: "T", reqLevel: "L3", desc: "VRED 기반 실시간 렌더링 및 VR" },
      { id: "C2-04", name: "2D 디자인 (PS/AI)", kst: "T", reqLevel: "L4", desc: "포토샵/일러스트레이터 활용 스케치 및 렌더링" },
      { id: "C2-05", name: "AI 디자인 도구", kst: "T", reqLevel: "L3", desc: "미드저니, 비즈컴 등 AI 기반 디자인 도구 활용" },
      { id: "C2-06", name: "프레젠테이션 제작", kst: "T", reqLevel: "L3", desc: "PPT 및 동영상 기반 디자인 프레젠테이션" },
    ]
  },
  {
    id: "C3", name: "프로젝트 수행", nameEn: "Project Execution", color: "#059669",
    skills: [
      { id: "C3-01", name: "디자인 프로젝트 관리", kst: "S", reqLevel: "L3", desc: "디자인 일정 및 마일스톤 관리" },
      { id: "C3-02", name: "디자인 품평 수행", kst: "S", reqLevel: "L4", desc: "내부/경영진 디자인 품평 대응 및 수행" },
      { id: "C3-03", name: "양산 출시 경험", kst: "K", reqLevel: "L3", desc: "양산차량의 시장 출시까지 전체 프로세스 경험" },
      { id: "C3-04", name: "설계/생기 협업", kst: "S", reqLevel: "L3", desc: "설계/생산기술 부서와의 기술적 협업" },
      { id: "C3-05", name: "디자인 개선 반복", kst: "S", reqLevel: "L4", desc: "피드백 기반 디지털/클레이 모델 반복 개선" },
    ]
  },
  {
    id: "C4", name: "글로벌 협업", nameEn: "Global Collaboration", color: "#dc2626",
    skills: [
      { id: "C4-01", name: "글로벌 컴피티션 참여", kst: "S", reqLevel: "L3", desc: "해외 스튜디오와의 디자인 경쟁 및 협업" },
      { id: "C4-02", name: "비즈니스 영어", kst: "S", reqLevel: "L3", desc: "영어 기반 디자인 커뮤니케이션 및 프레젠테이션" },
      { id: "C4-03", name: "해외 디자이너 협업", kst: "S", reqLevel: "L3", desc: "해외 스튜디오 디자이너들과 원격/현장 협업" },
      { id: "C4-04", name: "크로스컬처 소통", kst: "S", reqLevel: "L2", desc: "다문화 환경에서의 효과적 의사소통" },
    ]
  },
  {
    id: "C5", name: "디자인 커뮤니케이션", nameEn: "Design Communication", color: "#ea580c",
    skills: [
      { id: "C5-01", name: "디자인 스토리텔링", kst: "S", reqLevel: "L3", desc: "디자인 컨셉의 논리적 스토리 구성 및 전달" },
      { id: "C5-02", name: "비주얼 커뮤니케이션", kst: "S", reqLevel: "L4", desc: "시각적 자료를 통한 디자인 의도 전달" },
      { id: "C5-03", name: "디자인 문서화", kst: "S", reqLevel: "L3", desc: "디자인 가이드라인 및 스펙 문서 작성" },
      { id: "C5-04", name: "경영진 보고", kst: "S", reqLevel: "L3", desc: "경영진 대상 디자인 방향 보고 및 설득" },
    ]
  },
  {
    id: "C6", name: "핵심역량", nameEn: "Core Competencies", color: "#0891b2",
    skills: [
      { id: "C6-01", name: "창의적 사고", kst: "S", reqLevel: "L4", desc: "혁신적이고 도전적인 디자인 발상 능력" },
      { id: "C6-02", name: "문제 해결력", kst: "S", reqLevel: "L3", desc: "디자인/기술적 제약 내 최적 솔루션 도출" },
      { id: "C6-03", name: "팀워크", kst: "S", reqLevel: "L3", desc: "다기능 팀 내 협업 및 시너지 창출" },
      { id: "C6-04", name: "자기 주도성", kst: "S", reqLevel: "L3", desc: "능동적 업무 추진 및 자기 개발" },
      { id: "C6-05", name: "디테일 지향", kst: "S", reqLevel: "L4", desc: "미세한 조형 차이 인지 및 완성도 추구" },
    ]
  }
];

const gradeMatrix: Record<string, Record<string, boolean>> = {
  "L2": { G1: true, G2: true, G3: false, G4: false, G5: false },
  "L3": { G1: true, G2: true, G3: true, G4: false, G5: false },
  "L4": { G1: false, G2: true, G3: true, G4: true, G5: false },
  "L5": { G1: false, G2: false, G3: true, G4: true, G5: true },
};

const applicants: Applicant[] = [
  { id: "A001", name: "김도현", status: "현재지원", applyDate: "2025-02-15", experience: 5, education: "홍익대학교 산업디자인 석사", scores: { C1: 82, C2: 88, C3: 75, C4: 70, C5: 78, C6: 85 }, skillDetails: { "C1-01": 4, "C1-02": 4, "C1-03": 3, "C1-04": 4, "C1-05": 3, "C1-06": 4, "C2-01": 5, "C2-02": 4, "C2-03": 4, "C2-04": 5, "C2-05": 3, "C2-06": 4, "C3-01": 3, "C3-02": 4, "C3-03": 3, "C3-04": 3, "C3-05": 4, "C4-01": 3, "C4-02": 3, "C4-03": 3, "C4-04": 3, "C5-01": 4, "C5-02": 4, "C5-03": 3, "C5-04": 3, "C6-01": 4, "C6-02": 4, "C6-03": 4, "C6-04": 4, "C6-05": 4 }, tags: ["양산경험", "Alias상급", "모터쇼경험"] },
  { id: "A002", name: "박서연", status: "현재지원", applyDate: "2025-02-18", experience: 4, education: "국민대학교 자동차운송디자인 학사", scores: { C1: 78, C2: 92, C3: 68, C4: 65, C5: 82, C6: 80 }, skillDetails: { "C1-01": 4, "C1-02": 3, "C1-03": 3, "C1-04": 3, "C1-05": 4, "C1-06": 3, "C2-01": 5, "C2-02": 5, "C2-03": 4, "C2-04": 5, "C2-05": 5, "C2-06": 4, "C3-01": 3, "C3-02": 3, "C3-03": 2, "C3-04": 3, "C3-05": 3, "C4-01": 3, "C4-02": 3, "C4-03": 2, "C4-04": 3, "C5-01": 4, "C5-02": 4, "C5-03": 4, "C5-04": 3, "C6-01": 4, "C6-02": 3, "C6-03": 4, "C6-04": 4, "C6-05": 4 }, tags: ["AI도구상급", "Blender상급", "컨셉디자인"] },
  { id: "A003", name: "이정우", status: "현재지원", applyDate: "2025-02-19", experience: 7, education: "Art Center College of Design, Transportation Design MFA", scores: { C1: 92, C2: 85, C3: 88, C4: 90, C5: 86, C6: 88 }, skillDetails: { "C1-01": 5, "C1-02": 5, "C1-03": 4, "C1-04": 4, "C1-05": 5, "C1-06": 4, "C2-01": 4, "C2-02": 4, "C2-03": 4, "C2-04": 5, "C2-05": 3, "C2-06": 4, "C3-01": 4, "C3-02": 5, "C3-03": 4, "C3-04": 4, "C3-05": 4, "C4-01": 5, "C4-02": 5, "C4-03": 4, "C4-04": 4, "C5-01": 4, "C5-02": 5, "C5-03": 4, "C5-04": 4, "C6-01": 5, "C6-02": 4, "C6-03": 4, "C6-04": 4, "C6-05": 4 }, tags: ["해외경력", "양산3건", "글로벌협업"] },
  { id: "A004", name: "최하늘", status: "과거지원", applyDate: "2024-09-05", experience: 3, education: "서울대학교 산업디자인 학사", scores: { C1: 70, C2: 75, C3: 60, C4: 55, C5: 72, C6: 78 }, skillDetails: { "C1-01": 3, "C1-02": 3, "C1-03": 2, "C1-04": 3, "C1-05": 3, "C1-06": 3, "C2-01": 3, "C2-02": 4, "C2-03": 3, "C2-04": 4, "C2-05": 3, "C2-06": 3, "C3-01": 2, "C3-02": 3, "C3-03": 2, "C3-04": 2, "C3-05": 3, "C4-01": 2, "C4-02": 3, "C4-03": 2, "C4-04": 2, "C5-01": 3, "C5-02": 3, "C5-03": 3, "C5-04": 3, "C6-01": 4, "C6-02": 3, "C6-03": 4, "C6-04": 3, "C6-05": 3 }, tags: ["제품디자인경력", "포트폴리오우수"] },
  { id: "A005", name: "장민서", status: "과거지원", applyDate: "2024-06-12", experience: 6, education: "영국 Royal College of Art, Vehicle Design MA", scores: { C1: 88, C2: 80, C3: 82, C4: 88, C5: 90, C6: 82 }, skillDetails: { "C1-01": 5, "C1-02": 4, "C1-03": 4, "C1-04": 4, "C1-05": 4, "C1-06": 4, "C2-01": 4, "C2-02": 3, "C2-03": 4, "C2-04": 4, "C2-05": 3, "C2-06": 4, "C3-01": 4, "C3-02": 4, "C3-03": 4, "C3-04": 3, "C3-05": 4, "C4-01": 4, "C4-02": 5, "C4-03": 4, "C4-04": 4, "C5-01": 5, "C5-02": 5, "C5-03": 4, "C5-04": 4, "C6-01": 4, "C6-02": 4, "C6-03": 3, "C6-04": 4, "C6-05": 4 }, tags: ["해외학위", "컨셉카경험", "영어우수"] },
  { id: "A006", name: "윤재혁", status: "과거지원", applyDate: "2024-03-20", experience: 4, education: "KAIST 산업디자인 석사", scores: { C1: 74, C2: 82, C3: 70, C4: 60, C5: 75, C6: 76 }, skillDetails: { "C1-01": 3, "C1-02": 3, "C1-03": 3, "C1-04": 3, "C1-05": 3, "C1-06": 4, "C2-01": 4, "C2-02": 4, "C2-03": 3, "C2-04": 4, "C2-05": 4, "C2-06": 4, "C3-01": 3, "C3-02": 3, "C3-03": 3, "C3-04": 3, "C3-05": 3, "C4-01": 2, "C4-02": 3, "C4-03": 2, "C4-04": 3, "C5-01": 3, "C5-02": 4, "C5-03": 3, "C5-04": 3, "C6-01": 3, "C6-02": 4, "C6-03": 3, "C6-04": 3, "C6-05": 4 }, tags: ["AI도구경험", "데이터디자인"] },
  { id: "A007", name: "한소희", status: "과거지원", applyDate: "2023-11-08", experience: 8, education: "이태리 IED Torino, Transportation Design", scores: { C1: 90, C2: 78, C3: 90, C4: 92, C5: 85, C6: 86 }, skillDetails: { "C1-01": 5, "C1-02": 5, "C1-03": 4, "C1-04": 5, "C1-05": 4, "C1-06": 4, "C2-01": 4, "C2-02": 3, "C2-03": 4, "C2-04": 4, "C2-05": 2, "C2-06": 4, "C3-01": 5, "C3-02": 5, "C3-03": 4, "C3-04": 4, "C3-05": 4, "C4-01": 5, "C4-02": 5, "C4-03": 5, "C4-04": 4, "C5-01": 4, "C5-02": 4, "C5-03": 4, "C5-04": 4, "C6-01": 4, "C6-02": 4, "C6-03": 4, "C6-04": 5, "C6-05": 4 }, tags: ["해외OEM경력", "양산5건", "프로젝트리드"] },
  { id: "A008", name: "오준혁", status: "현재지원", applyDate: "2025-02-17", experience: 3, education: "홍익대학교 산업디자인 학사", scores: { C1: 65, C2: 78, C3: 55, C4: 50, C5: 68, C6: 75 }, skillDetails: { "C1-01": 3, "C1-02": 2, "C1-03": 2, "C1-04": 2, "C1-05": 3, "C1-06": 3, "C2-01": 3, "C2-02": 4, "C2-03": 3, "C2-04": 4, "C2-05": 4, "C2-06": 3, "C3-01": 2, "C3-02": 2, "C3-03": 2, "C3-04": 2, "C3-05": 3, "C4-01": 2, "C4-02": 2, "C4-03": 2, "C4-04": 2, "C5-01": 3, "C5-02": 3, "C5-03": 3, "C5-04": 2, "C6-01": 4, "C6-02": 3, "C6-03": 3, "C6-04": 3, "C6-05": 3 }, tags: ["제품디자인경력", "Blender활용"] },
  // 재직자 프로파일
  { id: "E001", name: "김지훈", status: "재직자", applyDate: "2017-03-06", experience: 8, education: "홍익대학교 산업디자인 학사", scores: { C1: 93, C2: 85, C3: 91, C4: 82, C5: 88, C6: 90 }, skillDetails: { "C1-01": 5, "C1-02": 5, "C1-03": 4, "C1-04": 5, "C1-05": 4, "C1-06": 5, "C2-01": 4, "C2-02": 4, "C2-03": 4, "C2-04": 5, "C2-05": 3, "C2-06": 4, "C3-01": 5, "C3-02": 5, "C3-03": 5, "C3-04": 4, "C3-05": 5, "C4-01": 4, "C4-02": 4, "C4-03": 4, "C4-04": 3, "C5-01": 4, "C5-02": 5, "C5-03": 4, "C5-04": 5, "C6-01": 5, "C6-02": 4, "C6-03": 4, "C6-04": 4, "C6-05": 5 }, tags: ["재직 8년", "수석디자이너", "양산리드"] },
  { id: "E002", name: "최은서", status: "재직자", applyDate: "2020-07-01", experience: 5, education: "이탈리아 IED Torino, Transportation Design", scores: { C1: 88, C2: 91, C3: 78, C4: 85, C5: 84, C6: 87 }, skillDetails: { "C1-01": 4, "C1-02": 4, "C1-03": 4, "C1-04": 4, "C1-05": 4, "C1-06": 4, "C2-01": 5, "C2-02": 4, "C2-03": 5, "C2-04": 5, "C2-05": 4, "C2-06": 4, "C3-01": 3, "C3-02": 4, "C3-03": 4, "C3-04": 3, "C3-05": 4, "C4-01": 4, "C4-02": 4, "C4-03": 4, "C4-04": 4, "C5-01": 4, "C5-02": 4, "C5-03": 4, "C5-04": 4, "C6-01": 4, "C6-02": 4, "C6-03": 4, "C6-04": 4, "C6-05": 5 }, tags: ["재직 5년", "선임디자이너", "컨셉카리드"] },
  { id: "E003", name: "정민준", status: "재직자", applyDate: "2022-04-04", experience: 3, education: "국민대학교 자동차운송디자인 학사", scores: { C1: 80, C2: 84, C3: 72, C4: 70, C5: 76, C6: 82 }, skillDetails: { "C1-01": 3, "C1-02": 4, "C1-03": 3, "C1-04": 4, "C1-05": 3, "C1-06": 3, "C2-01": 4, "C2-02": 4, "C2-03": 3, "C2-04": 4, "C2-05": 4, "C2-06": 4, "C3-01": 3, "C3-02": 4, "C3-03": 3, "C3-04": 3, "C3-05": 3, "C4-01": 3, "C4-02": 3, "C4-03": 3, "C4-04": 3, "C5-01": 3, "C5-02": 4, "C5-03": 3, "C5-04": 3, "C6-01": 4, "C6-02": 3, "C6-03": 4, "C6-04": 4, "C6-05": 4 }, tags: ["재직 3년", "디자이너", "신차TF"] },
];

// ============================================================
// HELPERS
// ============================================================

const WEIGHTS: Record<string, number> = { C1: 0.25, C2: 0.20, C3: 0.18, C4: 0.12, C5: 0.12, C6: 0.13 };

const getOverallScore = (scores: Record<string, number>): number =>
  Math.round(Object.entries(scores).reduce((s, [k, v]) => s + v * (WEIGHTS[k] || 0), 0));

const getGrade = (score: number) => {
  if (score >= 90) return { grade: "S", color: "#7c3aed", bg: "#ede9fe" };
  if (score >= 80) return { grade: "A", color: "#2563eb", bg: "#dbeafe" };
  if (score >= 70) return { grade: "B", color: "#059669", bg: "#d1fae5" };
  if (score >= 60) return { grade: "C", color: "#ea580c", bg: "#ffedd5" };
  return { grade: "D", color: "#dc2626", bg: "#fee2e2" };
};

const getLevelNum = (lvl: string): number => parseInt(lvl.replace("L", ""));

const getGapColor = (a: number, r: number): string => {
  const d = a - r;
  if (d >= 1) return "#059669";
  if (d === 0) return "#2563eb";
  if (d === -1) return "#ea580c";
  return "#dc2626";
};

// ============================================================
// SMALL COMPONENTS
// ============================================================

function KSTBadge({ type }: { type: "K" | "S" | "T" }) {
  const c = { K: { bg: "#dbeafe", color: "#2563eb", border: "#93c5fd" }, S: { bg: "#d1fae5", color: "#059669", border: "#6ee7b7" }, T: { bg: "#ede9fe", color: "#7c3aed", border: "#c4b5fd" } }[type];
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 4, fontSize: 11, fontWeight: 700, backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{type}</span>;
}

function LevelDots({ level, actual }: { level: string; actual?: number }) {
  const req = getLevelNum(level);
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: "50%",
          backgroundColor: actual !== undefined
            ? (i <= actual ? (i <= req ? "#2563eb" : "#059669") : (i <= req ? "#fbbf24" : "#e5e7eb"))
            : (i <= req ? "#1e293b" : "#e5e7eb"),
          border: actual !== undefined && i === req ? "2px solid #1e293b" : "1px solid #cbd5e1",
        }} />
      ))}
    </div>
  );
}

function ScoreBadge({ score, size = "md" }: { score: number; size?: "md" | "lg" }) {
  const { grade, color, bg } = getGrade(score);
  const s = size === "lg" ? { w: 52, h: 52, fs: 20, gs: 11 } : { w: 36, h: 36, fs: 14, gs: 9 };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: s.w, height: s.h, borderRadius: 8, backgroundColor: bg, border: `2px solid ${color}` }}>
      <span style={{ fontSize: s.fs, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
      <span style={{ fontSize: s.gs, fontWeight: 600, color, opacity: 0.7, lineHeight: 1 }}>{grade}</span>
    </div>
  );
}

// ============================================================
// PAGE: Job Listing (Landing)
// ============================================================

function JobListingPage({ onSelectJob }: { onSelectJob: (id: string) => void }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return jobPostings;
    return jobPostings.filter(j => j.status === statusFilter);
  }, [statusFilter]);

  const totalApplicants = jobPostings.reduce((s, j) => s + j.applicantsCurrent + j.applicantsPast, 0);
  const activeJobs = jobPostings.filter(j => j.status === "진행중").length;

  return (
    <div style={{ fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#0f172a" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)", padding: "32px 40px 28px", color: "white" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: 2.5, textTransform: "uppercase" }}>BFM-Based Recruitment Assessment System</div>
              <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Staffing 대시보드</h1>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "8px 0 0 58px", maxWidth: 640, lineHeight: 1.6 }}>
            BFM 기반 직군/컴포넌트/책임레벨/Job별 스킬을 구조화하여, 채용 공고의 요구역량을 K/S/T로 분류하고
            지원자 보유 역량과의 Gap 분석 및 종합 스코어링을 제공합니다.
          </p>
          {/* Summary Cards */}
          <div style={{ display: "flex", gap: 16, marginTop: 24, marginLeft: 58 }}>
            {[
              { label: "진행중 공고", value: activeJobs, unit: "건", accent: "#3b82f6" },
              { label: "전체 공고", value: jobPostings.length, unit: "건", accent: "#8b5cf6" },
              { label: "총 지원자 (현재+과거)", value: totalApplicants, unit: "명", accent: "#06b6d4" },
              { label: "평균 매칭 스코어", value: Math.round(jobPostings.reduce((s, j) => s + j.avgScore, 0) / jobPostings.length), unit: "점", accent: "#10b981" },
            ].map((card, i) => (
              <div key={i} style={{ padding: "14px 20px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", minWidth: 150 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{card.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: card.accent }}>{card.value}</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{card.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + List */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 40px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginRight: 4 }}>상태</span>
          {["all", "진행중", "마감임박", "마감"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, border: "1px solid", borderRadius: 6, cursor: "pointer", transition: "all 0.15s", backgroundColor: statusFilter === f ? "#0f172a" : "white", color: statusFilter === f ? "white" : "#64748b", borderColor: statusFilter === f ? "#0f172a" : "#e2e8f0" }}>{f === "all" ? "전체" : f}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {filtered.map(job => {
            const sc = { "진행중": { bg: "#dbeafe", color: "#2563eb", dot: "#3b82f6" }, "마감임박": { bg: "#fef3c7", color: "#d97706", dot: "#f59e0b" }, "마감": { bg: "#f1f5f9", color: "#94a3b8", dot: "#cbd5e1" } }[job.status] || { bg: "#f1f5f9", color: "#94a3b8", dot: "#cbd5e1" };
            const total = job.applicantsCurrent + job.applicantsPast;
            const clickable = job.id === "JOB-001";
            return (
              <div key={job.id} onClick={() => clickable && onSelectJob(job.id)}
                style={{ padding: "20px 24px", borderRadius: 14, backgroundColor: "white", border: "1px solid #e2e8f0", cursor: clickable ? "pointer" : "default", transition: "all 0.2s", position: "relative", overflow: "hidden", opacity: clickable ? 1 : 0.85 }}
                onMouseEnter={e => { if (clickable) { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.1)"; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: clickable ? "linear-gradient(90deg, #2563eb, #7c3aed)" : "#e2e8f0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, backgroundColor: sc.bg, color: sc.color, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: sc.dot }} />{job.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>{job.title}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{job.department} · {job.location} · {job.type}</div>
                    </div>
                  </div>
                  {clickable && <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>→</div>}
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>지원자</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{total}<span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>명</span></div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>현재 {job.applicantsCurrent} · 과거 {job.applicantsPast}</div>
                  </div>
                  <div style={{ width: 1, backgroundColor: "#f1f5f9" }} />
                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>평균 스코어</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}><span style={{ fontSize: 18, fontWeight: 800, color: getGrade(job.avgScore).color }}>{job.avgScore}</span><span style={{ fontSize: 11, fontWeight: 600, color: getGrade(job.avgScore).color }}>{getGrade(job.avgScore).grade}</span></div>
                  </div>
                  <div style={{ width: 1, backgroundColor: "#f1f5f9" }} />
                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>최고 스코어</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}><span style={{ fontSize: 18, fontWeight: 800, color: getGrade(job.topScore).color }}>{job.topScore}</span><span style={{ fontSize: 11, fontWeight: 600, color: getGrade(job.topScore).color }}>{getGrade(job.topScore).grade}</span></div>
                  </div>
                  <div style={{ width: 1, backgroundColor: "#f1f5f9" }} />
                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>모집기간</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginTop: 4 }}>{job.period}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {job.categories.map((cat, i) => (
                    <span key={cat} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 5, fontWeight: 500, backgroundColor: ["#eff6ff", "#f5f3ff", "#ecfdf5", "#fef2f2", "#fff7ed", "#ecfeff"][i % 6], color: ["#2563eb", "#7c3aed", "#059669", "#dc2626", "#ea580c", "#0891b2"][i % 6] }}>{cat}</span>
                  ))}
                </div>
                {!clickable && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 10, fontStyle: "italic" }}>데모: 외장 디자이너 공고만 상세 진입 가능</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: Job Detail Dashboard
// ============================================================

function JobDetailPage({ onBack }: { onBack: () => void }) {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const filteredApplicants = useMemo(() => {
    let list = [...applicants];
    if (filterStatus !== "all") list = list.filter(a => a.status === filterStatus);
    list.sort((a, b) => {
      if (sortBy === "score") return getOverallScore(b.scores) - getOverallScore(a.scores);
      if (sortBy === "experience") return b.experience - a.experience;
      return new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime();
    });
    return list;
  }, [filterStatus, sortBy]);

  const radarData = useMemo(() =>
    selectedApplicant ? competencyFramework.map(c => ({ category: c.name, score: selectedApplicant.scores[c.id], fullMark: 100 })) : [],
    [selectedApplicant]
  );

  const gapData = useMemo(() =>
    selectedApplicant ? competencyFramework.flatMap(cat =>
      cat.skills.map(skill => ({
        skillName: skill.name,
        category: cat.name,
        required: getLevelNum(skill.reqLevel),
        actual: selectedApplicant.skillDetails[skill.id] || 0,
        gap: (selectedApplicant.skillDetails[skill.id] || 0) - getLevelNum(skill.reqLevel),
      }))
    ) : [],
    [selectedApplicant]
  );

  return (
    <div style={{ fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#0f172a" }}>
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)", padding: "20px 32px 16px", color: "white" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 12, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94a3b8"; }}
          >← 전체 공고 목록</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase" }}>Exterior Design · 경력채용</div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>외장 디자이너 — 역량 매칭 대시보드</h1>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
            <span>남양연구소 · 디자인</span><span>2025.02.11 ~ 채용시</span>
            <span>재직자 {applicants.filter(a => a.status === "재직자").length}명 · 현재지원 {applicants.filter(a => a.status === "현재지원").length}명 · 과거지원 {applicants.filter(a => a.status === "과거지원").length}명</span>
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 14 }}>
            {[{ id: "overview", label: "종합 대시보드" }, { id: "framework", label: "역량 프레임워크" }, { id: "compare", label: "비교 분석" }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", borderRadius: "8px 8px 0 0", backgroundColor: activeTab === tab.id ? "#f8fafc" : "rgba(255,255,255,0.08)", color: activeTab === tab.id ? "#0f172a" : "#94a3b8", transition: "all 0.2s" }}>{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: 1440, margin: "0 auto" }}>
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 }}>
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {["all", "재직자", "현재지원", "과거지원"].map(f => (
                  <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, border: "1px solid", borderRadius: 6, cursor: "pointer", backgroundColor: filterStatus === f ? "#0f172a" : "white", color: filterStatus === f ? "white" : "#64748b", borderColor: filterStatus === f ? "#0f172a" : "#e2e8f0" }}>{f === "all" ? "전체" : f}</button>
                ))}
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ marginLeft: "auto", padding: "6px 10px", fontSize: 12, borderRadius: 6, border: "1px solid #e2e8f0", color: "#64748b" }}>
                  <option value="score">점수순</option><option value="experience">경력순</option><option value="date">지원일순</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredApplicants.map(a => {
                  const overall = getOverallScore(a.scores);
                  const isSel = selectedApplicant?.id === a.id;
                  return (
                    <div key={a.id} onClick={() => setSelectedApplicant(a)} style={{ padding: "14px 16px", borderRadius: 10, cursor: "pointer", backgroundColor: isSel ? "#f0f9ff" : "white", border: `2px solid ${isSel ? "#2563eb" : "#e2e8f0"}`, transition: "all 0.15s", boxShadow: isSel ? "0 0 0 3px rgba(37,99,235,0.1)" : "0 1px 3px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 15, fontWeight: 700 }}>{a.name}</span>
                            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, backgroundColor: a.status === "현재지원" ? "#dbeafe" : a.status === "재직자" ? "#d1fae5" : "#f1f5f9", color: a.status === "현재지원" ? "#2563eb" : a.status === "재직자" ? "#059669" : "#64748b" }}>{a.status}</span>
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{a.education} · 경력 {a.experience}년</div>
                        </div>
                        <ScoreBadge score={overall} />
                      </div>
                      <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                        {competencyFramework.map(c => (
                          <div key={c.id} style={{ flex: 1 }}><div style={{ height: 4, borderRadius: 2, backgroundColor: "#e2e8f0", overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, width: `${a.scores[c.id]}%`, backgroundColor: c.color }} /></div></div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                        {a.tags.map(t => <span key={t} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, backgroundColor: "#f1f5f9", color: "#475569", fontWeight: 500 }}>{t}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              {selectedApplicant ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ padding: "20px 24px", borderRadius: 12, backgroundColor: "white", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{selectedApplicant.name}</h2>
                          <span style={{ fontSize: 13, color: "#64748b" }}>{selectedApplicant.id}</span>
                        </div>
                        <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{selectedApplicant.education} · 경력 {selectedApplicant.experience}년 · 지원일 {selectedApplicant.applyDate}</div>
                      </div>
                      <ScoreBadge score={getOverallScore(selectedApplicant.scores)} size="lg" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
                      {competencyFramework.map(c => (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>{c.name}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{selectedApplicant.scores[c.id]}</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, backgroundColor: "#f1f5f9" }}><div style={{ height: "100%", borderRadius: 3, backgroundColor: c.color, width: `${selectedApplicant.scores[c.id]}%` }} /></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: "white", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700 }}>역량 프로파일</h3>
                      <ResponsiveContainer width="100%" height={240}>
                        <RadarChart data={radarData}><PolarGrid stroke="#e2e8f0" /><PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748b" }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} /><Radar name="점수" dataKey="score" stroke="#94a3b8" fill="#9ca3af" fillOpacity={0.4} strokeWidth={2} /></RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: "white", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>역량 Gap 요약</h3>
                      {(() => {
                        const gaps = gapData.filter(g => g.gap < 0).sort((a, b) => a.gap - b.gap).slice(0, 6);
                        const strengths = gapData.filter(g => g.gap > 0).sort((a, b) => b.gap - a.gap).slice(0, 4);
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 2 }}>보완 필요 영역</div>
                            {gaps.length === 0 && <div style={{ fontSize: 12, color: "#94a3b8" }}>없음</div>}
                            {gaps.map(g => <div key={g.skillName} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}><span style={{ width: 24, height: 18, borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, backgroundColor: "#fee2e2", color: "#dc2626" }}>{g.gap}</span><span style={{ color: "#475569", flex: 1 }}>{g.skillName}</span><span style={{ fontSize: 10, color: "#94a3b8" }}>L{g.actual}→L{g.required}</span></div>)}
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginTop: 8, marginBottom: 2 }}>강점 영역</div>
                            {strengths.map(g => <div key={g.skillName} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}><span style={{ width: 24, height: 18, borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, backgroundColor: "#d1fae5", color: "#059669" }}>+{g.gap}</span><span style={{ color: "#475569", flex: 1 }}>{g.skillName}</span><span style={{ fontSize: 10, color: "#94a3b8" }}>L{g.actual}/L{g.required}</span></div>)}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: "white", border: "1px solid #e2e8f0" }}>
                    <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>세부 직무역량 매칭 분석</h3>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead><tr style={{ backgroundColor: "#f8fafc" }}>
                          {["대표역량", "직무역량 (세부)", "K/S/T", "요구수준", "보유수준", "Gap", "Grade 습득단계"].map((h, i) => (
                            <th key={h} style={{ padding: "8px 10px", textAlign: i < 2 ? "left" : "center", borderBottom: "2px solid #e2e8f0", fontSize: 11, color: "#64748b", fontWeight: 600 }}>{h}</th>
                          ))}
                        </tr></thead>
                        <tbody>
                          {competencyFramework.map(cat => cat.skills.map((skill, si) => {
                            const actual = selectedApplicant.skillDetails[skill.id] || 0;
                            const required = getLevelNum(skill.reqLevel);
                            const gap = actual - required;
                            const gm = gradeMatrix[skill.reqLevel] || gradeMatrix["L3"];
                            return (
                              <tr key={skill.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: si === 0 ? "#fafbfc" : "transparent" }}>
                                <td style={{ padding: "7px 10px", fontWeight: si === 0 ? 700 : 400, color: si === 0 ? cat.color : "#94a3b8", fontSize: si === 0 ? 12 : 11 }}>{si === 0 ? cat.name : ""}</td>
                                <td style={{ padding: "7px 10px", fontWeight: 500 }}>{skill.name}</td>
                                <td style={{ padding: "7px 6px", textAlign: "center" }}><KSTBadge type={skill.kst} /></td>
                                <td style={{ padding: "7px 6px", textAlign: "center" }}><LevelDots level={skill.reqLevel} /></td>
                                <td style={{ padding: "7px 6px", textAlign: "center" }}><LevelDots level={skill.reqLevel} actual={actual} /></td>
                                <td style={{ padding: "7px 6px", textAlign: "center" }}><span style={{ fontSize: 11, fontWeight: 700, color: getGapColor(actual, required) }}>{gap > 0 ? `+${gap}` : gap}</span></td>
                                <td style={{ padding: "7px 10px" }}><div style={{ display: "flex", gap: 3, justifyContent: "center" }}>{["G1", "G2", "G3", "G4", "G5"].map(g => <div key={g} style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: gm[g] ? "#0f172a" : "#e5e7eb" }} />)}</div></td>
                              </tr>
                            );
                          }))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, borderRadius: 12, backgroundColor: "white", border: "2px dashed #e2e8f0", color: "#94a3b8", fontSize: 14 }}>← 좌측에서 지원자를 선택하세요</div>
              )}
            </div>
          </div>
        )}

        {/* FRAMEWORK */}
        {activeTab === "framework" && (
          <div>
            <div style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: "white", border: "1px solid #e2e8f0", marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800 }}>외장 디자이너 — 채용 직무역량 프레임워크</h3>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>BFM Generic Skill 기반 채용 공고 매핑 · K(Knowledge)/S(Skill)/T(Tool) 분류 및 요구역량수준(L1~L5) · Grade 권장습득단계(G1~G5)</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {competencyFramework.map(cat => (
                <div key={cat.id} style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: "white", border: "1px solid #e2e8f0", borderLeft: `4px solid ${cat.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div><div style={{ fontSize: 15, fontWeight: 800, color: cat.color }}>{cat.name}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>{cat.nameEn} · {cat.skills.length} Skills</div></div>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead><tr>{["ID", "직무역량", "구분", "요구", "Grade"].map((h, i) => <th key={h} style={{ padding: "6px 8px", textAlign: i < 2 ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                    <tbody>{cat.skills.map(skill => {
                      const gm = gradeMatrix[skill.reqLevel] || gradeMatrix["L3"];
                      return (
                        <tr key={skill.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                          <td style={{ padding: "5px 8px", color: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}>{skill.id}</td>
                          <td style={{ padding: "5px 8px", fontWeight: 500 }}><div>{skill.name}</div><div style={{ fontSize: 10, color: "#94a3b8" }}>{skill.desc}</div></td>
                          <td style={{ padding: "5px 4px", textAlign: "center" }}><KSTBadge type={skill.kst} /></td>
                          <td style={{ padding: "5px 4px", textAlign: "center", fontSize: 11, fontWeight: 700 }}>{skill.reqLevel}</td>
                          <td style={{ padding: "5px 8px" }}><div style={{ display: "flex", gap: 3, justifyContent: "center" }}>{["G1", "G2", "G3", "G4", "G5"].map(g => <div key={g} style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: gm[g] ? "#0f172a" : "#e5e7eb" }} />)}</div></td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPARE */}
        {activeTab === "compare" && (
          <div>
            <div style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: "white", border: "1px solid #e2e8f0", marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800 }}>지원자 종합 비교 분석</h3>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>재직자·현재지원·과거지원 전원의 6대 역량 스코어 비교 · 가중 종합점수 기반 랭킹</p>
            </div>
            <div style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: "white", border: "1px solid #e2e8f0", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #e2e8f0", fontSize: 11, color: "#64748b", width: 36 }}>#</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #e2e8f0", fontSize: 11, color: "#64748b" }}>지원자</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #e2e8f0", fontSize: 11, color: "#64748b" }}>상태</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #e2e8f0", fontSize: 11, color: "#64748b" }}>경력</th>
                  {competencyFramework.map(c => <th key={c.id} style={{ padding: "10px 8px", textAlign: "center", borderBottom: "2px solid #e2e8f0", fontSize: 11, color: c.color, fontWeight: 700 }}>{c.name.slice(0, 4)}</th>)}
                  <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #e2e8f0", fontSize: 11, color: "#0f172a", fontWeight: 800 }}>종합</th>
                </tr></thead>
                <tbody>
                  {[...applicants].sort((a, b) => getOverallScore(b.scores) - getOverallScore(a.scores)).map((a, idx) => {
                    const overall = getOverallScore(a.scores);
                    const { grade, color, bg } = getGrade(overall);
                    return (
                      <tr key={a.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: idx < 3 ? "#fafbfc" : "transparent" }}>
                        <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, fontSize: 14, color: idx < 3 ? "#2563eb" : "#94a3b8" }}>{idx + 1}</td>
                        <td style={{ padding: "10px 12px" }}><div style={{ fontWeight: 700 }}>{a.name}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>{a.education.length > 20 ? a.education.slice(0, 20) + "..." : a.education}</div></td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}><span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, backgroundColor: a.status === "현재지원" ? "#dbeafe" : a.status === "재직자" ? "#d1fae5" : "#f1f5f9", color: a.status === "현재지원" ? "#2563eb" : a.status === "재직자" ? "#059669" : "#64748b" }}>{a.status}</span></td>
                        <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#64748b" }}>{a.experience}년</td>
                        {competencyFramework.map(c => { const s = a.scores[c.id]; const sc = getGrade(s); return <td key={c.id} style={{ padding: "10px 8px", textAlign: "center" }}><span style={{ fontSize: 12, fontWeight: 700, color: sc.color, padding: "2px 8px", borderRadius: 4, backgroundColor: sc.bg }}>{s}</span></td>; })}
                        <td style={{ padding: "10px 12px", textAlign: "center" }}><div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 8, backgroundColor: bg, border: `2px solid ${color}` }}><span style={{ fontSize: 16, fontWeight: 800, color }}>{overall}</span><span style={{ fontSize: 12, fontWeight: 700, color, opacity: 0.7 }}>{grade}</span></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: "white", border: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>역량 영역별 지원자 비교</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={competencyFramework.map(c => { const e: Record<string, string | number> = { name: c.name }; applicants.forEach(a => { e[a.name] = a.scores[c.id]; }); return e; })} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} /><Legend wrapperStyle={{ fontSize: 11 }} />
                  {applicants.map((a, i) => <Bar key={a.id} dataKey={a.name} fill={["#2563eb", "#7c3aed", "#059669", "#dc2626", "#ea580c", "#0891b2", "#d946ef", "#65a30d", "#f59e0b", "#14b8a6", "#6366f1"][i % 11]} radius={[3, 3, 0, 0]} opacity={a.status === "현재지원" ? 1 : 0.5} />)}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function StaffingPage() {
  const [page, setPage] = useState<"listing" | "detail">("listing");
  if (page === "listing") return <JobListingPage onSelectJob={() => setPage("detail")} />;
  return <JobDetailPage onBack={() => setPage("listing")} />;
}
