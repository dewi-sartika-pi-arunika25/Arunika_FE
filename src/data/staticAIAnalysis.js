/**
 * Static AI Analysis Data - Fallback jika Gemini API belum dipanggil atau gagal
 * Format sesuai dengan output dari Gemini AI analysis
 * Enhanced dengan konten yang disesuaikan per role dan bahasa yang lebih natural
 */

// Mapping role combinations yang related
const relatedRoleCombinations = {
  'BE': ['FE', 'PM'],
  'FE': ['UI/UX', 'PM'],
  'PM': ['FE', 'BE'],
  'UI/UX': ['FE', 'PM'],
  'BE+FE': ['PM', 'UI/UX'],
  'PM+FE': ['BE', 'UI/UX'],
  'PM+BE': ['FE', 'UI/UX'],
  'FE+UI/UX': ['PM', 'BE']
};

// Helper untuk mendapatkan top 2 related roles
const getTop2RelatedRoles = (primaryRole) => {
  const normalizedRole = primaryRole?.toUpperCase() || '';
  
  // Check exact match first
  if (relatedRoleCombinations[normalizedRole]) {
    return relatedRoleCombinations[normalizedRole].slice(0, 2);
  }
  
  // Check combinations
  for (const [key, roles] of Object.entries(relatedRoleCombinations)) {
    if (normalizedRole.includes(key.split('+')[0]) || normalizedRole.includes(key.split('+')[1])) {
      return roles.slice(0, 2);
    }
  }
  
  // Default fallback
  return ['FE', 'PM'];
};

// Content per role untuk job fit analysis
const jobFitContent = {
  'BE': {
    primary: {
      title: 'Backend Developer',
      description: `Profil Anda sangat sesuai untuk peran Backend Developer. Kombinasi kemampuan analitis mendalam, pemikiran sistematis, dan kemampuan memecahkan masalah yang kuat membuat Anda ideal untuk membangun sistem yang robust dan scalable. Anda memiliki kemampuan untuk memahami arsitektur kompleks, mengoptimalkan performa database, dan merancang API yang efisien.`,
      careerPath: `Jalur karir yang bisa Anda ambil dimulai dari Junior Backend Developer, kemudian berkembang ke Mid-level dengan fokus pada penguasaan teknologi spesifik seperti Node.js, Python, atau Go. Selanjutnya, Anda bisa berkembang ke Senior Backend Developer dengan keahlian dalam desain sistem terdistribusi, lalu ke Tech Lead atau Software Architect yang bertanggung jawab atas arsitektur keseluruhan sistem.`
    },
    related: {
      'FE': {
        title: 'Frontend Developer',
        description: `Kombinasi Backend dan Frontend Developer (Full Stack) sangat cocok untuk Anda. Dengan pemahaman mendalam di backend, Anda akan mampu membuat frontend yang tidak hanya menarik secara visual tetapi juga terintegrasi dengan baik dengan sistem backend. Anda bisa mengoptimalkan performa aplikasi dari kedua sisi dan memahami arsitektur end-to-end.`
      },
      'PM': {
        title: 'Product Manager',
        description: `Peran Product Manager cocok karena Anda memahami aspek teknis secara mendalam. Kemampuan analitis dan pemahaman sistem yang kuat memungkinkan Anda membuat keputusan produk yang informed dan realistis secara teknis. Anda bisa menjadi jembatan yang efektif antara tim teknis dan bisnis, serta memprioritaskan fitur berdasarkan dampak teknis dan bisnis.`
      }
    }
  },
  'FE': {
    primary: {
      title: 'Frontend Developer',
      description: `Profil Anda ideal untuk peran Frontend Developer. Kombinasi perhatian terhadap detail, kemampuan analitis, dan kemampuan untuk menerjemahkan desain menjadi kode yang fungsional membuat Anda sangat efektif dalam membangun antarmuka pengguna yang menarik dan performant. Anda akan nyaman bekerja dengan framework modern seperti React, Vue, atau Next.js, serta mengoptimalkan performa dan user experience.`,
      careerPath: `Jalur pengembangan karir dimulai dari Junior Frontend Developer dengan fokus pada penguasaan HTML, CSS, dan JavaScript. Kemudian berkembang ke Mid-level dengan spesialisasi framework seperti React atau Vue, lalu ke Senior Frontend Developer dengan keahlian dalam arsitektur frontend, state management, dan optimasi performa. Selanjutnya bisa berkembang ke Frontend Architect atau Tech Lead yang mengatur arsitektur dan standar pengembangan frontend.`
    },
    related: {
      'UI/UX': {
        title: 'UI/UX Designer',
        description: `Kombinasi Frontend Developer dan UI/UX Designer sangat powerful. Dengan pemahaman teknis yang kuat, Anda mampu membuat desain yang tidak hanya indah secara visual tetapi juga feasible secara teknis. Anda bisa berkolaborasi lebih efektif dengan tim desain dan memahami constraint teknis saat merancang, sehingga menghasilkan solusi yang lebih praktis dan dapat diimplementasikan dengan baik.`
      },
      'PM': {
        title: 'Product Manager',
        description: `Peran Product Manager cocok karena Anda memiliki pemahaman mendalam tentang user experience dan aspek teknis frontend. Kemampuan untuk melihat produk dari perspektif pengguna dan teknis memungkinkan Anda membuat keputusan produk yang lebih informed. Anda bisa menjadi jembatan antara tim desain, engineering, dan bisnis dengan pemahaman yang lebih holistik.`
      }
    }
  },
  'PM': {
    primary: {
      title: 'Product Manager',
      description: `Profil Anda menunjukkan kemampuan yang sangat dibutuhkan untuk peran Product Manager. Kombinasi kemampuan analitis, kemampuan pengambilan keputusan yang tegas, dan pemikiran sistematis membuat Anda ideal untuk mengelola produk teknologi. Anda mampu memahami kebutuhan pengguna, memprioritaskan fitur, mengkoordinasikan tim lintas fungsi, dan membuat keputusan strategis yang berdampak pada kesuksesan produk.`,
      careerPath: `Jalur karir dimulai dari Associate Product Manager dengan fokus pada eksekusi fitur dan koordinasi tim. Kemudian berkembang ke Product Manager yang bertanggung jawab atas roadmap produk, lalu ke Senior Product Manager yang mengelola multiple produk atau produk kompleks. Selanjutnya bisa berkembang ke Product Director atau VP Product yang mengatur strategi produk secara keseluruhan.`
    },
    related: {
      'FE': {
        title: 'Frontend Developer',
        description: `Kombinasi Product Manager dengan pemahaman Frontend Development sangat valuable. Anda bisa membuat keputusan produk yang lebih informed karena memahami constraint dan peluang teknis di frontend. Kemampuan untuk berkomunikasi dengan tim engineering menggunakan bahasa yang sama akan mempercepat development dan mengurangi miskomunikasi.`
      },
      'BE': {
        title: 'Backend Developer',
        description: `Pemahaman Backend Development akan membuat Anda menjadi Product Manager yang lebih efektif. Anda bisa memahami kompleksitas sistem, estimasi teknis yang lebih akurat, dan membuat prioritisasi yang mempertimbangkan effort teknis. Kemampuan ini sangat berharga saat merencanakan roadmap dan memutuskan scope fitur.`
      }
    }
  },
  'UI/UX': {
    primary: {
      title: 'UI/UX Designer',
      description: `Profil Anda menunjukkan kemampuan analitis dan perhatian terhadap detail yang sangat dibutuhkan untuk peran UI/UX Designer. Kemampuan untuk memahami kebutuhan pengguna, merancang solusi yang intuitif, dan memastikan desain yang tidak hanya menarik tetapi juga fungsional membuat Anda ideal untuk peran ini. Anda akan efektif dalam melakukan riset pengguna, membuat wireframe, prototype, dan melakukan usability testing.`,
      careerPath: `Jalur karir dimulai dari Junior UI/UX Designer dengan fokus pada eksekusi desain. Kemudian berkembang ke Mid-level dengan keahlian dalam research dan strategi desain, lalu ke Senior UI/UX Designer yang mengelola kompleksitas desain produk besar. Selanjutnya bisa berkembang ke Design Lead atau Head of Design yang mengatur strategi dan standar desain organisasi.`
    },
    related: {
      'FE': {
        title: 'Frontend Developer',
        description: `Kombinasi UI/UX Designer dengan pemahaman Frontend Development sangat powerful. Anda bisa membuat desain yang tidak hanya indah tetapi juga feasible secara teknis. Kemampuan untuk berkomunikasi dengan developer menggunakan bahasa yang sama akan mempercepat proses development dan menghasilkan implementasi yang lebih akurat sesuai dengan desain.`
      },
      'PM': {
        title: 'Product Manager',
        description: `Pemahaman Product Management akan membuat Anda menjadi UI/UX Designer yang lebih strategis. Anda bisa melihat desain dari perspektif produk dan bisnis, membuat keputusan desain yang aligned dengan tujuan produk, dan berkolaborasi lebih efektif dengan tim product. Kemampuan ini sangat berharga saat membuat desain yang tidak hanya user-friendly tetapi juga business-driven.`
      }
    }
  }
};

// Development areas per role
const developmentAreasByRole = {
  'BE': `Berdasarkan analisis skill gap dan hasil skillmatch Anda sebagai Backend Developer, berikut adalah area pengembangan yang direkomendasikan:

1. Keterampilan Teknis - Prioritas Mendesak
Infrastruktur Cloud & DevOps: Pemahaman mendalam tentang cloud infrastructure (AWS, Azure, GCP) menjadi krusial. Fokus pada containerization dengan Docker dan Kubernetes, CI/CD pipelines, dan infrastructure as code. Mulai dengan sertifikasi AWS Cloud Practitioner, lalu lanjut ke Solutions Architect Associate. Praktikkan dengan membangun dan deploy aplikasi ke cloud, mengatur auto-scaling, dan monitoring.

Desain Sistem & Arsitektur: Untuk berkembang ke level senior, kuasai pola desain sistem, skalabilitas, dan arsitektur terdistribusi. Pelajari konsep microservices, event-driven architecture, dan distributed systems. Sumber daya: buku "Designing Data-Intensive Applications", "System Design Interview", dan platform seperti LeetCode System Design untuk praktik.

Database & Caching: Tingkatkan keahlian dalam database optimization, query tuning, dan caching strategies. Pelajari NoSQL databases (MongoDB, Redis), database sharding, dan replication patterns. Pahami kapan menggunakan SQL vs NoSQL dan bagaimana mengoptimalkan performa database.

2. Keterampilan Lunak - Prioritas Tinggi
Komunikasi Teknis: Kembangkan kemampuan untuk menjelaskan konsep teknis kompleks ke audiens non-teknis. Berlatih dengan presentasi internal tentang arsitektur sistem, menulis technical blog posts, dan membuat dokumentasi yang jelas. Gunakan diagram dan analogi untuk memudahkan pemahaman.

Mentoring & Knowledge Sharing: Dengan potensi kepemimpinan Anda, mulailah membimbing junior developers. Atur sesi code review, sharing session tentang best practices, dan buat dokumentasi teknis yang komprehensif. Fasilitasi diskusi teknis dalam tim dan berbagi pengalaman dari proyek yang sudah dikerjakan.

3. Pemikiran Strategis - Prioritas Sedang
Business Acumen: Pahami konteks bisnis dari keputusan teknis. Ikuti rapat bisnis, pelajari metrik bisnis, dan pahami bagaimana keputusan teknis berdampak pada revenue, cost, atau user experience. Kembangkan kemampuan untuk membuat trade-off antara technical perfection dan business needs.

Security & Performance: Tingkatkan awareness tentang security best practices, OWASP Top 10, dan performance optimization. Pelajari bagaimana mengidentifikasi dan mencegah security vulnerabilities, serta mengoptimalkan performa sistem untuk handle high traffic.`,

  'FE': `Berdasarkan analisis skill gap dan hasil skillmatch Anda sebagai Frontend Developer, berikut adalah area pengembangan yang direkomendasikan:

1. Keterampilan Teknis - Prioritas Mendesak
Modern Frontend Frameworks: Tingkatkan penguasaan framework modern seperti React, Vue, atau Next.js. Fokus pada advanced patterns seperti state management (Redux, Zustand), server-side rendering, dan static site generation. Pelajari optimasi performa, code splitting, dan lazy loading untuk meningkatkan user experience.

UI/UX Principles & Design Systems: Kembangkan pemahaman tentang prinsip desain, accessibility (WCAG), dan design systems. Pelajari bagaimana menerjemahkan desain menjadi kode yang maintainable dan scalable. Gunakan tools seperti Storybook untuk dokumentasi komponen dan memastikan konsistensi desain.

Testing & Quality Assurance: Kuasai berbagai teknik testing seperti unit testing (Jest, Vitest), integration testing, dan end-to-end testing (Playwright, Cypress). Pahami test-driven development (TDD) dan bagaimana membuat aplikasi yang reliable dan bug-free.

2. Keterampilan Lunak - Prioritas Tinggi
Komunikasi dengan Tim Desain: Kembangkan kemampuan untuk berkolaborasi efektif dengan UI/UX designers. Belajar membaca design specifications, memberikan feedback teknis yang konstruktif, dan berkomunikasi tentang constraint dan peluang teknis. Bangun hubungan yang baik dengan tim desain untuk menghasilkan produk yang lebih baik.

Presentasi & Demo: Tingkatkan kemampuan untuk mempresentasikan hasil kerja kepada stakeholder. Pelajari cara membuat demo yang efektif, menjelaskan fitur teknis dengan cara yang mudah dipahami, dan mendapatkan buy-in dari tim atau management. Buat dokumentasi visual dan interaktif untuk showcase proyek.

3. Pemikiran Strategis - Prioritas Sedang
Performance Optimization: Fokus pada optimasi performa frontend seperti bundle size optimization, image optimization, dan lazy loading. Pahami Core Web Vitals dan bagaimana mengoptimalkan untuk SEO. Gunakan tools seperti Lighthouse untuk mengukur dan meningkatkan performa.

Cross-functional Collaboration: Kembangkan kemampuan untuk bekerja dengan tim backend, QA, dan product. Pahami bagaimana frontend terintegrasi dengan sistem secara keseluruhan dan bagaimana membuat keputusan teknis yang mempertimbangkan impact ke seluruh sistem.`,

  'PM': `Berdasarkan analisis skill gap dan hasil skillmatch Anda sebagai Product Manager, berikut adalah area pengembangan yang direkomendasikan:

1. Keterampilan Teknis - Prioritas Mendesak
Technical Understanding: Kembangkan pemahaman dasar tentang teknologi yang digunakan dalam produk Anda. Pelajari konsep dasar frontend, backend, database, dan cloud infrastructure. Tidak perlu menjadi expert, tetapi cukup untuk memahami constraint teknis, estimasi development, dan membuat keputusan yang informed. Ikuti technical discussions dan bertanya untuk memahami lebih dalam.

Data Analysis & Metrics: Kuasai kemampuan untuk menganalisis data produk, memahami metrics penting seperti DAU, retention, conversion rate, dan revenue metrics. Pelajari tools seperti Google Analytics, Mixpanel, atau Amplitude. Kembangkan kemampuan untuk membuat data-driven decisions dan mengukur impact dari fitur yang diluncurkan.

Product Strategy & Roadmapping: Tingkatkan kemampuan untuk membuat product strategy, prioritization frameworks (RICE, Kano Model), dan roadmap yang aligned dengan business goals. Pelajari bagaimana melakukan competitive analysis, market research, dan user research untuk membuat keputusan strategis.

2. Keterampilan Lunak - Prioritas Tinggi
Stakeholder Management: Kembangkan kemampuan untuk mengelola berbagai stakeholder dengan interest yang berbeda. Belajar cara berkomunikasi dengan executive, engineering team, design team, dan business team dengan bahasa yang sesuai. Kuasai seni negosiasi dan mendapatkan buy-in untuk ide dan prioritas.

User Research & Empathy: Tingkatkan kemampuan untuk memahami user needs melalui berbagai metode seperti user interviews, surveys, usability testing, dan data analysis. Kembangkan user empathy dan kemampuan untuk melihat produk dari perspektif pengguna. Buat user personas dan journey maps yang informatif.

3. Pemikiran Strategis - Prioritas Sedang
Business Acumen: Pahami bisnis model, revenue streams, dan bagaimana produk berkontribusi pada business goals. Pelajari tentang pricing strategies, go-to-market strategies, dan competitive positioning. Kembangkan kemampuan untuk membuat business case dan mengukur ROI dari fitur atau inisiatif.

Agile & Scrum: Kuasai metodologi agile dan scrum untuk mengelola development process. Pahami bagaimana membuat user stories, sprint planning, dan retrospectives yang efektif. Belajar bagaimana menjadi effective product owner dalam scrum team dan memastikan product backlog yang well-prioritized.`,

  'UI/UX': `Berdasarkan analisis skill gap dan hasil skillmatch Anda sebagai UI/UX Designer, berikut adalah area pengembangan yang direkomendasikan:

1. Keterampilan Teknis - Prioritas Mendesak
Design Tools & Prototyping: Tingkatkan penguasaan tools seperti Figma, Sketch, atau Adobe XD. Fokus pada advanced features seperti components, design systems, dan interactive prototyping. Pelajari bagaimana membuat prototype yang high-fidelity dan dapat digunakan untuk user testing. Kuasai animasi dan micro-interactions untuk meningkatkan user experience.

User Research Methods: Kembangkan kemampuan untuk melakukan berbagai metode user research seperti user interviews, usability testing, surveys, dan A/B testing. Pelajari bagaimana menganalisis data kualitatif dan kuantitatif untuk mendapatkan insights. Pahami bagaimana membuat personas, journey maps, dan user flows yang informatif.

Frontend Basics: Pelajari dasar-dasar HTML, CSS, dan JavaScript untuk memahami constraint teknis. Tidak perlu menjadi developer, tetapi cukup untuk memahami feasibility desain dan berkomunikasi lebih efektif dengan development team. Pahami responsive design principles dan bagaimana desain diterjemahkan ke kode.

2. Keterampilan Lunak - Prioritas Tinggi
Communication & Presentation: Kembangkan kemampuan untuk mempresentasikan desain dengan jelas dan mendapatkan buy-in dari stakeholder. Pelajari cara menjelaskan design decisions, rationale di balik pilihan desain, dan bagaimana desain berkontribusi pada business goals. Buat case studies yang compelling untuk showcase hasil kerja.

Collaboration with Developers: Tingkatkan kemampuan untuk berkolaborasi dengan development team. Pelajari bagaimana membuat design specifications yang jelas, memberikan feedback yang konstruktif, dan memahami constraint teknis. Kembangkan kemampuan untuk berkomunikasi dalam bahasa yang sama dengan developer dan membuat trade-off yang baik antara design ideal dan technical feasibility.

3. Pemikiran Strategis - Prioritas Sedang
Product Thinking: Kembangkan kemampuan untuk melihat desain dari perspektif produk dan bisnis. Pahami bagaimana desain berkontribusi pada business metrics, user retention, dan conversion. Pelajari tentang product strategy, prioritization, dan bagaimana membuat desain yang tidak hanya user-friendly tetapi juga business-driven.

Accessibility & Inclusive Design: Tingkatkan awareness tentang accessibility (WCAG guidelines) dan inclusive design principles. Pelajari bagaimana membuat desain yang accessible untuk semua pengguna, termasuk mereka dengan disabilities. Pahami bagaimana desain dapat mempengaruhi diverse user groups dan bagaimana membuat produk yang lebih inklusif.`
};

// Next steps per role
const nextStepsByRole = {
  'BE': `Berdasarkan analisis komprehensif hasil skillmatch Anda sebagai Backend Developer, berikut adalah rencana aksi yang direkomendasikan:

Tindakan Segera (1-2 Minggu ke Depan):
1. Tetapkan Tujuan Karir Spesifik: Tentukan apakah Anda ingin fokus sebagai Backend Engineer Senior dengan spesialisasi tertentu (misalnya cloud architecture, distributed systems, atau security) atau berkembang ke Tech Lead/Engineering Manager. Tuliskan tujuan spesifik dan measurable: "Dalam 6 bulan, saya ingin menjadi Senior Backend Engineer dengan keahlian di cloud infrastructure dan microservices architecture."

2. Buat Skill Gap Assessment: Analisis deskripsi pekerjaan dari peran yang Anda targetkan dan identifikasi skill gap spesifik. Prioritaskan berdasarkan urgensi dan alignment dengan tujuan karir. Buat tracking system untuk memantau progress setiap skill.

3. Rencana Pembelajaran Terstruktur: Alokasikan 5-10 jam per minggu untuk pembelajaran fokus. Pecah menjadi 1-2 jam per hari atau 3-4 jam di akhir pekan. Fokus pada satu skill utama per bulan untuk memastikan mastery yang mendalam.

Tujuan Jangka Pendek (1-3 Bulan):
1. Cloud Infrastructure Project: Pilih satu cloud provider (AWS, Azure, atau GCP) dan bangun project yang komprehensif. Deploy aplikasi ke cloud, setup CI/CD pipeline, implement monitoring dan logging. Dokumentasikan perjalanan pembelajaran dan deploy ke produksi untuk portfolio.

2. Mulai Technical Blogging: Tulis tentang pengalaman belajar, best practices, atau solusi masalah teknis yang Anda temui. Mulai dengan blog internal perusahaan atau Medium. Ini akan membantu solidify pemahaman dan membangun personal brand sebagai technical expert.

3. Open Source Contribution: Pilih proyek open source yang relevan dan mulai berkontribusi. Mulai dengan bug fixes atau documentation improvements, lalu secara bertahap pindah ke fitur yang lebih kompleks. Ini akan meningkatkan skill teknis dan membangun jaringan.

Jalur Karir Jangka Panjang (6-12 Bulan):
1. Target Senior Role atau Tech Lead: Dengan pengembangan konsisten, dalam 6-12 bulan Anda seharusnya siap untuk peran senior atau tech lead. Mulailah mempersiapkan portfolio dengan case studies dari proyek yang berdampak, berlatih system design interviews, dan persiapkan cerita untuk behavioral questions.

2. Build Technical Leadership: Mulai mengambil ownership untuk proyek yang lebih kompleks, memimpin technical discussions, dan mentoring junior developers. Kembangkan kemampuan untuk membuat technical decisions yang berdampak dan mempengaruhi technical direction tim.

3. Professional Network: Hadiri konferensi backend/cloud (AWS re:Invent, GopherCon, dll), bergabung dengan komunitas profesional, dan bangun hubungan dengan senior engineers di peran yang Anda targetkan. Terlibat di LinkedIn dengan konten teknis dan berpartisipasi dalam diskusi.

Melacak Kemajuan:
- Quarterly review terhadap progress tujuan karir
- Update portfolio secara teratur dengan proyek dan pembelajaran baru
- Cari feedback dari senior engineers dan tech lead
- Adjust goals berdasarkan pembelajaran dan market trends

Sumber Daya untuk Pengembangan:
- Cloud Learning: AWS Training, A Cloud Guru, Linux Academy, official cloud provider documentation
- System Design: "Designing Data-Intensive Applications", "System Design Interview" books, LeetCode System Design
- Backend Development: Backend-specific courses di Udemy/Pluralsight, documentation dari framework yang digunakan
- Networking: Backend conferences, local meetups, LinkedIn communities untuk backend engineers`,

  'FE': `Berdasarkan analisis komprehensif hasil skillmatch Anda sebagai Frontend Developer, berikut adalah rencana aksi yang direkomendasikan:

Tindakan Segera (1-2 Minggu ke Depan):
1. Tetapkan Tujuan Karir Spesifik: Tentukan apakah Anda ingin fokus sebagai Frontend Engineer Senior dengan spesialisasi (misalnya React expert, performance optimization, atau accessibility) atau berkembang ke Frontend Architect/Tech Lead. Tuliskan tujuan spesifik: "Dalam 6 bulan, saya ingin menjadi Senior Frontend Engineer dengan keahlian di React ecosystem dan performance optimization."

2. Buat Skill Gap Assessment: Analisis deskripsi pekerjaan dari peran yang Anda targetkan dan identifikasi skill gap. Prioritaskan berdasarkan framework yang digunakan di perusahaan atau industry trends. Buat tracking untuk memantau progress.

3. Rencana Pembelajaran Terstruktur: Alokasikan 5-10 jam per minggu untuk pembelajaran. Fokus pada satu framework atau teknologi utama per bulan. Kombinasikan dengan project-based learning untuk memperkuat pemahaman.

Tujuan Jangka Pendek (1-3 Bulan):
1. Build Portfolio Project: Buat project frontend yang showcase kemampuan Anda. Fokus pada performance optimization, accessibility, dan best practices. Deploy ke production dan dokumentasikan decision-making process. Gunakan sebagai portfolio piece dan case study.

2. Design System Contribution: Berkontribusi pada design system perusahaan atau buat design system sendiri. Ini akan mengembangkan kemampuan untuk membuat reusable components dan memahami prinsip desain yang scalable.

3. Start Technical Blogging: Tulis tentang frontend best practices, performance tips, atau pengalaman belajar. Mulai dengan blog internal atau Medium. Ini akan membantu solidify pengetahuan dan membangun reputation sebagai frontend expert.

Jalur Karir Jangka Panjang (6-12 Bulan):
1. Target Senior Role atau Frontend Architect: Dengan pengembangan konsisten, dalam 6-12 bulan Anda seharusnya siap untuk peran senior. Mulailah mempersiapkan portfolio dengan case studies, berlatih frontend interviews, dan persiapkan cerita tentang proyek yang berdampak.

2. Build Frontend Leadership: Mulai mengambil ownership untuk frontend architecture decisions, memimpin code reviews, dan mentoring junior developers. Kembangkan kemampuan untuk membuat technical decisions yang mempengaruhi frontend direction tim.

3. Professional Network: Hadiri konferensi frontend (React Conf, Vue Conf, dll), bergabung dengan komunitas, dan bangun hubungan dengan senior frontend engineers. Terlibat di LinkedIn dan Twitter dengan konten frontend.

Melacak Kemajuan:
- Quarterly review progress
- Update portfolio dengan proyek baru
- Cari feedback dari senior frontend engineers
- Adjust goals berdasarkan market trends

Sumber Daya untuk Pengembangan:
- Frontend Learning: Frontend Masters, Egghead.io, official framework documentation
- Design Systems: "Design Systems" book, Storybook documentation, design system case studies
- Performance: Web.dev, Lighthouse, Core Web Vitals documentation
- Networking: Frontend conferences, local meetups, Twitter/LinkedIn communities`,

  'PM': `Berdasarkan analisis komprehensif hasil skillmatch Anda sebagai Product Manager, berikut adalah rencana aksi yang direkomendasikan:

Tindakan Segera (1-2 Minggu ke Depan):
1. Tetapkan Tujuan Karir Spesifik: Tentukan apakah Anda ingin fokus sebagai Product Manager Senior dengan spesialisasi (misalnya B2B, B2C, atau platform products) atau berkembang ke Product Director/VP Product. Tuliskan tujuan spesifik: "Dalam 6 bulan, saya ingin menjadi Senior Product Manager dengan keahlian di platform products dan data-driven decision making."

2. Buat Product Knowledge Base: Mulai dokumentasikan insights tentang produk, user feedback, metrics, dan competitive analysis. Buat sistem untuk tracking key metrics dan trends. Ini akan membantu Anda membuat keputusan yang lebih informed dan membangun institutional knowledge.

3. Rencana Pembelajaran Terstruktur: Alokasikan waktu untuk mempelajari product management frameworks, tools, dan best practices. Fokus pada satu area per bulan seperti user research, data analysis, atau product strategy. Gabungkan dengan praktik langsung di proyek yang sedang dikerjakan.

Tujuan Jangka Pendek (1-3 Bulan):
1. Launch One Major Feature: Take ownership untuk meluncurkan satu fitur utama dari ide hingga launch. Ini akan mengembangkan kemampuan end-to-end product management termasuk user research, prioritization, coordination, dan measurement. Dokumentasikan learnings dan impact.

2. Build Analytics Skills: Tingkatkan kemampuan untuk menggunakan analytics tools (Google Analytics, Mixpanel, Amplitude). Buat dashboard untuk key metrics, lakukan analysis untuk identify trends, dan gunakan data untuk membuat product decisions. Presentasikan insights kepada tim.

3. User Research Initiative: Lakukan user research project yang komprehensif. Lakukan user interviews, create personas, dan buat user journey maps. Gunakan insights untuk membuat product recommendations. Presentasikan findings kepada stakeholder.

Jalur Karir Jangka Panjang (6-12 Bulan):
1. Target Senior PM atau Product Director: Dengan track record yang solid, dalam 6-12 bulan Anda seharusnya siap untuk peran senior. Mulailah mempersiapkan portfolio dengan case studies dari fitur yang berdampak, prepare untuk product interviews, dan persiapkan cerita tentang keputusan produk yang sukses.

2. Build Product Leadership: Mulai mengambil ownership untuk product strategy, memimpin product discussions, dan mentoring junior PMs. Kembangkan kemampuan untuk membuat strategic decisions yang mempengaruhi direction produk dan business.

3. Professional Network: Hadiri product conferences (ProductCon, Mind the Product), bergabung dengan product communities, dan bangun hubungan dengan senior product managers. Terlibat di LinkedIn dengan konten product management dan berpartisipasi dalam diskusi.

Melacak Kemajuan:
- Quarterly review progress terhadap goals
- Track metrics dari fitur yang diluncurkan
- Cari feedback dari stakeholders dan users
- Adjust strategy berdasarkan market trends dan user feedback

Sumber Daya untuk Pengembangan:
- Product Learning: "Inspired", "Hooked", "The Lean Startup" books, Product School courses
- Analytics: Google Analytics Academy, Mixpanel tutorials, Amplitude University
- User Research: "The Mom Test", "Don't Make Me Think" books, user research methodologies
- Networking: Product conferences, Product Management communities, LinkedIn groups`,

  'UI/UX': `Berdasarkan analisis komprehensif hasil skillmatch Anda sebagai UI/UX Designer, berikut adalah rencana aksi yang direkomendasikan:

Tindakan Segera (1-2 Minggu ke Depan):
1. Tetapkan Tujuan Karir Spesifik: Tentukan apakah Anda ingin fokus sebagai UI/UX Designer Senior dengan spesialisasi (misalnya mobile design, enterprise UX, atau design systems) atau berkembang ke Design Lead/Head of Design. Tuliskan tujuan spesifik: "Dalam 6 bulan, saya ingin menjadi Senior UI/UX Designer dengan keahlian di design systems dan enterprise UX."

2. Buat Design Portfolio: Mulai kumpulkan dan dokumentasikan proyek-proyek terbaik Anda. Buat case studies yang detail termasuk problem, process, solution, dan impact. Gunakan portfolio untuk showcase kemampuan dan sebagai tool untuk reflection dan improvement.

3. Rencana Pembelajaran Terstruktur: Alokasikan waktu untuk mempelajari design principles, tools, dan methodologies. Fokus pada satu area per bulan seperti user research, interaction design, atau design systems. Gabungkan dengan praktik langsung melalui proyek atau redesign.

Tujuan Jangka Pendek (1-3 Bulan):
1. Complete One Design Project: Take ownership untuk satu proyek desain lengkap dari research hingga final design. Lakukan user research, create personas dan user flows, buat wireframes dan prototypes, dan lakukan usability testing. Dokumentasikan seluruh process sebagai case study.

2. Build Design System: Berkontribusi pada design system atau buat design system sendiri. Ini akan mengembangkan kemampuan untuk membuat reusable components, establish design principles, dan memahami scalable design. Presentasikan design system kepada tim dan dapatkan feedback.

3. User Research Project: Lakukan user research project yang komprehensif. Lakukan user interviews, usability testing, dan analyze data untuk mendapatkan insights. Gunakan insights untuk membuat design recommendations. Presentasikan findings dengan stakeholder dan developers.

Jalur Karir Jangka Panjang (6-12 Bulan):
1. Target Senior Designer atau Design Lead: Dengan portfolio yang solid, dalam 6-12 bulan Anda seharusnya siap untuk peran senior. Mulailah mempersiapkan portfolio dengan case studies yang compelling, prepare untuk design interviews, dan persiapkan cerita tentang design decisions yang berdampak.

2. Build Design Leadership: Mulai mengambil ownership untuk design direction, memimpin design discussions, dan mentoring junior designers. Kembangkan kemampuan untuk membuat design decisions yang mempengaruhi user experience dan business goals.

3. Professional Network: Hadiri design conferences (UX Week, Design Systems Conference), bergabung dengan design communities (Designer Hangout, UX Mastery), dan bangun hubungan dengan senior designers. Terlibat di LinkedIn, Dribbble, atau Behance dengan konten design.

Melacak Kemajuan:
- Quarterly review progress
- Update portfolio dengan proyek baru dan learnings
- Cari feedback dari users, stakeholders, dan senior designers
- Adjust design approach berdasarkan user feedback dan industry trends

Sumber Daya untuk Pengembangan:
- Design Learning: "Don't Make Me Think", "The Design of Everyday Things" books, Interaction Design Foundation courses
- Tools: Figma tutorials, prototyping tools documentation, design system resources
- User Research: "The Mom Test", Nielsen Norman Group articles, user research methodologies
- Networking: Design conferences, local design meetups, Dribbble/Behance communities, LinkedIn design groups`
};

// Generate job fit analysis based on primary role
const generateJobFitAnalysis = (primaryRole) => {
  const normalizedRole = primaryRole?.toUpperCase() || 'BE';
  const roleKey = normalizedRole.includes('+') ? normalizedRole : normalizedRole.split('/')[0];
  
  const content = jobFitContent[roleKey] || jobFitContent['BE'];
  const relatedRoles = getTop2RelatedRoles(normalizedRole);
  
  let analysis = `Berdasarkan hasil skillmatch yang Anda miliki, berikut adalah peran yang paling sesuai dengan karakteristik dan profil Anda. Analisis ini mempertimbangkan kombinasi kemampuan analitis, perhatian terhadap detail, kemampuan memecahkan masalah, dan pendekatan terstruktur yang Anda miliki.\n\n`;
  
  // Primary role
  analysis += `1. ${content.primary.title} - ${content.primary.description}\n\n`;
  if (content.primary.careerPath) {
    analysis += `${content.primary.careerPath}\n\n`;
  }
  
  // Related roles (top 2)
  relatedRoles.forEach((relatedRole, index) => {
    const relatedContent = content.related[relatedRole];
    if (relatedContent) {
      analysis += `${index + 2}. ${relatedContent.title} - ${relatedContent.description}\n\n`;
    }
  });
  
  analysis += `Potensi Tantangan dan Solusi:\n`;
  analysis += `Meskipun profil Anda sangat sesuai untuk karir di teknologi, ada beberapa area yang perlu diperhatikan:\n\n`;
  analysis += `Keseimbangan Kerja-Hidup: Dengan profil yang berdedikasi dan memperhatikan detail, Anda mungkin cenderung bekerja terlalu keras. Penting untuk menetapkan batasan yang jelas dan mengambil jeda secara teratur untuk menghindari burnout. Jadwalkan istirahat secara konsisten dan pastikan ada waktu untuk aktivitas di luar pekerjaan yang membantu refresh mental.\n\n`;
  analysis += `Komunikasi dengan Stakeholder: Bergantung pada peran yang Anda pilih, kemampuan berkomunikasi dengan berbagai stakeholder menjadi krusial. Berlatihlah menjelaskan konsep teknis atau desain dengan cara yang mudah dipahami oleh audiens non-teknis. Gunakan analogi, visualisasi, atau storytelling untuk membuat komunikasi lebih efektif.\n\n`;
  analysis += `Potensi Pengembangan:\n`;
  analysis += `Profil Anda menunjukkan potensi yang sangat tinggi untuk berkembang dari kontributor individu ke peran yang lebih strategis dan leadership. Dalam 2-3 tahun ke depan, dengan fokus pengembangan yang tepat dan konsisten, Anda bisa berkembang ke senior level, tech lead, design lead, atau bahkan management role tergantung pada minat dan tujuan karir Anda. Kunci utamanya adalah konsistensi dalam pembelajaran, mengambil tanggung jawab untuk proyek yang lebih menantang, dan membangun network yang kuat.`;
  
  return analysis;
};

// Base static analysis dengan bahasa yang lebih natural
const baseStaticAnalysis = {
  personality_summary: `Berdasarkan hasil skillmatch yang Anda miliki, profil menunjukkan karakteristik yang sangat menarik untuk pengembangan karir di bidang teknologi. Analisis ini menggabungkan berbagai aspek dari kepribadian, minat, dan kemampuan Anda untuk memberikan insight yang komprehensif tentang potensi karir Anda.\n\n` +
    
    `Profil Anda menunjukkan kombinasi yang seimbang antara kemampuan analitis yang mendalam, perhatian terhadap detail yang tinggi, dan kemampuan pengambilan keputusan yang tegas dan tepat waktu. Anda adalah tipe individu yang memiliki inisiatif tinggi, tidak takut menghadapi tantangan kompleks, dan sangat sistematis dalam pendekatan kerja. Karakteristik ini sangat cocok untuk peran di bidang teknologi yang seringkali membutuhkan pengambilan keputusan cepat, kemampuan memecahkan masalah yang kuat, dan kemampuan untuk bekerja di bawah tekanan dengan tetap menjaga kualitas.\n\n` +
    
    `Dari aspek minat dan passion, profil Anda menunjukkan ketertarikan yang kuat pada kegiatan analitis, pemecahan masalah kompleks, dan eksplorasi konsep-konsep yang menantang. Ini sangat sesuai dengan karir di teknologi yang terus berkembang pesat dan memerlukan pembelajaran berkelanjutan serta adaptasi terhadap perubahan. Selain itu, Anda memiliki potensi kepemimpinan dan kewirausahaan yang bisa dikembangkan lebih lanjut, yang akan membuka peluang untuk peran yang lebih strategis di masa depan.\n\n` +
    
    `Gaya kerja alami Anda cenderung lebih suka bekerja secara mandiri dengan tenggat waktu yang jelas dan struktur yang terdefinisi, namun juga sangat mampu berkolaborasi dalam tim ketika diperlukan. Anda menghargai struktur dan proses yang jelas karena memberikan sense of security dan predictability, namun tetap fleksibel dalam menghadapi perubahan dan situasi yang dinamis. Fleksibilitas ini sangat berharga di industri teknologi yang terus berubah.\n\n` +
    
    `Dari aspek komunikasi, Anda lebih efektif dalam diskusi yang fokus dan terstruktur dengan agenda yang jelas. Presentasi data, dokumentasi teknis, atau laporan yang detail adalah cara yang nyaman dan natural bagi Anda untuk menyampaikan informasi. Dalam kolaborasi tim, Anda menghargai rekan kerja yang juga memperhatikan detail, dapat diandalkan untuk menyelesaikan pekerjaan sesuai jadwal, dan memiliki pendekatan yang sistematis. Komunikasi Anda cenderung langsung dan tepat sasaran, yang sangat efektif dalam lingkungan teknologi yang bergerak cepat dan menghargai efisiensi.`
};

// Main function to get static analysis
export const getStaticAIAnalysis = (primaryRole = null) => {
  const role = primaryRole || 'BE';
  const roleKey = role.toUpperCase().includes('+') ? role.toUpperCase() : role.toUpperCase().split('/')[0];
  
  return {
    personality_summary: baseStaticAnalysis.personality_summary,
    job_fit_analysis: generateJobFitAnalysis(role),
    development_areas: developmentAreasByRole[roleKey] || developmentAreasByRole['BE'],
    next_steps: nextStepsByRole[roleKey] || nextStepsByRole['BE']
  };
};

// Legacy support
export const staticAIAnalysis = getStaticAIAnalysis();

/**
 * Check if static analysis should be used (when AI is pending or failed)
 */
export const shouldUseStaticAnalysis = (aiStatus, hasAIInsight) => {
  return (!hasAIInsight && (aiStatus === 'pending' || aiStatus === 'failed' || !aiStatus));
};
