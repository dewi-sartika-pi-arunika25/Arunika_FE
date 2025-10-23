export default function Pill({ children, className = "" }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}
      style={{ background: "rgba(250,225,60,.18)", color: "var(--foreground)" }}
    >
      {children}
    </span>
  );
}
