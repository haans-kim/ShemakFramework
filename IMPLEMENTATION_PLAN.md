# Shemak Frame - 구현 계획서

## 개요

InsightGroup의 4개 기존 HR 프로젝트를 하나의 **데모 쇼케이스 앱**으로 통합한다.
고객사 경영진/HR 임원을 대상으로 Shemak Frame의 전체 흐름을 시각적으로 시연하는 것이 목적이다.

### 핵심 방향
- 데모/쇼케이스 → 전체 흐름의 **시각적 임팩트** 중심
- Agent = **정적 대시보드 목업** (LLM 연동 없음, 사전 생성된 분석 결과)
- **완전 익명화 요약 데이터**만 사용 (개인/세부 데이터 없음)
- 메인 페이지 = Shemak Frame 구조도를 **인터랙티브 UI**로 구성
- 기존 프로젝트에서 **핵심 컴포넌트만 선별 이식** + 새로 작성

### 소스 프로젝트 매핑

| Shemak 축 | 역할 | 소스 프로젝트 |
|-----------|------|--------------|
| **Pan HR** | 주기적 적정 인력 관리 | SambioHRR(인력관리) + Hwaseung(인력계획) + MasterSkillset(스킬관리) |
| **Optic View** | 몰입도 예측 및 관리 | PoC (6개 분석 케이스) |
| **HR Agents** | AI Agent 기반 HR 운영 | PoC (3개 Agent 대시보드) + 신규 목업 |

---

## 1. 아키텍처

### Next.js 16 Mono-App

데모 앱이므로 ML 실행 불필요. 모든 데이터는 사전 생성된 요약 데이터.
Python Sidecar 없음.

```
Browser
  │
  ▼
Next.js 16 App
  ├── App Router (전체 페이지/라우트)
  ├── API Routes (better-sqlite3 → shemak.db)
  └── 정적 요약 데이터 + DB 조회
```

### 기술 스택

| 레이어 | 선택 | 비고 |
|--------|------|------|
| Framework | Next.js 16 (App Router) | 기존 3/4 프로젝트 호환 |
| React | 19.x | |
| Styling | Tailwind CSS v4 | |
| Components | shadcn/ui + Radix UI | SambioHRR에서 이식 |
| Charts | Recharts | 요약 차트 위주 |
| Animation | Framer Motion | 메인 페이지 흐름 애니메이션 |
| Database | SQLite (better-sqlite3) | 요약 데이터만 |
| Icons | Lucide React | |

---

## 2. 메인 페이지: Shemak Frame 인터랙티브 구조도

원본 쉐막 이미지의 구조를 **클릭 가능한 인터랙티브 UI**로 재구성한다.
이미지를 그대로 쓰지 않고, 구조적 카드/블록 레이아웃으로 만들어 각 모듈로 네비게이션.

```
┌────────────────────── Shemak Frame ──────────────────────────┐
│                                                               │
│  ┌──── ① Pan HR ────┐  ┌──── ③ HR Agents ──┐  ┌── ② Optic View ──┐
│  │ 주기적 적정       │  │ HR 운영            │  │ 몰입도 예측       │
│  │ 인력 관리         │  │                    │  │ 및 관리           │
│  │                   │  │                    │  │                   │
│  │ ┌─ HI ─────────┐ │  │ ┌─ HI ─────────┐  │  │ ┌─ HI ─────────┐ │
│  │ │ 적정 인력 산출│ │  │ │ 제도 설계     │  │  │ │ 진단: 설문    │ │
│  │ │ 거시/미시 예측│ │  │ │ 인사제도 설계 │  │  │ │ 조직/리더십   │ │
│  │ └──────────────┘ │  │ └──────────────┘  │  │ └──────────────┘ │
│  │       +           │  │       +            │  │       +           │
│  │ ┌─ AI ─────────┐ │  │ ┌─ AI ─────────┐  │  │ ┌─ AI ─────────┐ │
│  │ │ 적정 인력/   │ │  │ │ Agent Model  │  │  │ │ 설문 분석/   │ │
│  │ │ 근무량/스킬  │ │  │ │ 성과/보상/   │  │  │ │ 예측 모델링  │ │
│  │ │ 모델링       │ │  │ │ 조직 Agent   │  │  │ │              │ │
│  │ └──────────────┘ │  │ └──────────────┘  │  │ └──────────────┘ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘
│                                                               │
│  ┌─────────── IG Foundation Ontologies ──────────────────┐    │
│  │ 의식DB │ 기능DB │ 업무DB │ 직무DB │ SkillDB │ 평가DB │    │
│  │ ≈24.8M │ ≈1.2K  │ ≈60K   │ ≈15K   │ ≈100K   │ ≈6K   │    │
│  └───────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

### 인터랙션
- 각 축(Pan HR, Optic View, HR Agents)은 **카드 블록**으로 구성
- HI 영역 클릭 → 해당 모듈의 **요약 대시보드**로 이동
- AI 영역 클릭 → **AI 분석 결과** 대시보드로 이동
- 하단 IG Foundation Ontologies → 데이터 구조 오버뷰
- 축 간 **연결 화살표 애니메이션**으로 데이터 흐름 시각화
- hover 시 해당 축의 **핵심 KPI 미리보기** 표시

---

## 3. 프로젝트 구조

```
ShemakFrame/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃 (앱 셸)
│   ├── page.tsx                      # ★ Shemak Frame 인터랙티브 구조도
│   │
│   ├── pan-hr/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Pan HR 개요 (3개 서브모듈 카드)
│   │   ├── workforce/page.tsx        # 인력관리 요약 대시보드
│   │   ├── planning/page.tsx         # 인력계획 요약 대시보드
│   │   └── skills/page.tsx           # 스킬관리 요약 대시보드
│   │
│   ├── optic-view/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # 케이스 그리드
│   │   ├── engagement/page.tsx       # 몰입도 예측 요약
│   │   ├── org-risk/page.tsx         # 조직 리스크 요약
│   │   └── hr-diagnosis/page.tsx     # 인력수준 진단 요약
│   │
│   ├── agents/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Agent 허브 (3개 Agent 카드)
│   │   ├── performance-skill/page.tsx # 성과/스킬 Agent 목업
│   │   ├── compensation/page.tsx      # 보상 Agent 목업
│   │   └── staffing/page.tsx          # 조직/채용 Agent 목업
│   │
│   └── api/                          # 요약 데이터 API
│       ├── workforce/route.ts
│       ├── planning/route.ts
│       ├── skills/route.ts
│       └── survey/route.ts
│
├── components/
│   ├── shell/
│   │   ├── AppShell.tsx              # 통합 레이아웃
│   │   ├── TopNav.tsx                # 3축 탭 네비게이션
│   │   └── FlowIndicator.tsx         # 모듈 간 연계 흐름 표시
│   │
│   ├── home/                         # ★ 메인 페이지 전용
│   │   ├── ShemakFrameMap.tsx        # 인터랙티브 구조도 메인
│   │   ├── PillarCard.tsx            # 축별 카드 블록
│   │   ├── ModuleBlock.tsx           # HI/AI 모듈 블록
│   │   ├── OntologyBar.tsx           # 하단 Foundation Ontologies
│   │   └── FlowArrows.tsx            # 축 간 연결 화살표 애니메이션
│   │
│   ├── shared/
│   │   ├── KpiCard.tsx               # KPI 카드 (← PoC)
│   │   ├── SummaryChart.tsx          # 요약 차트 공통
│   │   └── MetricBadge.tsx           # 지표 배지
│   │
│   ├── workforce/                    # 인력관리 (← SambioHRR 핵심)
│   │   ├── OrgSummaryGrid.tsx        # 조직별 요약 그리드
│   │   ├── EfficiencyChart.tsx       # 근무 효율 차트
│   │   └── WorkPatternSummary.tsx    # 근무 패턴 요약
│   │
│   ├── planning/                     # 인력계획 (← Hwaseung → Recharts)
│   │   ├── ForecastChart.tsx         # 인원 예측 차트
│   │   ├── FteGauge.tsx              # FTE 게이지
│   │   └── ScenarioCards.tsx         # 시나리오 비교 카드
│   │
│   ├── skills/                       # 스킬관리 (← MasterSkillset 핵심)
│   │   ├── SkillMatrix.tsx           # 스킬 매트릭스 요약
│   │   ├── GapRadarChart.tsx         # 스킬 갭 레이더
│   │   └── SkillHierarchy.tsx        # 스킬 계층 트리
│   │
│   ├── optic-view/                   # Optic View (← PoC → React)
│   │   ├── EngagementSummary.tsx     # 몰입도 요약
│   │   └── RiskHeatmap.tsx           # 리스크 히트맵
│   │
│   ├── agents/                       # Agent 대시보드 목업
│   │   ├── AgentResultPanel.tsx      # Agent 분석 결과 패널 공통
│   │   ├── SkillGapReport.tsx        # 스킬 갭 리포트 목업
│   │   ├── CompSimulation.tsx        # 보상 시뮬레이션 결과 목업
│   │   └── StaffingPlan.tsx          # 채용 계획 결과 목업
│   │
│   └── ui/                           # shadcn/ui (← SambioHRR)
│
├── lib/
│   ├── db.ts                         # SQLite 연결 (← SambioHRR 패턴)
│   ├── demo-data.ts                  # 하드코딩 요약 데이터 (DB 대안/보조)
│   └── utils.ts                      # cn() 등 유틸리티
│
├── scripts/
│   └── seed-demo.ts                  # 익명화 요약 데이터 시드 스크립트
│
├── public/
│   └── shemak-frame.png              # 원본 이미지 (참조용)
│
├── shemak.db                         # 익명화 요약 데이터베이스
├── CLAUDE.md                         # 개발 가이드
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.js
```

---

## 4. 데이터베이스: 완전 익명화 요약 구조

개인 데이터 없이 **조직/팀 단위 요약 통계**만 저장.

### 스키마

```sql
-- 조직 계층 (익명화)
CREATE TABLE org_units (
  org_code TEXT PRIMARY KEY,
  org_name TEXT NOT NULL,           -- 'A센터', 'B담당', 'C-1팀' 등
  org_level TEXT NOT NULL,          -- 'company','center','division','team'
  parent_org_code TEXT,
  headcount INTEGER,
  display_order INTEGER
);

-- 팀별 인력관리 요약 (← SambioHRR)
CREATE TABLE workforce_summary (
  org_code TEXT REFERENCES org_units(org_code),
  year_month TEXT,                  -- '2025-01'
  headcount INTEGER,
  avg_efficiency REAL,              -- 평균 근무 효율 (%)
  avg_work_hours REAL,              -- 평균 주간 근무시간
  overtime_ratio REAL,              -- 초과근무 비율 (%)
  burnout_risk_level TEXT,          -- 'low','medium','high'
  PRIMARY KEY (org_code, year_month)
);

-- 팀별 인력계획 요약 (← Hwaseung)
CREATE TABLE planning_summary (
  org_code TEXT REFERENCES org_units(org_code),
  year INTEGER,
  current_headcount INTEGER,
  forecast_headcount INTEGER,
  fte_required REAL,
  fte_actual REAL,
  gap_status TEXT,                  -- 'surplus','balanced','shortage'
  PRIMARY KEY (org_code, year)
);

-- 팀별 스킬 요약 (← MasterSkillset)
CREATE TABLE skill_summary (
  org_code TEXT REFERENCES org_units(org_code),
  skill_category TEXT,              -- 'technical','leadership','domain'
  avg_proficiency REAL,             -- 팀 평균 보유 수준 (1-5)
  required_level REAL,              -- 필요 수준 (1-5)
  gap REAL,                         -- required - avg
  critical_skills_count INTEGER,    -- 심각한 갭 스킬 수
  PRIMARY KEY (org_code, skill_category)
);

-- 몰입도 조사 요약 (← PoC Optic View)
CREATE TABLE engagement_summary (
  org_code TEXT REFERENCES org_units(org_code),
  survey_date TEXT,
  engagement_score REAL,            -- 평균 몰입도 점수
  high_engagement_pct REAL,         -- 고몰입 비율 (%)
  risk_pct REAL,                    -- 주의 필요 비율 (%)
  top_factor TEXT,                  -- 주요 영향 요인
  PRIMARY KEY (org_code, survey_date)
);

-- Agent 분석 결과 (사전 생성된 목업 데이터)
CREATE TABLE agent_results (
  id INTEGER PRIMARY KEY,
  agent_type TEXT,                  -- 'performance_skill','compensation','staffing'
  target_org TEXT,                  -- 분석 대상 조직
  result_title TEXT,
  result_summary TEXT,
  result_data_json TEXT,            -- 차트/테이블 데이터 (JSON)
  recommendations_json TEXT         -- 추천 사항 (JSON)
);

-- IG Foundation Ontologies 메타데이터
CREATE TABLE ontology_meta (
  db_name TEXT PRIMARY KEY,         -- '의식DB','기능DB','업무DB' 등
  record_count TEXT,                -- '≈24,843,000' 등
  description TEXT,
  sample_fields_json TEXT           -- 샘플 필드 목록 (JSON)
);
```

### 데이터 규모

| 테이블 | 행 수 | 설명 |
|--------|--------|------|
| org_units | ~15 | 1회사 + 3센터 + 4담당 + 8팀 |
| workforce_summary | ~96 | 8팀 x 12개월 |
| planning_summary | ~24 | 8팀 x 3년 |
| skill_summary | ~24 | 8팀 x 3카테고리 |
| engagement_summary | ~8 | 8팀 x 1회 |
| agent_results | ~9 | 3 Agent x 3개 결과 |
| ontology_meta | ~7 | 7개 DB 메타 |
| **합계** | **~183** | |

### 조직 구조 (익명화)

```
IG모빌리티 (company)
├── A센터 (center)
│   ├── A-1담당 (division)
│   │   ├── A-1-1팀 (team) - 25명
│   │   └── A-1-2팀 (team) - 30명
│   └── A-2담당 (division)
│       ├── A-2-1팀 (team) - 20명
│       └── A-2-2팀 (team) - 22명
├── B센터 (center)
│   ├── B-1담당 (division)
│   │   ├── B-1-1팀 (team) - 35명  ← ★ 번아웃 위험 팀 (데모 시나리오 핵심)
│   │   └── B-1-2팀 (team) - 28명
│   └── B-2담당 (division)
│       └── B-2-1팀 (team) - 32명
└── C센터 (center)
    └── C-1담당 (division)
        └── C-1-1팀 (team) - 18명
```

---

## 5. End-to-End 데모 흐름

메인 페이지에서 시작하여 단계적으로 연계된 모듈을 탐색하는 시나리오.

```
★ 메인: Shemak Frame 구조도
  │
  ├──→ ① Pan HR 클릭
  │     │
  │     ├── 인력관리 대시보드
  │     │   - 팀별 근무 효율, 초과근무 현황
  │     │   - ★ "B-1-1팀 번아웃 위험 HIGH" 경고 배너
  │     │         ↓ 클릭 → 인력계획으로 연결
  │     │
  │     ├── 인력계획 대시보드
  │     │   - B-1-1팀 FTE 갭 (현재 8 FTE → 필요 10 FTE)
  │     │   - 시나리오 비교: 2명 추가 시 적정 수준
  │     │         ↓ "부족 스킬 확인" → 스킬관리로 연결
  │     │
  │     └── 스킬관리 대시보드
  │         - B-1-1팀 스킬 갭 레이더
  │         - 핵심 부족 스킬: "공정설계" Level 2 (필요 4), "데이터분석" Level 1 (필요 3)
  │               ↓ "Agent에게 채용 요청" → HR Agents로 연결
  │
  ├──→ ② Optic View 클릭
  │     - 몰입도 예측 결과 요약
  │     - 조직 리스크 히트맵
  │     - SHAP 요인 분석 요약
  │
  └──→ ③ HR Agents 클릭
        ├── 성과/스킬 Agent: OCA 진단 결과, RACI 매트릭스, 스킬 갭 리포트
        ├── 보상 Agent: 급여 시뮬레이션 결과 (평가등급 x 몰입유형 히트맵)
        └── 조직/채용 Agent: 채용 요건, 추천 스킬 프로필, 워크로드 개선 예측
```

---

## 6. 이식할 핵심 컴포넌트

### SambioHRR → 인력관리 요약 대시보드
| 소스 파일 | 이식 대상 | 방법 |
|----------|----------|------|
| `components/ui/` | `components/ui/` | 전체 복사 (shadcn/ui) |
| `components/dashboard/SummaryCards.tsx` | `components/shared/KpiCard.tsx` | 패턴 참조 후 간소화 |
| `components/dashboard/CenterLevelGrid.tsx` | `components/workforce/OrgSummaryGrid.tsx` | 패턴 참조 후 간소화 |
| `lib/db.ts` | `lib/db.ts` | 패턴 이식 (빌드타임/런타임 분리) |

### Hwaseung → 인력계획 요약 대시보드
| 소스 | 이식 대상 | 방법 |
|------|----------|------|
| Frontend 차트 패턴 | `components/planning/ForecastChart.tsx` | Recharts로 재작성 |
| 시나리오 UI 패턴 | `components/planning/ScenarioCards.tsx` | 새로 작성 |

### MasterSkillset → 스킬관리 요약 대시보드
| 소스 | 이식 대상 | 방법 |
|------|----------|------|
| 스킬 매트릭스 패턴 | `components/skills/SkillMatrix.tsx` | 패턴 참조 후 간소화 |
| 스킬 계층 UI | `components/skills/SkillHierarchy.tsx` | 새로 작성 |

### PoC → Optic View + Agent 대시보드
| 소스 파일 | 이식 대상 | 방법 |
|----------|----------|------|
| `app/page.tsx` | `app/optic-view/page.tsx` | CaseCard 패턴 이식 |
| `components/case-card.tsx` | `components/shared/` | 직접 이식 |
| `public/skill-agent-dashboard.html` | `components/agents/SkillGapReport.tsx` | HTML → React 변환 |
| `public/ilji-simulation-dashboard.html` | `components/agents/CompSimulation.tsx` | HTML → React 변환 |

---

## 7. 구현 일정

### Phase 1: Foundation + 메인 페이지 (1주)

| 작업 | 산출물 | 세부 |
|------|--------|------|
| 프로젝트 초기화 | Next.js 16 프로젝트 | `npx create-next-app@latest` |
| UI 기반 | shadcn/ui 셋업 | SambioHRR `components/ui/` 이식 |
| 앱 셸 | TopNav, 레이아웃 | 3축 탭 네비게이션 |
| **메인 페이지** | Shemak Frame 구조도 | Framer Motion 인터랙티브 UI |
| DB | 스키마 + 시드 데이터 | `shemak.db` 생성 |

### Phase 2: Pan HR 대시보드 (1~2주)

| 작업 | 산출물 | 소스 |
|------|--------|------|
| 인력관리 | 조직 그리드, 효율 차트, 번아웃 경고 | SambioHRR 핵심 이식 |
| 인력계획 | 예측 차트, FTE 게이지, 시나리오 카드 | Hwaseung 패턴 → Recharts |
| 스킬관리 | 스킬 매트릭스, 갭 레이더 | MasterSkillset 패턴 |
| 모듈 연결 | "다음 단계" 배너/버튼 | 신규 |

### Phase 3: Optic View + Agent 목업 (1~2주)

| 작업 | 산출물 | 소스 |
|------|--------|------|
| Optic View | 케이스 그리드, 몰입도/리스크 요약 | PoC 이식 |
| Agent 목업 | 3개 Agent 분석 결과 대시보드 | PoC HTML → React |
| E2E 연결 | 전체 흐름 완성 | 신규 |

### Phase 4: 폴리시 (3~5일)

| 작업 | 산출물 |
|------|--------|
| 애니메이션 | 페이지 전환, 차트 진입 효과 |
| 반응형 | 대형 화면/프로젝터 대응 |
| 최종 점검 | 데모 워크스루 테스트 |

---

## 8. 핵심 참조 파일 경로

| 파일 | 용도 |
|------|------|
| `/Users/hanskim/Projects/SambioHRR/components/ui/` | shadcn/ui 컴포넌트 전체 |
| `/Users/hanskim/Projects/SambioHRR/components/dashboard/SummaryCards.tsx` | KPI 요약 카드 패턴 |
| `/Users/hanskim/Projects/SambioHRR/components/dashboard/CenterLevelGrid.tsx` | 조직 그리드 패턴 |
| `/Users/hanskim/Projects/SambioHRR/lib/db.ts` | DB 연결 패턴 |
| `/Users/hanskim/Projects/PoC/app/page.tsx` | 케이스 카드 + 탭 네비게이션 패턴 |
| `/Users/hanskim/Projects/PoC/components/case-card.tsx` | CaseCard 컴포넌트 |
| `/Users/hanskim/Projects/PoC/public/skill-agent-dashboard.html` | Agent 대시보드 레이아웃/데이터 |
| `/Users/hanskim/Projects/PoC/public/ilji-simulation-dashboard.html` | 보상 시뮬레이션 레이아웃 |

---

## 9. 검증 체크리스트

- [ ] 메인 → Pan HR → 인력관리 → 인력계획 → 스킬관리 → Agent 클릭 흐름 정상
- [ ] 각 대시보드에 요약 데이터 정상 표시
- [ ] 모듈 간 "다음 단계" 연결 자연스러움
- [ ] 메인 페이지 Shemak Frame 구조도 인터랙티브 동작
- [ ] 완전 익명화: 개인 식별 가능 데이터 없음
- [ ] 프레젠테이션 환경 (대형 화면, 프로젝터) 반응형 대응
- [ ] Agent 대시보드 목업에 사전 생성 분석 결과 시각화
