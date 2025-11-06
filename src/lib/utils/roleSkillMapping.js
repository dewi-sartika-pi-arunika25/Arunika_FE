/**
 * Mapping skill gaps berdasarkan role yang cocok
 * Jika role fit 40%, skill gap 60%, ini detail pengembangan yang dibutuhkan
 */

export const ROLE_SKILL_GAP_MAPPING = {
  "Frontend Developer": {
    // Jika skill gap tinggi, fokus pada:
    highGap: [
      {
        skill: "React/Vue.js Fundamentals",
        description: "Pahami konsep component lifecycle, hooks, dan state management",
        priority: 5,
        category: "hard", // Hard skill (technical)
        resources: [
          "https://react.dev/learn",
          "https://vuejs.org/tutorial/",
          "https://www.freecodecamp.org/news/react-beginners-handbook/"
        ]
      },
      {
        skill: "CSS & Styling Modern",
        description: "CSS Grid, Flexbox, Tailwind CSS, dan responsive design principles",
        priority: 5,
        category: "hard",
        resources: [
          "https://css-tricks.com/guides/",
          "https://tailwindcss.com/docs",
          "https://web.dev/learn/css/"
        ]
      },
      {
        skill: "JavaScript ES6+",
        description: "Async/await, promises, destructuring, modules, dan modern JS patterns",
        priority: 4,
        category: "hard",
        resources: [
          "https://javascript.info/",
          "https://www.freecodecamp.org/news/learn-modern-javascript/"
        ]
      },
      {
        skill: "Performance Optimization",
        description: "Code splitting, lazy loading, bundle optimization, dan caching strategies",
        priority: 4,
        category: "hard",
        resources: [
          "https://web.dev/performance/",
          "https://react.dev/learn/render-and-commit"
        ]
      },
      {
        skill: "Testing & Debugging",
        description: "Jest, React Testing Library, dan debugging tools (React DevTools, Chrome DevTools)",
        priority: 3,
        category: "hard",
        resources: [
          "https://testing-library.com/docs/react-testing-library/intro/",
          "https://jestjs.io/docs/getting-started"
        ]
      }
    ],
    mediumGap: [
      {
        skill: "State Management (Redux/Zustand)",
        description: "Global state management patterns dan best practices",
        priority: 3,
        category: "hard",
        resources: ["https://redux.js.org/tutorials/essentials/part-1-overview-concepts"]
      },
      {
        skill: "TypeScript",
        description: "Type safety untuk mengurangi bugs di production",
        priority: 3,
        category: "hard",
        resources: ["https://www.typescriptlang.org/docs/"]
      }
    ]
  },
  "Backend Developer": {
    highGap: [
      {
        skill: "RESTful API Design",
        description: "Mendesign API yang scalable, maintainable, dan follow best practices",
        priority: 5,
        category: "hard",
        resources: [
          "https://restfulapi.net/",
          "https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/"
        ]
      },
      {
        skill: "Database Design & Optimization",
        description: "SQL queries optimization, indexing, normalization, dan database design patterns",
        priority: 5,
        category: "hard",
        resources: [
          "https://www.postgresql.org/docs/",
          "https://www.mysql.com/cn/",
          "https://www.mongodb.com/docs/manual/"
        ]
      },
      {
        skill: "Node.js / Python Fundamentals",
        description: "Server-side programming, async programming, dan framework usage (Express, FastAPI, Django)",
        priority: 4,
        category: "hard",
        resources: [
          "https://nodejs.org/en/docs/",
          "https://expressjs.com/",
          "https://docs.python.org/3/"
        ]
      },
      {
        skill: "Authentication & Security",
        description: "JWT, OAuth, encryption, security best practices, dan handling sensitive data",
        priority: 4,
        category: "hard",
        resources: [
          "https://jwt.io/introduction",
          "https://owasp.org/www-project-top-ten/"
        ]
      },
      {
        skill: "System Architecture",
        description: "Microservices, caching (Redis), message queues, dan scalable system design",
        priority: 3,
        category: "hard",
        resources: [
          "https://microservices.io/",
          "https://redis.io/docs/"
        ]
      }
    ],
    mediumGap: [
      {
        skill: "DevOps & CI/CD",
        description: "Docker, Kubernetes basics, GitHub Actions, dan deployment strategies",
        priority: 3,
        category: "hard",
        resources: ["https://docs.docker.com/", "https://kubernetes.io/docs/home/"]
      },
      {
        skill: "Testing (Unit & Integration)",
        description: "Jest, Mocha, Test-driven development, dan API testing",
        priority: 3,
        category: "hard",
        resources: ["https://jestjs.io/", "https://mochajs.org/"]
      }
    ]
  },
  "Project Manager": {
    highGap: [
      {
        skill: "Agile/Scrum Methodology",
        description: "Sprint planning, daily standups, retrospectives, dan Agile principles",
        priority: 5,
        category: "soft",
        resources: [
          "https://www.scrum.org/resources/what-is-scrum",
          "https://www.atlassian.com/agile"
        ]
      },
      {
        skill: "Project Planning & Roadmapping",
        description: "Gantt charts, milestone tracking, resource allocation, dan timeline management",
        priority: 5,
        category: "soft",
        resources: [
          "https://www.projectmanager.com/guides/project-planning",
          "https://asana.com/resources/project-roadmap"
        ]
      },
      {
        skill: "Stakeholder Management",
        description: "Communication strategies, conflict resolution, dan expectation management",
        priority: 4,
        category: "soft",
        resources: [
          "https://www.pmi.org/learning/library/stakeholder-management-approach-8090"
        ]
      },
      {
        skill: "Technical Understanding",
        description: "Basic understanding of software development lifecycle, tech stack, dan technical debt",
        priority: 4,
        category: "hard",
        resources: [
          "https://www.freecodecamp.org/news/technical-debt-explained/"
        ]
      },
      {
        skill: "Risk Management",
        description: "Identify, assess, dan mitigate project risks",
        priority: 3,
        category: "soft",
        resources: [
          "https://www.pmi.org/learning/library/risk-management-essentials-7065"
        ]
      }
    ],
    mediumGap: [
      {
        skill: "Metrics & Analytics",
        description: "Tracking KPIs, project success metrics, dan data-driven decision making",
        priority: 3,
        category: "hard",
        resources: ["https://www.productplan.com/glossary/kpi/"]
      },
      {
        skill: "Tool Proficiency (Jira, Notion, etc)",
        description: "Project management tools untuk tracking dan collaboration",
        priority: 3,
        category: "hard",
        resources: ["https://www.atlassian.com/software/jira", "https://www.notion.so/"]
      }
    ]
  },
  "UI/UX Designer": {
    highGap: [
      {
        skill: "User Research & Testing",
        description: "Conducting user interviews, usability testing, dan understanding user needs",
        priority: 5,
        category: "soft",
        resources: [
          "https://www.nngroup.com/articles/usability-testing-101/",
          "https://www.interaction-design.org/literature/topics/user-research"
        ]
      },
      {
        skill: "Design Tools (Figma/Sketch)",
        description: "Mastering design tools untuk creating high-fidelity mockups dan prototypes",
        priority: 5,
        category: "hard",
        resources: [
          "https://www.figma.com/",
          "https://help.figma.com/hc/en-us/articles/360041061214"
        ]
      },
      {
        skill: "Design Systems & Components",
        description: "Creating reusable design systems, component libraries, dan design consistency",
        priority: 4,
        category: "hard",
        resources: [
          "https://www.designsystems.com/",
          "https://atomicdesign.bradfrost.com/"
        ]
      },
      {
        skill: "Wireframing & Prototyping",
        description: "Creating low/high-fidelity wireframes, interactive prototypes, dan user flows",
        priority: 4,
        category: "hard",
        resources: [
          "https://www.uxpin.com/studio/blog/wireframing/",
          "https://www.interaction-design.org/literature/topics/prototyping"
        ]
      },
      {
        skill: "Accessibility (A11y)",
        description: "WCAG guidelines, inclusive design, dan designing for all users",
        priority: 3,
        category: "hard",
        resources: [
          "https://www.w3.org/WAI/WCAG21/quickref/",
          "https://www.a11yproject.com/"
        ]
      }
    ],
    mediumGap: [
      {
        skill: "Visual Design Principles",
        description: "Typography, color theory, spacing, dan visual hierarchy",
        priority: 3,
        category: "hard",
        resources: ["https://www.interaction-design.org/literature/topics/visual-design"]
      },
      {
        skill: "Animation & Micro-interactions",
        description: "Creating delightful user experiences dengan motion design",
        priority: 3,
        category: "hard",
        resources: ["https://www.nngroup.com/articles/microinteractions/"]
      }
    ]
  }
};

/**
 * Get skill gaps berdasarkan role dan gap percentage
 */
export function getSkillGapsForRole(roleName, gapPercentage) {
  const roleMapping = ROLE_SKILL_GAP_MAPPING[roleName];
  if (!roleMapping) return [];

  // Jika gap tinggi (>50%), return highGap, else mediumGap
  if (gapPercentage >= 50) {
    return roleMapping.highGap || [];
  } else {
    return roleMapping.mediumGap || [];
  }
}

/**
 * Get all skill gaps untuk role (high + medium)
 */
export function getAllSkillGapsForRole(roleName) {
  const roleMapping = ROLE_SKILL_GAP_MAPPING[roleName];
  if (!roleMapping) return [];

  return [
    ...(roleMapping.highGap || []),
    ...(roleMapping.mediumGap || [])
  ];
}

/**
 * Get ONLY hard skill gaps untuk role (filtered)
 * Digunakan untuk dashboard skill gap chart yang hanya menampilkan hard skill
 */
export function getHardSkillGapsForRole(roleName) {
  const allSkills = getAllSkillGapsForRole(roleName);
  return allSkills.filter(skill => skill.category === "hard");
}

/**
 * Helper function untuk mengategorikan skill sebagai hard atau soft skill
 * Hard skill = technical skills, tools, frameworks, programming languages
 * Soft skill = communication, leadership, problem-solving, teamwork, etc.
 */
export function categorizeSkill(skillName, description = "") {
  const skillLower = (skillName || "").toLowerCase();
  const descLower = (description || "").toLowerCase();
  const combined = `${skillLower} ${descLower}`;
  
  // Hard skill keywords (technical, tools, frameworks, programming)
  const hardSkillKeywords = [
    'react', 'vue', 'javascript', 'typescript', 'python', 'node', 'java', 'php',
    'css', 'html', 'api', 'database', 'sql', 'mongodb', 'postgresql',
    'docker', 'kubernetes', 'devops', 'ci/cd', 'git', 'github',
    'testing', 'jest', 'mocha', 'debugging', 'performance', 'optimization',
    'figma', 'sketch', 'design tools', 'prototyping', 'wireframing',
    'authentication', 'security', 'jwt', 'oauth', 'encryption',
    'architecture', 'microservices', 'redis', 'caching',
    'tool', 'framework', 'library', 'platform', 'software', 'technology',
    'technical', 'coding', 'programming', 'development', 'implementation'
  ];
  
  // Soft skill keywords (communication, leadership, teamwork, etc.)
  const softSkillKeywords = [
    'communication', 'collaboration', 'teamwork', 'leadership',
    'stakeholder', 'management', 'planning', 'agile', 'scrum',
    'problem solving', 'critical thinking', 'analytical',
    'user research', 'interview', 'testing', 'usability',
    'risk management', 'decision making', 'negotiation',
    'presentation', 'meeting', 'standup', 'retrospective'
  ];
  
  // Check for hard skill keywords
  const hasHardSkill = hardSkillKeywords.some(keyword => combined.includes(keyword));
  
  // Check for soft skill keywords
  const hasSoftSkill = softSkillKeywords.some(keyword => combined.includes(keyword));
  
  // Priority: jika ada hard skill keyword, return hard
  if (hasHardSkill) return "hard";
  if (hasSoftSkill) return "soft";
  
  // Default: jika tidak jelas, return "hard" untuk technical roles
  // atau bisa disesuaikan berdasarkan role
  return "hard";
}

/**
 * Separate skill gaps into hard skills and soft skills
 */
export function separateSkillsByCategory(skills) {
  const hardSkills = [];
  const softSkills = [];
  
  skills.forEach(skill => {
    const category = skill.category || categorizeSkill(skill.skill || skill.name, skill.description || "");
    if (category === "hard") {
      hardSkills.push({ ...skill, category: "hard" });
    } else {
      softSkills.push({ ...skill, category: "soft" });
    }
  });
  
  return { hardSkills, softSkills };
}

