"use client";

function StatCard({ label, children }) {
  return (
    <div className="ilcd-card">
      <div className="p-4 md:p-5">
        <div className="text-sm text-neutral-500 mb-1">{label}</div>
        <div className="text-base md:text-lg font-semibold">{children}</div>
      </div>
    </div>
  );
}

function Progress({ value }) {
  return (
    <div className="ilcd-track">
      <div className="ilcd-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

function MatchRow({ title, company, score }) {
  return (
    <div className="flex flex-col gap-3 md:gap-4 py-6 border-t first:border-0" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-base md:text-lg font-semibold">{title}</h4>
          <p className="text-sm text-neutral-600">{company}</p>
        </div>
        <a
          href="#"
          className="shrink-0 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ background: "var(--primary)" }}
        >
          Lihat Detail
        </a>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Progress value={score} />
        </div>
        <span className="text-xs md:text-sm text-neutral-600">Match Score: {score}%</span>
      </div>
    </div>
  );
}

export default function IntelligentDashboard() {
  return (
    <section className="mt-16">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Intelligent Lab Career Dashboard</h2>
        <p className="mt-3 text-neutral-600">Dapatkan Informasi Detail Mengenai Rekomendasi Pengembangan Karirmu.</p>
      </div>

      <div className="ilcd-shell mt-8">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <StatCard label="Role Utama">The Innovator</StatCard>
            <StatCard label="Base Fit Score">88%</StatCard>
            <StatCard label="Kekuatan Utama">
              <span className="ilcd-badge mr-1">Analitis</span>
              <span className="ilcd-badge mr-1">Kreatif</span>
              <span className="ilcd-badge">Problem Solving</span>
            </StatCard>
          </div>

          <hr className="my-8" style={{ borderColor: "var(--border)" }} />

          <h3 className="text-xl md:text-2xl font-bold">Job Match</h3>

          <MatchRow
            title="Product Manager"
            company='Tech Startup "Inovasi Digital" - Jakarta'
            score={92}
          />
          <MatchRow
            title="UI/UX Researcher"
            company='Creative Agency "Visuara" - Bandung'
            score={85}
          />
        </div>
      </div>
    </section>
  );
}
