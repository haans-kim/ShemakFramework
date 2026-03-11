"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, BookOpen, Shield, Layers, Star } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SkillLevel {
  level: number;
  levelName: string;
  definitionKr: string;
  expectedGrade: string;
  keyActivities: string;
}

interface Skill {
  skillId: string;
  skillNameKr: string;
  skillNameEn: string;
  skillCategory: "Process" | "Technical" | "Domain";
  standardSource: string;
  levelCount: number;
  levels: SkillLevel[];
}

interface Task {
  taskId: string;
  taskNameKr: string;
  taskNameEn: string;
  description: string;
  skills: Skill[];
}

interface Family {
  familyCode: string;
  familyNameKr: string;
  priority: number;
  skillCount: number;
  color: string;
  tasks: Task[];
}

// ── Color Utils ───────────────────────────────────────────────────────────────

const COLOR_MAP: Record<
  string,
  { bg: string; text: string; border: string; badge: string }
> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    badge: "bg-violet-100 text-violet-700",
  },
  teal: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    badge: "bg-teal-100 text-teal-700",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
  },
  pink: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
    badge: "bg-pink-100 text-pink-700",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
  },
  gray: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    badge: "bg-gray-100 text-gray-700",
  },
};

const LEVEL_COLORS = [
  "border-gray-200 bg-gray-50",
  "border-blue-200 bg-blue-50",
  "border-teal-200 bg-teal-50",
  "border-orange-200 bg-orange-50",
  "border-purple-200 bg-purple-50",
];

const LEVEL_BADGE = [
  "bg-gray-100 text-gray-600",
  "bg-blue-100 text-blue-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
  "bg-purple-100 text-purple-700",
];

const PRIORITY_LABEL: Record<number, string> = {
  1: "1순위",
  2: "2순위",
  3: "3순위",
};

const CATEGORY_ICON: Record<string, typeof BookOpen> = {
  Process: BookOpen,
  Technical: Layers,
  Domain: Shield,
};

// ── Static Data ───────────────────────────────────────────────────────────────

const STATIC_FAMILIES: Family[] = [
  {
    familyCode: "EE",
    familyNameKr: "전장/SW",
    priority: 1,
    skillCount: 42,
    color: "blue",
    tasks: [
      {
        taskId: "EE-T1",
        taskNameKr: "임베디드 SW 개발",
        taskNameEn: "Embedded SW Development",
        description: "차량용 임베디드 소프트웨어 설계 및 구현",
        skills: [
          {
            skillId: "EE-S1",
            skillNameKr: "AUTOSAR 플랫폼",
            skillNameEn: "AUTOSAR Platform",
            skillCategory: "Technical",
            standardSource: "AUTOSAR Consortium",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "AUTOSAR 아키텍처 기본 개념 이해. Classic/Adaptive 플랫폼 구분 가능.", expectedGrade: "사원", keyActivities: "AUTOSAR 교육 이수, 기본 설정 파일 수정" },
              { level: 2, levelName: "초급", definitionKr: "BSW 모듈 설정 및 기본 SWC 개발 가능. RTE 생성 및 디버깅 수행.", expectedGrade: "대리", keyActivities: "SWC 개발, BSW 모듈 설정, ECU Extract 생성" },
              { level: 3, levelName: "중급", definitionKr: "복잡 SWC 아키텍처 설계. 멀티코어 환경 최적화. OS/COM 스택 튜닝.", expectedGrade: "과장", keyActivities: "아키텍처 설계, 성능 최적화, 기술 리뷰" },
              { level: 4, levelName: "고급", definitionKr: "AUTOSAR 표준 기여 수준. 플랫폼 전체 아키텍처 설계 및 커스터마이징.", expectedGrade: "차장", keyActivities: "플랫폼 아키텍처, 표준 기여, 기술 멘토링" },
              { level: 5, levelName: "전문가", definitionKr: "AUTOSAR 표준 제정 참여. 신규 플랫폼 전략 수립 및 산학 협력 리딩.", expectedGrade: "부장+", keyActivities: "표준 제정, 전략 수립, 산학 협력" },
            ],
          },
          {
            skillId: "EE-S2",
            skillNameKr: "차량 통신 프로토콜",
            skillNameEn: "Vehicle Communication Protocol",
            skillCategory: "Technical",
            standardSource: "ISO 11898",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "CAN/LIN/FlexRay 기본 원리 이해. 통신 메시지 모니터링 가능.", expectedGrade: "사원", keyActivities: "통신 분석 도구 사용, 기본 DBC 파일 해석" },
              { level: 2, levelName: "초급", definitionKr: "통신 매트릭스 설계 보조. 게이트웨이 기본 설정. 진단 통신(UDS) 활용.", expectedGrade: "대리", keyActivities: "DBC 작성, 통신 테스트, UDS 진단" },
              { level: 3, levelName: "중급", definitionKr: "차량 네트워크 아키텍처 설계. Ethernet/CAN FD 혼합 토폴로지 구성.", expectedGrade: "과장", keyActivities: "네트워크 설계, 프로토콜 최적화, SOME/IP 구현" },
              { level: 4, levelName: "고급", definitionKr: "차세대 통신 아키텍처(SDV) 설계. 보안 통신(SecOC) 전체 설계.", expectedGrade: "차장", keyActivities: "SDV 아키텍처, 보안 설계, 기술 표준화" },
              { level: 5, levelName: "전문가", definitionKr: "글로벌 차량 통신 표준 제정 참여. 차세대 E/E 아키텍처 로드맵 수립.", expectedGrade: "부장+", keyActivities: "표준 제정, 로드맵 수립, 특허 출원" },
            ],
          },
          {
            skillId: "EE-S3",
            skillNameKr: "기능안전 SW",
            skillNameEn: "Functional Safety SW",
            skillCategory: "Process",
            standardSource: "ISO 26262",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "ISO 26262 기본 개념 이해. ASIL 등급 구분 가능.", expectedGrade: "사원", keyActivities: "안전 교육 이수, 기본 문서 작성 보조" },
              { level: 2, levelName: "초급", definitionKr: "안전 요구사항 분석 보조. FMEA 참여. 단위 테스트 수행.", expectedGrade: "대리", keyActivities: "FMEA 참여, 안전 테스트, 문서화" },
              { level: 3, levelName: "중급", definitionKr: "안전 분석(FTA/FMEA) 주도. 안전 메커니즘 설계. ASIL-D SW 개발.", expectedGrade: "과장", keyActivities: "안전 분석 리딩, 메커니즘 설계, 검증 계획" },
              { level: 4, levelName: "고급", definitionKr: "Safety Case 전체 구성. 기능안전 감사(Audit) 수행. DIA 심사 대응.", expectedGrade: "차장", keyActivities: "Safety Case 작성, 감사 수행, 심사 대응" },
              { level: 5, levelName: "전문가", definitionKr: "기능안전 표준 제정 참여. 조직 안전 문화 수립. 인증기관 협력.", expectedGrade: "부장+", keyActivities: "표준 기여, 조직 역량 구축, 인증 협력" },
            ],
          },
          {
            skillId: "EE-S4",
            skillNameKr: "모델기반 개발",
            skillNameEn: "Model-Based Development",
            skillCategory: "Process",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "Simulink/Stateflow 기본 사용법 이해. 간단한 모델 실행 가능.", expectedGrade: "사원", keyActivities: "모델 실행, 파라미터 변경, 시뮬레이션" },
              { level: 2, levelName: "초급", definitionKr: "제어 로직 모델링. 코드 자동 생성(Embedded Coder). MIL 테스트.", expectedGrade: "대리", keyActivities: "모델 개발, 코드 생성, MIL 테스트" },
              { level: 3, levelName: "중급", definitionKr: "복잡 제어 시스템 모델링. SIL/PIL 환경 구축. 모델 품질 검증.", expectedGrade: "과장", keyActivities: "시스템 모델링, SIL/PIL, 품질 검증" },
              { level: 4, levelName: "고급", definitionKr: "MBD 프로세스 전체 설계. 플랜트 모델 통합. CI/CD 파이프라인 구축.", expectedGrade: "차장", keyActivities: "프로세스 설계, 환경 구축, 표준화" },
              { level: 5, levelName: "전문가", definitionKr: "MBD 전략 수립. 가상 검증 플랫폼 아키텍처. 산학 연구 주도.", expectedGrade: "부장+", keyActivities: "전략 수립, 플랫폼 설계, 연구 협력" },
            ],
          },
        ],
      },
      {
        taskId: "EE-T2",
        taskNameKr: "ADAS/자율주행",
        taskNameEn: "ADAS / Autonomous Driving",
        description: "센서퓨전, 판단/제어, 자율주행 시스템 개발",
        skills: [
          {
            skillId: "EE-S5",
            skillNameKr: "센서퓨전",
            skillNameEn: "Sensor Fusion",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "카메라/레이더/라이다 센서 기본 원리 이해. 데이터 수집 가능.", expectedGrade: "사원", keyActivities: "센서 데이터 수집, 기본 분석" },
              { level: 2, levelName: "초급", definitionKr: "단일 센서 객체 인식 알고리즘 구현. 칼만 필터 기본 적용.", expectedGrade: "대리", keyActivities: "객체 인식, 필터링, 데이터 라벨링" },
              { level: 3, levelName: "중급", definitionKr: "멀티센서 퓨전 알고리즘 설계. 딥러닝 기반 인식 모델 개발.", expectedGrade: "과장", keyActivities: "퓨전 알고리즘, 딥러닝 모델, 성능 최적화" },
              { level: 4, levelName: "고급", definitionKr: "전체 인지 스택 아키텍처 설계. Edge Case 대응 전략 수립.", expectedGrade: "차장", keyActivities: "아키텍처 설계, Edge Case, 안전성 검증" },
              { level: 5, levelName: "전문가", definitionKr: "글로벌 수준 인지 기술 전략. 학회 발표 및 특허 포트폴리오 구축.", expectedGrade: "부장+", keyActivities: "기술 전략, 학회 활동, 특허 관리" },
            ],
          },
          {
            skillId: "EE-S6",
            skillNameKr: "경로계획/판단",
            skillNameEn: "Path Planning / Decision Making",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "경로계획 기본 알고리즘(A*, RRT) 이해. 시뮬레이션 환경 사용.", expectedGrade: "사원", keyActivities: "알고리즘 학습, 시뮬레이션 실행" },
              { level: 2, levelName: "초급", definitionKr: "단순 시나리오 경로 생성. 행동 결정 로직 구현.", expectedGrade: "대리", keyActivities: "경로 생성, 행동 결정, 테스트" },
              { level: 3, levelName: "중급", definitionKr: "복잡 교통 상황 대응 판단 로직 설계. 안전 판단 메커니즘 통합.", expectedGrade: "과장", keyActivities: "판단 로직 설계, 안전 통합, 검증" },
              { level: 4, levelName: "고급", definitionKr: "전체 판단/제어 아키텍처 설계. ODD 확장 전략 수립.", expectedGrade: "차장", keyActivities: "아키텍처 설계, ODD 확장, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "L4/L5 자율주행 기술 로드맵 수립. 글로벌 기술 리더십.", expectedGrade: "부장+", keyActivities: "로드맵 수립, 글로벌 협력, 전략 의사결정" },
            ],
          },
          {
            skillId: "EE-S7",
            skillNameKr: "V2X 통신",
            skillNameEn: "V2X Communication",
            skillCategory: "Technical",
            standardSource: "3GPP/IEEE",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "V2X 개념 및 DSRC/C-V2X 기본 이해. 메시지 구조 파악.", expectedGrade: "사원", keyActivities: "V2X 교육, 메시지 분석" },
              { level: 2, levelName: "초급", definitionKr: "V2X 메시지 파싱 및 기본 서비스 구현. 테스트베드 활용.", expectedGrade: "대리", keyActivities: "메시지 구현, 테스트베드 운영" },
              { level: 3, levelName: "중급", definitionKr: "V2X 기반 서비스 설계. 보안 프로토콜 적용. 필드 테스트 주도.", expectedGrade: "과장", keyActivities: "서비스 설계, 보안 적용, 필드 테스트" },
              { level: 4, levelName: "고급", definitionKr: "V2X 인프라 아키텍처 설계. 표준화 활동. MEC 연동 설계.", expectedGrade: "차장", keyActivities: "아키텍처 설계, 표준화, MEC 연동" },
              { level: 5, levelName: "전문가", definitionKr: "V2X 기술 전략 및 생태계 구축. 글로벌 표준 기관 활동.", expectedGrade: "부장+", keyActivities: "전략 수립, 생태계 구축, 표준 기관 활동" },
            ],
          },
        ],
      },
      {
        taskId: "EE-T3",
        taskNameKr: "전력전자/배터리",
        taskNameEn: "Power Electronics / Battery",
        description: "전기차 전력변환, BMS, 충전 시스템 개발",
        skills: [
          {
            skillId: "EE-S8",
            skillNameKr: "BMS 설계",
            skillNameEn: "Battery Management System Design",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "배터리 기본 특성(SOC/SOH) 이해. BMS 구조 파악.", expectedGrade: "사원", keyActivities: "BMS 기본 교육, 데이터 모니터링" },
              { level: 2, levelName: "초급", definitionKr: "셀 밸런싱 알고리즘 구현. SOC 추정 알고리즘 적용.", expectedGrade: "대리", keyActivities: "밸런싱 구현, SOC 추정, 테스트" },
              { level: 3, levelName: "중급", definitionKr: "BMS 전체 SW 아키텍처 설계. 열관리 제어 로직 개발.", expectedGrade: "과장", keyActivities: "아키텍처 설계, 열관리, 안전 로직" },
              { level: 4, levelName: "고급", definitionKr: "차세대 BMS 플랫폼 설계. 클라우드 연동 배터리 관리.", expectedGrade: "차장", keyActivities: "플랫폼 설계, 클라우드 BMS, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "전고체 배터리 등 차세대 BMS 전략 수립. 글로벌 기술 리더십.", expectedGrade: "부장+", keyActivities: "기술 전략, 연구 협력, 특허 포트폴리오" },
            ],
          },
          {
            skillId: "EE-S9",
            skillNameKr: "인버터/컨버터 설계",
            skillNameEn: "Inverter/Converter Design",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "전력변환 기본 회로(Buck/Boost) 이해. 시뮬레이션 도구 사용.", expectedGrade: "사원", keyActivities: "회로 시뮬레이션, 기본 분석" },
              { level: 2, levelName: "초급", definitionKr: "인버터 제어 알고리즘(FOC) 구현. PWM 제어 최적화.", expectedGrade: "대리", keyActivities: "FOC 구현, PWM 최적화, 테스트" },
              { level: 3, levelName: "중급", definitionKr: "SiC/GaN 기반 고효율 전력변환 설계. EMC 대응 설계.", expectedGrade: "과장", keyActivities: "고효율 설계, EMC 대응, 열설계" },
              { level: 4, levelName: "고급", definitionKr: "통합 전력변환 플랫폼 아키텍처. 800V 시스템 설계.", expectedGrade: "차장", keyActivities: "플랫폼 설계, 800V 시스템, 기술 표준화" },
              { level: 5, levelName: "전문가", definitionKr: "차세대 전력변환 기술 전략. 와이드밴드갭 반도체 로드맵.", expectedGrade: "부장+", keyActivities: "기술 전략, 로드맵, 글로벌 협력" },
            ],
          },
        ],
      },
    ],
  },
  {
    familyCode: "ME",
    familyNameKr: "기계설계",
    priority: 1,
    skillCount: 38,
    color: "green",
    tasks: [
      {
        taskId: "ME-T1",
        taskNameKr: "차체설계",
        taskNameEn: "Body Design",
        description: "차체 구조 설계, 충돌 안전, 경량화",
        skills: [
          {
            skillId: "ME-S1",
            skillNameKr: "차체 구조해석",
            skillNameEn: "Body Structural Analysis",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "FEM 기본 개념 이해. 해석 도구(HyperMesh/NASTRAN) 기초 사용.", expectedGrade: "사원", keyActivities: "메시 생성, 단순 해석 실행" },
              { level: 2, levelName: "초급", definitionKr: "정적/동적 구조해석 수행. 하중 조건 설정 및 결과 분석.", expectedGrade: "대리", keyActivities: "구조해석 수행, 결과 보고서 작성" },
              { level: 3, levelName: "중급", definitionKr: "비선형 해석, 충돌 시뮬레이션 주도. 최적화 설계 반영.", expectedGrade: "과장", keyActivities: "충돌 해석, 토폴로지 최적화, 경량화 설계" },
              { level: 4, levelName: "고급", definitionKr: "멀티피직스 해석 통합. 해석-설계 자동화 파이프라인 구축.", expectedGrade: "차장", keyActivities: "통합 해석, 자동화, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "차체 구조 기술 전략 수립. 신소재 적용 해석 방법론 개발.", expectedGrade: "부장+", keyActivities: "기술 전략, 방법론 개발, 산학 협력" },
            ],
          },
          {
            skillId: "ME-S2",
            skillNameKr: "경량화 설계",
            skillNameEn: "Lightweight Design",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "경량 소재(알루미늄, CFRP) 기본 특성 이해.", expectedGrade: "사원", keyActivities: "소재 물성 조사, 기본 문서 작성" },
              { level: 2, levelName: "초급", definitionKr: "이종소재 접합 기본 설계. 단품 경량화 설계 수행.", expectedGrade: "대리", keyActivities: "단품 설계, 접합 설계, 중량 관리" },
              { level: 3, levelName: "중급", definitionKr: "모듈 단위 경량화 최적 설계. 비용-중량 트레이드오프 분석.", expectedGrade: "과장", keyActivities: "최적 설계, 트레이드오프 분석, 공법 검토" },
              { level: 4, levelName: "고급", definitionKr: "차량 전체 경량화 전략 수립. 신공법 도입 타당성 검증.", expectedGrade: "차장", keyActivities: "전략 수립, 신공법 검증, 벤치마킹" },
              { level: 5, levelName: "전문가", definitionKr: "차세대 경량화 로드맵 수립. 글로벌 경량화 기술 리더십.", expectedGrade: "부장+", keyActivities: "로드맵, 글로벌 협력, 연구 주도" },
            ],
          },
          {
            skillId: "ME-S3",
            skillNameKr: "NVH 설계",
            skillNameEn: "NVH Design",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "NVH 기본 개념(소음, 진동, 하쉬니스) 이해. 측정 장비 사용.", expectedGrade: "사원", keyActivities: "NVH 측정, 데이터 정리" },
              { level: 2, levelName: "초급", definitionKr: "단품 NVH 시험 수행. 주파수 분석 및 기본 대책 수립.", expectedGrade: "대리", keyActivities: "시험 수행, 주파수 분석, 대책 수립" },
              { level: 3, levelName: "중급", definitionKr: "차량 NVH 목표 설정 및 달성 설계. TPA 분석 주도.", expectedGrade: "과장", keyActivities: "목표 설정, TPA 분석, 설계 최적화" },
              { level: 4, levelName: "고급", definitionKr: "EV 특화 NVH 전략(전기 모터 소음, 로드노이즈). 음질 설계.", expectedGrade: "차장", keyActivities: "EV NVH 전략, 음질 설계, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "차량 음향 경험 전략 수립. NVH 기술 로드맵 및 표준화.", expectedGrade: "부장+", keyActivities: "기술 전략, 로드맵, 표준화" },
            ],
          },
        ],
      },
      {
        taskId: "ME-T2",
        taskNameKr: "섀시설계",
        taskNameEn: "Chassis Design",
        description: "현가/제동/조향 시스템 설계 및 최적화",
        skills: [
          {
            skillId: "ME-S4",
            skillNameKr: "현가장치 설계",
            skillNameEn: "Suspension System Design",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "현가장치 기본 구조 및 동역학 이해.", expectedGrade: "사원", keyActivities: "기본 구조 학습, 도면 검토" },
              { level: 2, levelName: "초급", definitionKr: "K&C 특성 분석. 부싱/스프링 사양 설정.", expectedGrade: "대리", keyActivities: "K&C 분석, 사양 설정, 시험" },
              { level: 3, levelName: "중급", definitionKr: "전체 현가 시스템 설계. 승차감/조종안정성 최적화.", expectedGrade: "과장", keyActivities: "시스템 설계, 최적화, 차량 평가" },
              { level: 4, levelName: "고급", definitionKr: "전자제어 현가(ECS) 통합 설계. 에어 서스펜션 개발.", expectedGrade: "차장", keyActivities: "ECS 설계, 에어 서스펜션, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "미래 현가 기술 전략(능동형/MR댐퍼). 글로벌 기술 리더십.", expectedGrade: "부장+", keyActivities: "기술 전략, 연구 주도, 특허 관리" },
            ],
          },
          {
            skillId: "ME-S5",
            skillNameKr: "제동시스템 설계",
            skillNameEn: "Brake System Design",
            skillCategory: "Technical",
            standardSource: "ECE R13",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "유압/전자 제동 시스템 기본 원리 이해.", expectedGrade: "사원", keyActivities: "시스템 학습, 시험 보조" },
              { level: 2, levelName: "초급", definitionKr: "브레이크 성능 시험 수행. 제동력 배분 설계 보조.", expectedGrade: "대리", keyActivities: "성능 시험, 배분 설계, 데이터 분석" },
              { level: 3, levelName: "중급", definitionKr: "EMB/IDB 시스템 설계. 회생제동 협조제어 개발.", expectedGrade: "과장", keyActivities: "시스템 설계, 회생제동, 법규 대응" },
              { level: 4, levelName: "고급", definitionKr: "통합 제동 플랫폼 아키텍처. BBW(Brake-by-Wire) 설계.", expectedGrade: "차장", keyActivities: "플랫폼 설계, BBW, 기술 표준화" },
              { level: 5, levelName: "전문가", definitionKr: "차세대 제동 기술 전략. 자율주행 대응 제동 시스템 로드맵.", expectedGrade: "부장+", keyActivities: "기술 전략, 로드맵, 표준 활동" },
            ],
          },
        ],
      },
      {
        taskId: "ME-T3",
        taskNameKr: "열관리/공조",
        taskNameEn: "Thermal Management / HVAC",
        description: "차량 열관리 시스템 및 공조 설계",
        skills: [
          {
            skillId: "ME-S6",
            skillNameKr: "통합열관리 설계",
            skillNameEn: "Integrated Thermal Management",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "차량 열관리 기본 개념. 냉각/난방 시스템 구조 이해.", expectedGrade: "사원", keyActivities: "시스템 학습, 데이터 수집" },
              { level: 2, levelName: "초급", definitionKr: "열유동 해석(CFD) 기본 수행. 냉각 회로 설계 보조.", expectedGrade: "대리", keyActivities: "CFD 해석, 냉각 설계, 시험" },
              { level: 3, levelName: "중급", definitionKr: "EV 통합열관리 시스템 설계. 히트펌프 적용 설계.", expectedGrade: "과장", keyActivities: "통합 설계, 히트펌프, 효율 최적화" },
              { level: 4, levelName: "고급", definitionKr: "차량 전체 열관리 아키텍처 설계. 배터리-모터-실내 통합.", expectedGrade: "차장", keyActivities: "아키텍처 설계, 통합 최적화, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "차세대 열관리 기술 전략. 열에너지 회수 시스템 개발.", expectedGrade: "부장+", keyActivities: "기술 전략, 에너지 회수, 연구 협력" },
            ],
          },
        ],
      },
    ],
  },
  {
    familyCode: "MT",
    familyNameKr: "소재/공법",
    priority: 2,
    skillCount: 35,
    color: "orange",
    tasks: [
      {
        taskId: "MT-T1",
        taskNameKr: "금속소재 개발",
        taskNameEn: "Metal Material Development",
        description: "차량용 고강도 금속소재 개발 및 성형성 평가",
        skills: [
          {
            skillId: "MT-S1",
            skillNameKr: "고강도강 성형",
            skillNameEn: "Advanced High-Strength Steel Forming",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "AHSS 기본 특성(DP, TRIP, TWIP) 이해. 물성 시험 기초.", expectedGrade: "사원", keyActivities: "물성 시험, 데이터 정리" },
              { level: 2, levelName: "초급", definitionKr: "성형 해석(AutoForm) 수행. 스프링백 보정 기본 설계.", expectedGrade: "대리", keyActivities: "성형 해석, 스프링백 보정" },
              { level: 3, levelName: "중급", definitionKr: "핫스탬핑 공정 설계. 이종소재 접합 공법 적용.", expectedGrade: "과장", keyActivities: "핫스탬핑, 이종소재 접합, 공정 최적화" },
              { level: 4, levelName: "고급", definitionKr: "신소재 적용 전략 수립. 소재-공법 통합 개발.", expectedGrade: "차장", keyActivities: "전략 수립, 통합 개발, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "글로벌 소재 기술 전략. 차세대 소재(3세대 AHSS) 개발 주도.", expectedGrade: "부장+", keyActivities: "기술 전략, 신소재 개발, 학회 활동" },
            ],
          },
          {
            skillId: "MT-S2",
            skillNameKr: "알루미늄 기술",
            skillNameEn: "Aluminum Technology",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "알루미늄 합금 종류 및 기본 특성 이해.", expectedGrade: "사원", keyActivities: "합금 학습, 물성 시험" },
              { level: 2, levelName: "초급", definitionKr: "알루미늄 판재/압출재 적용 설계 보조. 접합 공법 기초.", expectedGrade: "대리", keyActivities: "적용 설계, 접합 시험" },
              { level: 3, levelName: "중급", definitionKr: "알루미늄 차체 모듈 설계. 다이캐스팅 공법 적용.", expectedGrade: "과장", keyActivities: "모듈 설계, 다이캐스팅, 공법 검증" },
              { level: 4, levelName: "고급", definitionKr: "기가캐스팅 등 대형 주조 기술. 알루미늄 차체 전략.", expectedGrade: "차장", keyActivities: "기가캐스팅, 전략 수립, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "알루미늄 기술 로드맵 수립. 재활용/순환 소재 전략.", expectedGrade: "부장+", keyActivities: "로드맵, 순환경제, 글로벌 협력" },
            ],
          },
        ],
      },
      {
        taskId: "MT-T2",
        taskNameKr: "도장/표면처리",
        taskNameEn: "Painting / Surface Treatment",
        description: "차량 도장 품질 및 표면처리 공법 개발",
        skills: [
          {
            skillId: "MT-S3",
            skillNameKr: "도장 공정 설계",
            skillNameEn: "Painting Process Design",
            skillCategory: "Process",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "도장 공정(전처리-전착-중도-상도) 기본 이해.", expectedGrade: "사원", keyActivities: "공정 학습, 품질 검사 보조" },
              { level: 2, levelName: "초급", definitionKr: "도막 물성 시험 수행. 공정 조건 관리 및 불량 분석.", expectedGrade: "대리", keyActivities: "물성 시험, 불량 분석, 조건 관리" },
              { level: 3, levelName: "중급", definitionKr: "도장 라인 최적화. 신규 도료/공법 적용 검증.", expectedGrade: "과장", keyActivities: "라인 최적화, 신도료 검증, 품질 개선" },
              { level: 4, levelName: "고급", definitionKr: "차세대 도장 공법(친환경/저에너지) 개발.", expectedGrade: "차장", keyActivities: "신공법 개발, 친환경 전환, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "도장 기술 전략 수립. 컬러/질감 트렌드 리딩.", expectedGrade: "부장+", keyActivities: "기술 전략, 트렌드 리딩, 글로벌 협력" },
            ],
          },
        ],
      },
      {
        taskId: "MT-T3",
        taskNameKr: "고분자/복합소재",
        taskNameEn: "Polymer / Composite Materials",
        description: "플라스틱, CFRP 등 복합소재 개발 및 적용",
        skills: [
          {
            skillId: "MT-S4",
            skillNameKr: "CFRP 기술",
            skillNameEn: "Carbon Fiber Reinforced Plastics",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "CFRP 기본 특성 및 제조 공법 이해.", expectedGrade: "사원", keyActivities: "소재 학습, 시편 제작 보조" },
              { level: 2, levelName: "초급", definitionKr: "적층 설계 기초. CFRP 물성 시험 수행.", expectedGrade: "대리", keyActivities: "적층 설계, 물성 시험, 데이터 분석" },
              { level: 3, levelName: "중급", definitionKr: "차량 부품 CFRP 적용 설계. RTM/프레스 공법 적용.", expectedGrade: "과장", keyActivities: "부품 설계, 공법 적용, 양산성 검증" },
              { level: 4, levelName: "고급", definitionKr: "CFRP 대량 생산 체계 구축. 재활용 기술 개발.", expectedGrade: "차장", keyActivities: "양산 체계, 재활용 기술, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "복합소재 기술 로드맵. 차세대 탄소섬유 전략.", expectedGrade: "부장+", keyActivities: "로드맵, 전략 수립, 글로벌 협력" },
            ],
          },
        ],
      },
    ],
  },
  {
    familyCode: "QA",
    familyNameKr: "품질/시험",
    priority: 2,
    skillCount: 28,
    color: "violet",
    tasks: [
      {
        taskId: "QA-T1",
        taskNameKr: "품질보증",
        taskNameEn: "Quality Assurance",
        description: "차량 품질보증 체계 운영 및 개선",
        skills: [
          {
            skillId: "QA-S1",
            skillNameKr: "IATF 16949",
            skillNameEn: "IATF 16949 QMS",
            skillCategory: "Process",
            standardSource: "IATF",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "IATF 16949 기본 요구사항 이해. 품질 문서 작성 기초.", expectedGrade: "사원", keyActivities: "교육 이수, 문서 작성 보조" },
              { level: 2, levelName: "초급", definitionKr: "내부 심사 수행. 부적합 관리 및 시정조치.", expectedGrade: "대리", keyActivities: "내부 심사, 부적합 관리, CAR 작성" },
              { level: 3, levelName: "중급", definitionKr: "품질 시스템 프로세스 설계. 공급업체 품질 관리.", expectedGrade: "과장", keyActivities: "프로세스 설계, SQA, 심사 리딩" },
              { level: 4, levelName: "고급", definitionKr: "전사 품질 시스템 아키텍처. 인증 심사 대응 총괄.", expectedGrade: "차장", keyActivities: "시스템 설계, 인증 심사, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "품질 전략 수립. 글로벌 품질 표준 기여.", expectedGrade: "부장+", keyActivities: "전략 수립, 표준 기여, 벤치마킹" },
            ],
          },
          {
            skillId: "QA-S2",
            skillNameKr: "신뢰성 시험",
            skillNameEn: "Reliability Testing",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "신뢰성 시험 종류(내구/환경/가속) 기본 이해.", expectedGrade: "사원", keyActivities: "시험 보조, 데이터 수집" },
              { level: 2, levelName: "초급", definitionKr: "시험 계획 수립 보조. 환경 시험(온도/진동/습도) 수행.", expectedGrade: "대리", keyActivities: "시험 수행, 보고서 작성, 분석" },
              { level: 3, levelName: "중급", definitionKr: "가속수명시험(ALT) 설계. 와이블 분석. 신뢰성 예측.", expectedGrade: "과장", keyActivities: "ALT 설계, 와이블 분석, 예측 모델" },
              { level: 4, levelName: "고급", definitionKr: "전사 신뢰성 기준 수립. 가상 신뢰성 시험 체계 구축.", expectedGrade: "차장", keyActivities: "기준 수립, 가상 시험, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "글로벌 신뢰성 전략 수립. 예지보전 기술 연계.", expectedGrade: "부장+", keyActivities: "전략 수립, 예지보전, 연구 협력" },
            ],
          },
        ],
      },
      {
        taskId: "QA-T2",
        taskNameKr: "차량시험",
        taskNameEn: "Vehicle Testing",
        description: "완성차 성능/법규 시험 및 인증",
        skills: [
          {
            skillId: "QA-S3",
            skillNameKr: "배출가스 인증",
            skillNameEn: "Emission Certification",
            skillCategory: "Domain",
            standardSource: "Euro/EPA",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "배출가스 법규(Euro/EPA) 기본 이해. 시험 모드 파악.", expectedGrade: "사원", keyActivities: "법규 학습, 시험 보조" },
              { level: 2, levelName: "초급", definitionKr: "배출가스 시험 수행. 시험 데이터 분석 및 보고.", expectedGrade: "대리", keyActivities: "시험 수행, 데이터 분석, 보고서" },
              { level: 3, levelName: "중급", definitionKr: "인증 전략 수립. 법규 변화 대응 기술 검토.", expectedGrade: "과장", keyActivities: "인증 전략, 법규 대응, 기술 검토" },
              { level: 4, levelName: "고급", definitionKr: "글로벌 인증 프로그램 관리. 각국 법규 통합 대응.", expectedGrade: "차장", keyActivities: "글로벌 인증, 법규 통합, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "법규 제정 참여. 탄소중립 대응 인증 전략.", expectedGrade: "부장+", keyActivities: "법규 참여, 탄소중립, 전략 수립" },
            ],
          },
        ],
      },
    ],
  },
  {
    familyCode: "DE",
    familyNameKr: "디자인",
    priority: 2,
    skillCount: 24,
    color: "pink",
    tasks: [
      {
        taskId: "DE-T1",
        taskNameKr: "익스테리어 디자인",
        taskNameEn: "Exterior Design",
        description: "차량 외관 디자인 및 공력 조형",
        skills: [
          {
            skillId: "DE-S1",
            skillNameKr: "서피스 모델링",
            skillNameEn: "Surface Modeling",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "Alias/ICEM Surf 기본 사용법. 곡면 개념 이해.", expectedGrade: "사원", keyActivities: "도구 학습, 기본 서피스 생성" },
              { level: 2, levelName: "초급", definitionKr: "Class-A 서피스 기본 생성. 곡률 분석 및 수정.", expectedGrade: "대리", keyActivities: "서피스 생성, 곡률 분석, 수정 반복" },
              { level: 3, levelName: "중급", definitionKr: "전체 차량 서피스 모델링. 페이스리프트 서피스 주도.", expectedGrade: "과장", keyActivities: "차량 서피스, 페이스리프트, 품질 관리" },
              { level: 4, levelName: "고급", definitionKr: "신차 전체 서피스 총괄. 디자인-설계 협업 리딩.", expectedGrade: "차장", keyActivities: "서피스 총괄, 협업 리딩, 품질 기준" },
              { level: 5, levelName: "전문가", definitionKr: "서피스 기술 전략. 파라메트릭/제너레이티브 디자인 적용.", expectedGrade: "부장+", keyActivities: "기술 전략, 신기술 적용, 역량 개발" },
            ],
          },
          {
            skillId: "DE-S2",
            skillNameKr: "디지털 렌더링",
            skillNameEn: "Digital Rendering",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "VRED/KeyShot 기본 렌더링. 머티리얼 기본 설정.", expectedGrade: "사원", keyActivities: "도구 학습, 기본 렌더링" },
              { level: 2, levelName: "초급", definitionKr: "포토리얼 렌더링 수행. 라이팅/환경 설정.", expectedGrade: "대리", keyActivities: "렌더링 제작, 라이팅 설정, 프레젠테이션" },
              { level: 3, levelName: "중급", definitionKr: "실시간 렌더링(Unreal) 활용. VR 디자인 리뷰 구현.", expectedGrade: "과장", keyActivities: "실시간 렌더링, VR, 디자인 리뷰" },
              { level: 4, levelName: "고급", definitionKr: "디지털 트윈 기반 디자인 검증 체계. AI 렌더링 파이프라인.", expectedGrade: "차장", keyActivities: "디지털 트윈, AI 렌더링, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "시각화 기술 전략 수립. 메타버스 디자인 환경 구축.", expectedGrade: "부장+", keyActivities: "기술 전략, 메타버스, 혁신 리딩" },
            ],
          },
        ],
      },
      {
        taskId: "DE-T2",
        taskNameKr: "인테리어/UX 디자인",
        taskNameEn: "Interior / UX Design",
        description: "차량 실내 디자인 및 사용자 경험 설계",
        skills: [
          {
            skillId: "DE-S3",
            skillNameKr: "차량 UX 설계",
            skillNameEn: "Vehicle UX Design",
            skillCategory: "Domain",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "차량 HMI 기본 개념 이해. 사용자 리서치 기초.", expectedGrade: "사원", keyActivities: "리서치 참여, 벤치마킹" },
              { level: 2, levelName: "초급", definitionKr: "와이어프레임/프로토타입 제작. 사용성 테스트 수행.", expectedGrade: "대리", keyActivities: "프로토타이핑, 사용성 테스트, UI 설계" },
              { level: 3, levelName: "중급", definitionKr: "차량 전체 UX 플로우 설계. 멀티모달 인터랙션 설계.", expectedGrade: "과장", keyActivities: "UX 플로우, 멀티모달, 디자인 가이드" },
              { level: 4, levelName: "고급", definitionKr: "SDV 시대 차량 UX 비전 수립. AI 기반 개인화 경험.", expectedGrade: "차장", keyActivities: "UX 비전, AI 개인화, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "모빌리티 UX 전략 수립. 글로벌 UX 트렌드 리딩.", expectedGrade: "부장+", keyActivities: "UX 전략, 트렌드 리딩, 혁신" },
            ],
          },
        ],
      },
    ],
  },
  {
    familyCode: "FS",
    familyNameKr: "기능안전",
    priority: 1,
    skillCount: 32,
    color: "red",
    tasks: [
      {
        taskId: "FS-T1",
        taskNameKr: "기능안전 설계",
        taskNameEn: "Functional Safety Design",
        description: "ISO 26262 기반 차량 기능안전 설계 및 검증",
        skills: [
          {
            skillId: "FS-S1",
            skillNameKr: "HARA/안전분석",
            skillNameEn: "HARA / Safety Analysis",
            skillCategory: "Process",
            standardSource: "ISO 26262",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "HARA 프로세스 기본 이해. 위험 이벤트 식별 참여.", expectedGrade: "사원", keyActivities: "HARA 교육, 위험 식별 보조" },
              { level: 2, levelName: "초급", definitionKr: "HARA 워크시트 작성. S/E/C 등급 산정. 안전 목표 도출.", expectedGrade: "대리", keyActivities: "HARA 작성, 등급 산정, 안전 목표" },
              { level: 3, levelName: "중급", definitionKr: "전체 시스템 HARA 주도. FTA/FMEDA 분석. TSC 검증.", expectedGrade: "과장", keyActivities: "HARA 리딩, FTA/FMEDA, TSC 검증" },
              { level: 4, levelName: "고급", definitionKr: "차량 전체 안전 아키텍처 설계. SOTIF/사이버보안 통합.", expectedGrade: "차장", keyActivities: "안전 아키텍처, SOTIF 통합, 심사 대응" },
              { level: 5, levelName: "전문가", definitionKr: "안전 표준 제정 참여. 조직 안전 역량 체계 수립.", expectedGrade: "부장+", keyActivities: "표준 제정, 역량 체계, 글로벌 협력" },
            ],
          },
          {
            skillId: "FS-S2",
            skillNameKr: "안전 메커니즘 설계",
            skillNameEn: "Safety Mechanism Design",
            skillCategory: "Technical",
            standardSource: "ISO 26262",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "안전 메커니즘 개념(감시/진단/폴백) 이해.", expectedGrade: "사원", keyActivities: "개념 학습, 구현 보조" },
              { level: 2, levelName: "초급", definitionKr: "기본 안전 메커니즘 구현. 진단 커버리지 산출.", expectedGrade: "대리", keyActivities: "메커니즘 구현, 커버리지 산출" },
              { level: 3, levelName: "중급", definitionKr: "ASIL-D 수준 안전 메커니즘 설계. 하드웨어 메트릭 달성.", expectedGrade: "과장", keyActivities: "ASIL-D 설계, HW 메트릭, 검증" },
              { level: 4, levelName: "고급", definitionKr: "시스템 전체 안전 아키텍처. 이중화/다중화 전략.", expectedGrade: "차장", keyActivities: "안전 아키텍처, 이중화 전략, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "차세대 안전 기술 전략. AI 기반 안전 시스템 설계 주도.", expectedGrade: "부장+", keyActivities: "기술 전략, AI 안전, 연구 주도" },
            ],
          },
        ],
      },
      {
        taskId: "FS-T2",
        taskNameKr: "사이버보안",
        taskNameEn: "Cybersecurity",
        description: "차량 사이버보안 설계 및 인증 (UN R155/R156)",
        skills: [
          {
            skillId: "FS-S3",
            skillNameKr: "차량 보안 설계",
            skillNameEn: "Vehicle Security Design",
            skillCategory: "Technical",
            standardSource: "ISO 21434",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "차량 사이버보안 기본 개념. TARA 프로세스 이해.", expectedGrade: "사원", keyActivities: "보안 교육, TARA 참여" },
              { level: 2, levelName: "초급", definitionKr: "위협 분석(TARA) 수행. 보안 요구사항 도출.", expectedGrade: "대리", keyActivities: "TARA 수행, 요구사항 도출" },
              { level: 3, levelName: "중급", definitionKr: "보안 아키텍처 설계. HSM/SecOC 적용. 침투 테스트 주도.", expectedGrade: "과장", keyActivities: "보안 설계, HSM, 침투 테스트" },
              { level: 4, levelName: "고급", definitionKr: "전사 CSMS 구축. UN R155/R156 인증 총괄.", expectedGrade: "차장", keyActivities: "CSMS, 인증 총괄, 보안 거버넌스" },
              { level: 5, levelName: "전문가", definitionKr: "차량 보안 전략 수립. 국제 보안 표준 기여.", expectedGrade: "부장+", keyActivities: "전략 수립, 표준 기여, 연구 협력" },
            ],
          },
        ],
      },
    ],
  },
  {
    familyCode: "MG",
    familyNameKr: "제조/생기",
    priority: 2,
    skillCount: 30,
    color: "teal",
    tasks: [
      {
        taskId: "MG-T1",
        taskNameKr: "스마트팩토리",
        taskNameEn: "Smart Factory",
        description: "제조 디지털화, MES, IoT 기반 스마트 공장",
        skills: [
          {
            skillId: "MG-S1",
            skillNameKr: "제조 AI/ML",
            skillNameEn: "Manufacturing AI/ML",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "제조 데이터 수집/정제 기초. ML 기본 개념 이해.", expectedGrade: "사원", keyActivities: "데이터 수집, ML 기초 학습" },
              { level: 2, levelName: "초급", definitionKr: "품질 예측 모델 기본 구현. 이상 탐지 알고리즘 적용.", expectedGrade: "대리", keyActivities: "예측 모델, 이상 탐지, 데이터 분석" },
              { level: 3, levelName: "중급", definitionKr: "공정 최적화 AI 모델 설계. 디지털 트윈 연동.", expectedGrade: "과장", keyActivities: "AI 모델, 디지털 트윈, 공정 최적화" },
              { level: 4, levelName: "고급", definitionKr: "전사 제조 AI 플랫폼 아키텍처. MLOps 체계 구축.", expectedGrade: "차장", keyActivities: "플랫폼 설계, MLOps, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "스마트팩토리 AI 전략 수립. 자율 제조 비전 주도.", expectedGrade: "부장+", keyActivities: "AI 전략, 자율 제조, 글로벌 협력" },
            ],
          },
          {
            skillId: "MG-S2",
            skillNameKr: "로봇 프로세스",
            skillNameEn: "Robot Process",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "산업용 로봇 기본 구조 이해. 티칭 펜던트 사용.", expectedGrade: "사원", keyActivities: "로봇 기초, 티칭 학습" },
              { level: 2, levelName: "초급", definitionKr: "로봇 프로그래밍 기본. 용접/도장 로봇 운용.", expectedGrade: "대리", keyActivities: "프로그래밍, 로봇 운용, 유지보수" },
              { level: 3, levelName: "중급", definitionKr: "협동 로봇 시스템 설계. 비전 가이드 로봇 적용.", expectedGrade: "과장", keyActivities: "협동 로봇, 비전 시스템, 공정 설계" },
              { level: 4, levelName: "고급", definitionKr: "로봇 셀 전체 아키텍처. AMR 기반 물류 자동화.", expectedGrade: "차장", keyActivities: "셀 설계, AMR, 자동화 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "미래 제조 로봇 전략. 인간-로봇 협업 비전 수립.", expectedGrade: "부장+", keyActivities: "로봇 전략, HRC 비전, 기술 혁신" },
            ],
          },
        ],
      },
      {
        taskId: "MG-T2",
        taskNameKr: "공정설계",
        taskNameEn: "Process Engineering",
        description: "차량 제조 공정 설계 및 최적화",
        skills: [
          {
            skillId: "MG-S3",
            skillNameKr: "공정 시뮬레이션",
            skillNameEn: "Process Simulation",
            skillCategory: "Process",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "공정 시뮬레이션 도구(Plant Simulation) 기초 사용.", expectedGrade: "사원", keyActivities: "도구 학습, 기본 모델 실행" },
              { level: 2, levelName: "초급", definitionKr: "단위 공정 시뮬레이션 모델 작성. 병목 분석.", expectedGrade: "대리", keyActivities: "모델 작성, 병목 분석, 레이아웃" },
              { level: 3, levelName: "중급", definitionKr: "전체 라인 시뮬레이션. 물류 최적화. 투자 효과 분석.", expectedGrade: "과장", keyActivities: "라인 시뮬레이션, 물류 최적화, ROI" },
              { level: 4, levelName: "고급", definitionKr: "공장 전체 디지털 트윈 구축. 가상 커미셔닝.", expectedGrade: "차장", keyActivities: "디지털 트윈, 가상 커미셔닝, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "제조 시뮬레이션 전략 수립. 미래 공장 설계 주도.", expectedGrade: "부장+", keyActivities: "전략 수립, 미래 공장, 글로벌 협력" },
            ],
          },
        ],
      },
    ],
  },
  {
    familyCode: "PJ",
    familyNameKr: "프로젝트관리",
    priority: 3,
    skillCount: 20,
    color: "indigo",
    tasks: [
      {
        taskId: "PJ-T1",
        taskNameKr: "차량개발 PM",
        taskNameEn: "Vehicle Development PM",
        description: "차량 개발 프로젝트 관리 및 일정/비용 통제",
        skills: [
          {
            skillId: "PJ-S1",
            skillNameKr: "차량개발 프로세스",
            skillNameEn: "Vehicle Development Process",
            skillCategory: "Process",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "차량 개발 게이트(KO/DR/PP) 프로세스 기본 이해.", expectedGrade: "사원", keyActivities: "프로세스 학습, 산출물 작성 보조" },
              { level: 2, levelName: "초급", definitionKr: "마일스톤 관리. 이슈 트래킹. 일정 보고서 작성.", expectedGrade: "대리", keyActivities: "일정 관리, 이슈 트래킹, 보고" },
              { level: 3, levelName: "중급", definitionKr: "모듈 단위 프로젝트 리딩. 리스크 관리. 협력사 관리.", expectedGrade: "과장", keyActivities: "프로젝트 리딩, 리스크 관리, 협력사" },
              { level: 4, levelName: "고급", definitionKr: "차종 전체 PM. 다부서 조율. 개발 비용 관리.", expectedGrade: "차장", keyActivities: "차종 PM, 비용 관리, 다부서 조율" },
              { level: 5, levelName: "전문가", definitionKr: "개발 프로세스 혁신. 애자일/SDV 프로세스 전환 주도.", expectedGrade: "부장+", keyActivities: "프로세스 혁신, 애자일 전환, 전략" },
            ],
          },
        ],
      },
      {
        taskId: "PJ-T2",
        taskNameKr: "원가기획",
        taskNameEn: "Cost Planning",
        description: "차량 원가 분석 및 최적화",
        skills: [
          {
            skillId: "PJ-S2",
            skillNameKr: "차량원가 분석",
            skillNameEn: "Vehicle Cost Analysis",
            skillCategory: "Domain",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "차량 원가 구조(재료비/가공비/관리비) 기본 이해.", expectedGrade: "사원", keyActivities: "원가 구조 학습, 데이터 수집" },
              { level: 2, levelName: "초급", definitionKr: "부품별 원가 산출. 원가 비교 분석. 기본 VE 활동.", expectedGrade: "대리", keyActivities: "원가 산출, 비교 분석, VE" },
              { level: 3, levelName: "중급", definitionKr: "모듈 원가 최적화 전략. Should Cost 분석.", expectedGrade: "과장", keyActivities: "원가 최적화, Should Cost, 협력사 협상" },
              { level: 4, levelName: "고급", definitionKr: "차종 전체 원가 목표 수립 및 관리. TCO 분석.", expectedGrade: "차장", keyActivities: "원가 목표, TCO, 전략 의사결정" },
              { level: 5, levelName: "전문가", definitionKr: "원가 혁신 전략 수립. 플랫폼 전략 연계 원가 최적화.", expectedGrade: "부장+", keyActivities: "원가 전략, 플랫폼 연계, 글로벌 최적화" },
            ],
          },
        ],
      },
    ],
  },
  {
    familyCode: "DT",
    familyNameKr: "데이터/AI",
    priority: 1,
    skillCount: 36,
    color: "yellow",
    tasks: [
      {
        taskId: "DT-T1",
        taskNameKr: "데이터 엔지니어링",
        taskNameEn: "Data Engineering",
        description: "차량/제조 데이터 파이프라인 및 플랫폼 구축",
        skills: [
          {
            skillId: "DT-S1",
            skillNameKr: "데이터 파이프라인",
            skillNameEn: "Data Pipeline",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "ETL 기본 개념 이해. SQL 기본 쿼리 작성.", expectedGrade: "사원", keyActivities: "SQL 학습, 데이터 수집" },
              { level: 2, levelName: "초급", definitionKr: "Airflow/Spark 기본 사용. 배치 파이프라인 구축.", expectedGrade: "대리", keyActivities: "파이프라인 구축, 배치 처리" },
              { level: 3, levelName: "중급", definitionKr: "실시간 스트리밍 파이프라인 설계. 데이터 품질 관리.", expectedGrade: "과장", keyActivities: "스트리밍, 품질 관리, 아키텍처 설계" },
              { level: 4, levelName: "고급", definitionKr: "전사 데이터 플랫폼 아키텍처. 데이터 거버넌스 체계.", expectedGrade: "차장", keyActivities: "플랫폼 설계, 거버넌스, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "데이터 전략 수립. 데이터 메시/패브릭 아키텍처.", expectedGrade: "부장+", keyActivities: "전략 수립, 메시 아키텍처, 혁신" },
            ],
          },
          {
            skillId: "DT-S2",
            skillNameKr: "MLOps",
            skillNameEn: "MLOps",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "ML 라이프사이클 기본 이해. Git/Docker 기초.", expectedGrade: "사원", keyActivities: "도구 학습, 환경 설정" },
              { level: 2, levelName: "초급", definitionKr: "모델 학습 파이프라인 구축. 실험 관리(MLflow).", expectedGrade: "대리", keyActivities: "파이프라인 구축, 실험 관리" },
              { level: 3, levelName: "중급", definitionKr: "모델 서빙/모니터링 시스템 구축. CI/CD 파이프라인.", expectedGrade: "과장", keyActivities: "모델 서빙, 모니터링, CI/CD" },
              { level: 4, levelName: "고급", definitionKr: "전사 MLOps 플랫폼 아키텍처. 거버넌스/보안 통합.", expectedGrade: "차장", keyActivities: "플랫폼 설계, 거버넌스, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "AI/ML 인프라 전략. 엣지-클라우드 통합 ML 아키텍처.", expectedGrade: "부장+", keyActivities: "AI 전략, 엣지-클라우드, 혁신" },
            ],
          },
        ],
      },
      {
        taskId: "DT-T2",
        taskNameKr: "AI/딥러닝",
        taskNameEn: "AI / Deep Learning",
        description: "차량용 AI 모델 개발 및 최적화",
        skills: [
          {
            skillId: "DT-S3",
            skillNameKr: "컴퓨터 비전",
            skillNameEn: "Computer Vision",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "영상처리 기초. CNN 기본 구조 이해.", expectedGrade: "사원", keyActivities: "영상처리 학습, 기본 모델 실행" },
              { level: 2, levelName: "초급", definitionKr: "객체 탐지/분류 모델 학습. 데이터 증강 적용.", expectedGrade: "대리", keyActivities: "모델 학습, 데이터 증강, 평가" },
              { level: 3, levelName: "중급", definitionKr: "차량용 비전 모델 설계. 경량화/양자화. 엣지 배포.", expectedGrade: "과장", keyActivities: "모델 설계, 경량화, 엣지 배포" },
              { level: 4, levelName: "고급", definitionKr: "멀티태스크 비전 아키텍처. BEV/Occupancy 네트워크.", expectedGrade: "차장", keyActivities: "아키텍처 설계, BEV, 기술 리딩" },
              { level: 5, levelName: "전문가", definitionKr: "비전 기술 전략. Foundation Model 적용 주도.", expectedGrade: "부장+", keyActivities: "기술 전략, Foundation Model, 연구" },
            ],
          },
          {
            skillId: "DT-S4",
            skillNameKr: "LLM/생성AI",
            skillNameEn: "LLM / Generative AI",
            skillCategory: "Technical",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "LLM 기본 개념 이해. 프롬프트 엔지니어링 기초.", expectedGrade: "사원", keyActivities: "프롬프트 작성, API 사용" },
              { level: 2, levelName: "초급", definitionKr: "RAG 시스템 기본 구축. Fine-tuning 수행.", expectedGrade: "대리", keyActivities: "RAG 구축, Fine-tuning, 평가" },
              { level: 3, levelName: "중급", definitionKr: "엔터프라이즈 RAG 설계. Agent 시스템 구축.", expectedGrade: "과장", keyActivities: "엔터프라이즈 RAG, Agent, 평가 체계" },
              { level: 4, levelName: "고급", definitionKr: "전사 생성AI 플랫폼 아키텍처. 거버넌스/안전장치 설계.", expectedGrade: "차장", keyActivities: "플랫폼 설계, 거버넌스, 안전" },
              { level: 5, levelName: "전문가", definitionKr: "생성AI 전략 수립. 자동차 도메인 특화 모델 개발.", expectedGrade: "부장+", keyActivities: "AI 전략, 도메인 모델, 혁신 리딩" },
            ],
          },
        ],
      },
    ],
  },
  {
    familyCode: "PD",
    familyNameKr: "상품기획",
    priority: 3,
    skillCount: 18,
    color: "gray",
    tasks: [
      {
        taskId: "PD-T1",
        taskNameKr: "상품기획/전략",
        taskNameEn: "Product Planning / Strategy",
        description: "차량 상품 기획 및 시장 전략 수립",
        skills: [
          {
            skillId: "PD-S1",
            skillNameKr: "상품기획",
            skillNameEn: "Product Planning",
            skillCategory: "Domain",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "자동차 시장 구조 및 세그먼트 기본 이해.", expectedGrade: "사원", keyActivities: "시장 조사, 경쟁사 분석 보조" },
              { level: 2, levelName: "초급", definitionKr: "경쟁 차종 분석. 고객 요구사항 정리. 사양표 작성.", expectedGrade: "대리", keyActivities: "경쟁 분석, 요구사항, 사양표" },
              { level: 3, levelName: "중급", definitionKr: "차종 상품 컨셉 수립. USP 도출. 수익성 분석.", expectedGrade: "과장", keyActivities: "컨셉 수립, USP, 수익성 분석" },
              { level: 4, levelName: "고급", definitionKr: "차종 라인업 전략 수립. 글로벌 상품 포트폴리오.", expectedGrade: "차장", keyActivities: "라인업 전략, 포트폴리오, 의사결정" },
              { level: 5, levelName: "전문가", definitionKr: "미래 모빌리티 상품 비전 수립. 신사업 전략 주도.", expectedGrade: "부장+", keyActivities: "비전 수립, 신사업, 글로벌 전략" },
            ],
          },
          {
            skillId: "PD-S2",
            skillNameKr: "시장조사/분석",
            skillNameEn: "Market Research / Analysis",
            skillCategory: "Domain",
            standardSource: "자체정의",
            levelCount: 5,
            levels: [
              { level: 1, levelName: "입문", definitionKr: "시장 데이터 수집 및 기초 분석. 리서치 방법론 이해.", expectedGrade: "사원", keyActivities: "데이터 수집, 기초 분석" },
              { level: 2, levelName: "초급", definitionKr: "정량/정성 조사 수행. 시장 트렌드 보고서 작성.", expectedGrade: "대리", keyActivities: "조사 수행, 트렌드 분석, 보고서" },
              { level: 3, levelName: "중급", definitionKr: "시장 세그멘테이션 분석. 고객 인사이트 도출.", expectedGrade: "과장", keyActivities: "세그멘테이션, 인사이트, 전략 제안" },
              { level: 4, levelName: "고급", definitionKr: "글로벌 시장 전략 수립. 예측 모델 기반 의사결정.", expectedGrade: "차장", keyActivities: "시장 전략, 예측 모델, 의사결정" },
              { level: 5, levelName: "전문가", definitionKr: "모빌리티 시장 비전 수립. 패러다임 전환 전략.", expectedGrade: "부장+", keyActivities: "비전 수립, 패러다임 전략" },
            ],
          },
        ],
      },
    ],
  },
];

// ── Column Header ─────────────────────────────────────────────────────────────

function ColumnHeader({
  label,
  color,
}: {
  label: string;
  color?: { bg: string; text: string };
}) {
  return (
    <div
      className={cn(
        "px-3 py-2.5 border-b border-neutral-200 shrink-0",
        color ? color.bg : "bg-neutral-50"
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-wider",
          color ? color.text : "text-neutral-500"
        )}
      >
        {label}
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function HRDBrowser() {
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  function selectFamily(family: Family) {
    setSelectedFamily(family);
    setSelectedTask(null);
    setSelectedSkill(null);
  }

  function selectTask(task: Task) {
    setSelectedTask(task);
    setSelectedSkill(null);
  }

  function selectSkill(skill: Skill) {
    setSelectedSkill(skill);
  }

  const activeColor = selectedFamily
    ? COLOR_MAP[selectedFamily.color]
    : null;
  if (selectedFamily && !activeColor) {
    throw new Error(
      `Color mapping not found for family color: ${selectedFamily.color}`
    );
  }

  const tasks = selectedFamily ? selectedFamily.tasks : [];
  const skills = selectedTask ? selectedTask.skills : [];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Column 1: Job Families */}
      <div className="w-52 shrink-0 flex flex-col border-r border-neutral-200 overflow-y-auto">
        <ColumnHeader label={`직군 (${STATIC_FAMILIES.length})`} />
        <ul className="py-1">
          {STATIC_FAMILIES.map((f) => {
            const c = COLOR_MAP[f.color];
            if (!c) {
              throw new Error(`Color not found for: ${f.color}`);
            }
            const isSelected =
              selectedFamily?.familyCode === f.familyCode;
            return (
              <li key={f.familyCode}>
                <button
                  onClick={() => selectFamily(f)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 transition-colors flex items-start gap-2",
                    isSelected
                      ? cn("border-r-2 border-blue-600", c.bg)
                      : "hover:bg-neutral-100"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-sm font-medium leading-tight",
                        isSelected ? c.text : "text-neutral-900"
                      )}
                    >
                      {f.familyNameKr}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0 rounded-full font-medium",
                          c.badge
                        )}
                      >
                        {PRIORITY_LABEL[f.priority]}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {f.skillCount}개 스킬
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <ChevronRight
                      className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", c.text)}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Column 2: Tasks */}
      <div className="w-52 shrink-0 flex flex-col border-r border-neutral-200 overflow-y-auto">
        {!selectedFamily ? (
          <div className="flex flex-col h-full">
            <ColumnHeader label="Task" />
            <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 text-center">
              <Layers className="w-7 h-7 text-neutral-200" />
              <p className="text-xs text-neutral-400">직군을 선택하세요</p>
            </div>
          </div>
        ) : (
          <>
            <ColumnHeader
              label={`Task (${tasks.length})`}
              color={activeColor ? { bg: activeColor.bg, text: activeColor.text } : undefined}
            />
            <ul className="py-1">
              {tasks.map((t) => {
                const isSelected = selectedTask?.taskId === t.taskId;
                return (
                  <li key={t.taskId}>
                    <button
                      onClick={() => selectTask(t)}
                      className={cn(
                        "w-full text-left px-3 py-3 transition-colors flex items-start gap-2",
                        isSelected
                          ? cn(
                              "border-r-2 border-blue-600",
                              activeColor?.bg
                            )
                          : "hover:bg-neutral-100"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "text-sm font-medium leading-tight",
                            isSelected
                              ? activeColor?.text
                              : "text-neutral-900"
                          )}
                        >
                          {t.taskNameKr}
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          {t.taskNameEn}
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          {t.skills.length}개 스킬
                        </div>
                      </div>
                      {isSelected && (
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 shrink-0 mt-0.5",
                            activeColor?.text
                          )}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Column 3: Skills */}
      <div className="w-60 shrink-0 flex flex-col border-r border-neutral-200 overflow-y-auto">
        {!selectedTask ? (
          <div className="flex flex-col h-full">
            <ColumnHeader label="스킬" />
            <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 text-center">
              <BookOpen className="w-7 h-7 text-neutral-200" />
              <p className="text-xs text-neutral-400">Task를 선택하세요</p>
            </div>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "px-3 py-2.5 border-b border-neutral-200 shrink-0",
                activeColor?.bg
              )}
            >
              <p className={cn("text-xs font-semibold", activeColor?.text)}>
                {selectedTask.taskNameKr}
              </p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                {selectedTask.description}
              </p>
            </div>
            <ul className="py-1">
              {skills.map((s) => {
                const CatIcon = CATEGORY_ICON[s.skillCategory] ?? Layers;
                const isSelected =
                  selectedSkill?.skillId === s.skillId;
                const hasLevels = s.levelCount === 5;
                return (
                  <li key={s.skillId}>
                    <button
                      onClick={() => selectSkill(s)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 transition-colors flex items-start gap-2",
                        isSelected
                          ? cn(
                              "border-r-2 border-blue-600",
                              activeColor?.bg
                            )
                          : "hover:bg-neutral-100"
                      )}
                    >
                      <CatIcon
                        className={cn(
                          "w-3.5 h-3.5 shrink-0 mt-0.5",
                          isSelected
                            ? activeColor?.text
                            : "text-neutral-400"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "text-sm leading-tight",
                            isSelected
                              ? cn(activeColor?.text, "font-medium")
                              : "text-neutral-900"
                          )}
                        >
                          {s.skillNameKr}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {s.standardSource !== "자체정의" && (
                            <span className="text-[10px] px-1 py-0 rounded bg-neutral-100 text-neutral-500 font-medium">
                              {s.standardSource.split(",")[0].trim()}
                            </span>
                          )}
                          {hasLevels ? (
                            <span className="text-[10px] text-green-600 font-medium">
                              L1-L5
                            </span>
                          ) : s.levelCount > 0 ? (
                            <span className="text-[10px] text-orange-500">
                              {s.levelCount}/5
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-400">
                              레벨 미정
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Column 4: L1-L5 Level Definitions */}
      <div className="flex-1 overflow-y-auto">
        {!selectedSkill ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-8">
            <Star className="w-10 h-10 text-neutral-200" />
            <p className="text-sm text-neutral-400">
              스킬을 선택하면 L1-L5 레벨 정의를 확인할 수 있습니다
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4 max-w-3xl">
            {/* Skill header */}
            <div
              className={cn(
                "rounded-lg border p-4",
                activeColor?.border,
                activeColor?.bg
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2
                    className={cn(
                      "text-base font-bold",
                      activeColor?.text
                    )}
                  >
                    {selectedSkill.skillNameKr}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {selectedSkill.skillNameEn}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={cn(
                      "text-[11px] px-2 py-0.5 rounded-full font-medium",
                      activeColor?.badge
                    )}
                  >
                    {selectedFamily?.familyNameKr}
                  </span>
                  {selectedTask && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">
                      {selectedTask.taskNameKr}
                    </span>
                  )}
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">
                    {selectedSkill.skillCategory}
                  </span>
                </div>
              </div>
              {selectedSkill.standardSource !== "자체정의" && (
                <p className="mt-2 text-[11px] text-neutral-500">
                  기준: {selectedSkill.standardSource}
                </p>
              )}
            </div>

            {/* Level cards */}
            {selectedSkill.levels.length === 0 ? (
              <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center">
                <p className="text-sm text-neutral-500">
                  이 스킬의 레벨 정의는 아직 작성되지 않았습니다
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  1순위 직군(전장/SW, 기능안전)부터 순차 작성 예정
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedSkill.levels.map((lv) => (
                  <div
                    key={lv.level}
                    className={cn(
                      "rounded-lg border p-4",
                      LEVEL_COLORS[lv.level - 1]
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded",
                          LEVEL_BADGE[lv.level - 1]
                        )}
                      >
                        L{lv.level}
                      </span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {lv.levelName}
                      </span>
                      <span className="ml-auto text-xs text-neutral-500">
                        {lv.expectedGrade}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-900 leading-relaxed">
                      {lv.definitionKr}
                    </p>
                    {lv.keyActivities && (
                      <div className="mt-2 pt-2 border-t border-neutral-200/50">
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                          <span className="font-medium text-neutral-600">
                            주요 활동:{" "}
                          </span>
                          {lv.keyActivities}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
