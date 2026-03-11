"use client";

export default function WhPage() {
  return (
    <div className="h-[calc(100vh-64px)]">
      <iframe
        src="/wh-simulation-dashboard.html"
        className="w-full h-full border-0"
        title="WH Simulation Dashboard"
      />
    </div>
  );
}
