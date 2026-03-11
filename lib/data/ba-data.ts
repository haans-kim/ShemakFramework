export const kpiData = {
  dataScale: { value: "46 x 62", label: "설문 응답자 x 문항 수" },
  dataTypes: { value: "4종", label: "투입 데이터 유형" },
  processingTime: { value: "3~5분", label: "AI 가설 생성 소요시간" },
};

export const inputDataTypes = [
  {
    title: "설문 Raw 데이터",
    description: "46명 응답자 x 62문항, Likert 척도 + 서술형",
    detail: "텍스트/분류 매핑 포함",
  },
  {
    title: "As-is 인사제도",
    description: "직급/승진/평가/보상 제도 간략 서술",
    detail: "현행 제도 구조 파악용",
  },
  {
    title: "시장 보상수준",
    description: "시장 급여 벤치마크 데이터",
    detail: "외부 경쟁력 비교 기준",
  },
  {
    title: "보상내역",
    description: "3개년 급여/상여 내역",
    detail: "실제 고객사 데이터 사용",
  },
];

export const pipelineSteps = [
  {
    step: 1,
    title: "데이터 수집 및 정제",
    method: "수작업",
    description: "항목별 구조화 및 전처리 작업",
  },
  {
    step: 2,
    title: "RAG 지식베이스 구축",
    method: "유료 API 활용",
    description: "INPUT 데이터를 청크 분할 후 임베딩 변환",
    note: "가장 엄밀하게 구축해야 하는 부분",
  },
  {
    step: 3,
    title: "AI 결과 생성",
    method: "유료 API 활용",
    description: "가설 생성 → 근거 매칭 → 결과 시각화",
    note: "설명가능한 AI (근거 인용)",
  },
];

export const outputFeatures = [
  {
    title: "빠른 인사이트 도출",
    description: "AI 가설 및 근거 생성",
    detail: "데이터 기반 가설 및 개선안 신속 자동 생성",
  },
  {
    title: "설명가능한 AI",
    description: "설문/제도/보상 데이터 교차 검증/인용",
    detail: "근거 매칭으로 설명력 확보",
  },
  {
    title: "심층 분석 지원",
    description: "채팅 기반 사용자 자유 탐색",
    detail: "컨설턴트가 자연어 질의로 원본 데이터 기반 심층 탐색",
  },
];

export const selfAssessment = {
  status: "실험적 PoC",
  finding: "투입한 고객사 데이터 기반으로 결과 생성은 되었으나, 엄밀 구축/검증 부족하다 판단함",
  implications: [
    "사람의 Input이 최소화될 때 AI가 도출하는 분석과 개선안의 수준 확인",
    "개입 가능 영역: 데이터 선택, AI 모델 선택, Output Tone & Manner 변경",
    "분석지표 및 시각화는 도출 결과에 따라 결정하는 구조",
  ],
};
