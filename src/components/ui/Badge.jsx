export default function Badge({ children, className = "" }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold " +
        "bg-[var(--accent-3)] text-[var(--foreground)] " +
        className
      }
    >
      {children}
    </span>
  );
}
