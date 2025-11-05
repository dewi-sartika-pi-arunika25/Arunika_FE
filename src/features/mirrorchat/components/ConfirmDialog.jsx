"use client";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onCancel} />
      <div
        className="relative w-[92%] max-w-md rounded-2xl p-5 sm:p-6 fade-in"
        style={{
          background: "white",
          border: "1px solid var(--mc-border)",
          boxShadow: "0 24px 60px rgba(0,0,0,.2)",
        }}
      >
        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--mc-text)" }}>
          {title}
        </h3>
        <p
          className="text-sm mb-5"
          style={{ color: "color-mix(in oklab, var(--mc-text) 80%, transparent)" }}
        >
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              border: "1px solid var(--mc-border)",
              color: "var(--mc-text)",
              background: "white",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "#ff3b30" }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
