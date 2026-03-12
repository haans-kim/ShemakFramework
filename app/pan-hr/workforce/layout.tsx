import { WorkforceSidebar } from "@/components/workforce/WorkforceSidebar";

export default function WorkforceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <WorkforceSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
