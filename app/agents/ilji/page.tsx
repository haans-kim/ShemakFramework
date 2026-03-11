"use client";

export default function IljiPage() {
  return (
    <div className="h-[calc(100vh-64px)]">
      <iframe
        src="/ilji-simulation-dashboard.html"
        className="w-full h-full border-0"
        title="Ilji Simulation Dashboard"
      />
    </div>
  );
}
