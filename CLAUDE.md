# Shemak Frame - 개발 가이드

## 프로젝트 개요
Shemak Frame - InsightGroup HR AI 데모 쇼케이스 플랫폼.
고객사 경영진/HR 임원 대상 프레젠테이션용 데모 앱.

## 기술 스택
- **Framework**: Next.js 16 (App Router) + TypeScript
- **UI**: shadcn/ui + Radix UI, Tailwind CSS v4
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Database**: SQLite (better-sqlite3) - 요약 데이터만
- **Icons**: Lucide React

## 개발 명령어
```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run seed      # 데모 데이터 시드
```

## 핵심 규칙

### 코딩 규칙
1. **DEFAULT 값 사용 금지**: 값이 없으면 에러 발생 또는 명시적 undefined/null
2. **빈 객체/배열 기본값 금지**
3. **try-catch에서 에러 숨기기 금지**

### 데모 앱 특성
- 모든 데이터는 **익명화 요약 데이터** (개인 데이터 없음)
- Agent는 **정적 대시보드 목업** (LLM 연동 없음)
- Python 백엔드 없음 (모든 것이 Next.js 내에서 처리)
- DB는 매우 작음 (~183행) - 팀 단위 요약 통계만

### 프로젝트 구조
- `app/` - Next.js App Router 페이지
  - `page.tsx` - 메인: Shemak Frame 인터랙티브 구조도
  - `pan-hr/` - Pan HR (인력관리, 인력계획, 스킬관리)
  - `optic-view/` - Optic View (몰입도/리스크 분석)
  - `agents/` - HR Agents (정적 대시보드 목업)
- `components/` - React 컴포넌트
  - `home/` - 메인 페이지 전용 (ShemakFrameMap 등)
  - `shell/` - 앱 셸 (TopNav, 레이아웃)
  - `ui/` - shadcn/ui 기본 컴포넌트
- `lib/` - DB 연결, 유틸리티
- `shemak.db` - 익명화 요약 데이터베이스

### 소스 프로젝트 참조
| 모듈 | 소스 |
|------|------|
| 인력관리 | 내부 프로젝트 (인력관리 대시보드) |
| 인력계획 | 내부 프로젝트 (인력계획 시스템) |
| 스킬관리 | 내부 프로젝트 (스킬관리 플랫폼) |
| Optic View + Agents | 내부 프로젝트 (PoC 사례) |
