"use client";

export default function InsightChips({
  role = "Frontend",
  disc = "Analytical",
  gap = "System Design",
}) {
  const Chip = ({ children }) => (
    <span className="px-3 py-1 rounded-full text-xs border border-[color:var(--mc-border)] bg-white/5">
      {children}
    </span>
  );
  return (
    <div className="flex flex-wrap gap-2">
      <Chip>Role Fit: {role}</Chip>
      <Chip>DISC: {disc}</Chip>
      <Chip>Gap: {gap}</Chip>
    </div>
  );
}
