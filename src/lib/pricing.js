export const plans = [
  {
    id: "free",
    name: "Free",
    price: "Rp 0",
    cadence: "Selamanya",
    features: [
      { label: "Skill Match", on: true },
      { label: "Job Connector", on: true },
    ],
    cta: "Pilih Paket",
    highlighted: false,
    // badge: undefined
  },
  {
    id: "pro-yearly",
    name: "Tahunan",
    price: "Rp 150rb",
    cadence: "/ tahun",
    features: [
      { label: "Semua fitur paket Free", on: true },
      { label: "Deep Skill Connector", on: true },
      { label: "Readiness Career Report", on: true },
      { label: "Chatbot AI Eksklusif", on: true },
    ],
    cta: "Pilih Paket",
    highlighted: true,
    badge: "PALING POPULER",
  },
];
