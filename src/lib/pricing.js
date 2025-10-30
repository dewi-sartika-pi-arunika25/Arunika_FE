export const plans = [
  {
    id: "free",
    name: "Gratis",
    price: "Rp 0",
    cadence: "Selamanya",
    badge: { label: "Gratis", tone: "free" },
    features: [
      { label: "Skill Connector", on: true },
      { label: "Roadmap Dasar", on: true },
      { label: "Deep Skill Connector", on: false },
      { label: "Laporan Kesiapan Karier", on: false },
      { label: "Chatbot Eksklusif", on: false },
    ],
    cta: "Mulai Gratis",
  },
  {
    id: "yearly",
    name: "Tahunan",
    price: "Rp 150rb",
    cadence: "/tahun",
    highlighted: true,
    badge: { label: "Paling Populer", tone: "pro" },
    features: [
      { label: "Semua fitur paket Gratis", on: true },
      { label: "Deep Skill Connector", on: true },
      { label: "Laporan Kesiapan Karier", on: true },
      { label: "Chatbot AI Eksklusif", on: true },
    ],
    cta: "Pilih Paket",
  },
];
