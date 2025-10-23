export default function ProgressBar({ value = 0, max = 1 }) {
  const pct = Math.round((value / Math.max(max, 1)) * 100);
  return (
    <div className="w-full h-2.5 rounded-full bg-neutral-200 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, rgba(250,225,60,.9) 0%, var(--primary) 60%, #ff9f3d 100%)",
        }}
      />
    </div>
  );
}
