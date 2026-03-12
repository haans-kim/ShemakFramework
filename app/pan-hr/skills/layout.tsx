import { SkillsSidebar } from "@/components/skills/SkillsSidebar";

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SkillsSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
