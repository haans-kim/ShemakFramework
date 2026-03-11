"use client";

export default function CrossPage() {
  return (
    <div className="h-[calc(100vh-64px)]">
      <iframe
        src="/cross-company-dashboard.html"
        className="w-full h-full border-0"
        title="Cross-Company Prediction Dashboard"
      />
    </div>
  );
}
