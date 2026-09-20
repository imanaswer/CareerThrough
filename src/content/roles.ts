import { bands, type Dimension, type Role, type RoleSkill } from "./taxonomy";

const ALL_DIMENSIONS: Dimension[] = ["technical", "aptitude", "communication", "soft_skills", "interview"];

/** Non-technical skills every role is measured on. Targets/weights vary per role. */
function shared(t: { numerical: number; logical: number; comm: number; soft: number }): RoleSkill[] {
  return [
    { skillId: "apt-numerical", target: t.numerical, weight: 1, priority: "important" },
    { skillId: "apt-logical", target: t.logical, weight: 1, priority: "important" },
    { skillId: "comm-written", target: t.comm, weight: 1.5, priority: "important" },
    { skillId: "soft-workplace", target: t.soft, weight: 1, priority: "nice" },
  ];
}

export const ROLES: Role[] = [
  {
    id: "data-analyst",
    slug: "data-analyst",
    title: "Data Analyst",
    tagline: "Turn raw data into decisions a business can act on.",
    description:
      "Data analysts pull, clean and interpret data, then explain what it means to people who need to make a decision. Entry-level analysts live in SQL and spreadsheets and are judged on accuracy and clarity.",
    whatYouDo: [
      "Write SQL to answer business questions from production databases",
      "Clean and reconcile messy data before anyone trusts it",
      "Build dashboards and reports stakeholders actually read",
      "Explain findings, caveats and recommendations in plain language",
    ],
    dimensions: ALL_DIMENSIONS,
    skills: [
      { skillId: "sql", target: 75, weight: 3, priority: "critical" },
      { skillId: "excel", target: 70, weight: 2, priority: "critical" },
      { skillId: "statistics", target: 65, weight: 2, priority: "critical" },
      { skillId: "data-cleaning", target: 65, weight: 2, priority: "important", prerequisites: ["sql"] },
      { skillId: "data-viz", target: 65, weight: 2, priority: "important" },
      { skillId: "python", target: 60, weight: 1.5, priority: "nice" },
      ...shared({ numerical: 70, logical: 65, comm: 70, soft: 60 }),
    ],
    bands: bands(),
    readyThreshold: 70,
    journeyEstimate: "8–12 weeks from a typical graduate baseline",
    project: {
      id: "da-sales-analysis",
      title: "Sales performance analysis",
      brief:
        "Take a public retail or e-commerce dataset, clean it, answer five business questions with SQL, and publish a short dashboard or report with your recommendations.",
      requirements: [
        "Public repository with the SQL queries and cleaning steps",
        "README stating each business question, the query and the answer",
        "At least three charts that each answer a specific question",
        "A short section on data quality issues you found and how you handled them",
      ],
      skillIds: ["sql", "data-cleaning", "data-viz"],
    },
  },
  {
    id: "frontend-developer",
    slug: "frontend-developer",
    title: "Frontend Developer",
    tagline: "Build the interfaces people actually touch.",
    description:
      "Frontend developers turn designs and product requirements into fast, accessible, reliable interfaces. Entry-level hires are expected to be solid in JavaScript and one framework, and to ship working UI without hand-holding.",
    whatYouDo: [
      "Build responsive, accessible pages and components from designs",
      "Wire UI to APIs and handle loading, empty and error states",
      "Manage component state and keep it predictable",
      "Review, debug and ship code through a team Git workflow",
    ],
    dimensions: ALL_DIMENSIONS,
    skills: [
      { skillId: "javascript", target: 75, weight: 3, priority: "critical" },
      { skillId: "html-css", target: 75, weight: 2.5, priority: "critical" },
      { skillId: "react", target: 70, weight: 2.5, priority: "critical", prerequisites: ["javascript"] },
      { skillId: "web-apis", target: 65, weight: 2, priority: "important", prerequisites: ["javascript"] },
      { skillId: "git", target: 65, weight: 1.5, priority: "important" },
      { skillId: "typescript", target: 60, weight: 1.5, priority: "nice", prerequisites: ["javascript"] },
      ...shared({ numerical: 55, logical: 65, comm: 65, soft: 60 }),
    ],
    bands: bands(),
    readyThreshold: 70,
    journeyEstimate: "10–14 weeks from a typical graduate baseline",
    project: {
      id: "fe-dashboard-app",
      title: "API-driven dashboard app",
      brief:
        "Build and deploy a small React app that consumes a public API, with search or filtering, and proper loading, empty and error states.",
      requirements: [
        "Public repository with a clear README and setup steps",
        "Deployed live URL",
        "Responsive layout that works on mobile and desktop",
        "Keyboard-navigable, with labelled form controls",
        "Handles API failure without a blank screen",
      ],
      skillIds: ["react", "javascript", "web-apis", "html-css"],
    },
  },
  {
    id: "backend-developer",
    slug: "backend-developer",
    title: "Backend Developer",
    tagline: "Build the services and data everything else depends on.",
    description:
      "Backend developers design APIs, model data and keep services correct and secure. Entry-level hires need sound programming fundamentals, real SQL, and the judgement to build APIs other people can rely on.",
    whatYouDo: [
      "Design and implement REST APIs with clear contracts",
      "Model data and write efficient, correct SQL",
      "Handle authentication, authorization and input validation",
      "Write automated tests and debug production issues",
    ],
    dimensions: ALL_DIMENSIONS,
    skills: [
      { skillId: "programming-fundamentals", target: 75, weight: 3, priority: "critical" },
      { skillId: "api-design", target: 70, weight: 2.5, priority: "critical" },
      { skillId: "sql", target: 70, weight: 2.5, priority: "critical" },
      { skillId: "auth-security", target: 65, weight: 2, priority: "important", prerequisites: ["api-design"] },
      { skillId: "testing-basics", target: 60, weight: 1.5, priority: "important" },
      { skillId: "git", target: 65, weight: 1.5, priority: "important" },
      { skillId: "system-design", target: 50, weight: 1, priority: "nice" },
      ...shared({ numerical: 60, logical: 70, comm: 60, soft: 60 }),
    ],
    // Backend entry roles screen harder on fundamentals: the entry floor sits higher.
    bands: bands({ entry_ready: 65, strong: 75 }),
    readyThreshold: 75,
    journeyEstimate: "12–16 weeks from a typical graduate baseline",
    project: {
      id: "be-rest-service",
      title: "Authenticated REST service",
      brief:
        "Build a REST API for a small domain (tasks, bookings, inventory) backed by a SQL database, with authentication, validation and automated tests.",
      requirements: [
        "Public repository with README, setup steps and API documentation",
        "At least four resources/endpoints with correct status codes",
        "Token or session authentication with protected routes",
        "Input validation and consistent error responses",
        "Automated tests covering the main success and failure paths",
      ],
      skillIds: ["api-design", "sql", "auth-security", "testing-basics"],
    },
  },
  {
    id: "qa-engineer",
    slug: "qa-engineer",
    title: "QA Engineer",
    tagline: "Be the reason broken software doesn't reach users.",
    description:
      "QA engineers find the problems before customers do. Entry-level QA hires are expected to design good test cases, test APIs as well as screens, write bug reports developers can act on, and understand where testing fits in delivery.",
    whatYouDo: [
      "Design test cases from requirements, including edge and negative cases",
      "Execute functional, regression and exploratory testing",
      "Test APIs directly and verify data with SQL",
      "Report, triage and retest defects with developers",
    ],
    dimensions: ALL_DIMENSIONS,
    skills: [
      { skillId: "manual-testing", target: 80, weight: 3, priority: "critical" },
      { skillId: "test-case-design", target: 75, weight: 2.5, priority: "critical" },
      { skillId: "api-testing", target: 70, weight: 2.5, priority: "critical" },
      { skillId: "sdlc-stlc", target: 70, weight: 2, priority: "important" },
      { skillId: "bug-reporting", target: 75, weight: 2, priority: "important" },
      { skillId: "sql", target: 60, weight: 1.5, priority: "important" },
      { skillId: "test-automation", target: 50, weight: 1, priority: "nice", prerequisites: ["manual-testing"] },
      ...shared({ numerical: 55, logical: 65, comm: 75, soft: 65 }),
    ],
    // Manual QA entry roles open up slightly earlier than developer roles.
    bands: bands({ entry_ready: 58, strong: 70 }),
    readyThreshold: 70,
    journeyEstimate: "6–10 weeks from a typical graduate baseline",
    project: {
      id: "qa-test-suite",
      title: "End-to-end test pack for a public app",
      brief:
        "Pick a public demo application and produce a professional test pack: test plan, test cases, an API collection and defect reports.",
      requirements: [
        "Public repository or shared folder link with all artefacts",
        "Test plan covering scope, approach and risks",
        "At least 25 test cases including boundary and negative cases",
        "API collection with assertions for at least five endpoints",
        "Three defect reports with steps, expected vs actual, severity and evidence",
      ],
      skillIds: ["test-case-design", "api-testing", "bug-reporting", "manual-testing"],
    },
  },
  {
    id: "devops-engineer",
    slug: "devops-engineer",
    title: "DevOps Engineer",
    tagline: "Make shipping software boring, fast and safe.",
    description:
      "DevOps engineers build the pipelines and platforms that let teams ship reliably. Entry-level hires need to be comfortable on Linux, understand containers and CI/CD, and troubleshoot calmly when something breaks.",
    whatYouDo: [
      "Build and maintain CI/CD pipelines",
      "Containerize applications and manage deployments",
      "Provision and configure cloud infrastructure",
      "Monitor systems and troubleshoot incidents",
    ],
    dimensions: ALL_DIMENSIONS,
    skills: [
      { skillId: "linux", target: 75, weight: 3, priority: "critical" },
      { skillId: "docker", target: 70, weight: 2.5, priority: "critical", prerequisites: ["linux"] },
      { skillId: "ci-cd", target: 70, weight: 2.5, priority: "critical", prerequisites: ["git"] },
      { skillId: "git", target: 70, weight: 1.5, priority: "important" },
      { skillId: "cloud-fundamentals", target: 65, weight: 2, priority: "important" },
      { skillId: "networking", target: 65, weight: 2, priority: "important" },
      { skillId: "iac", target: 50, weight: 1, priority: "nice", prerequisites: ["cloud-fundamentals"] },
      { skillId: "monitoring", target: 50, weight: 1, priority: "nice" },
      ...shared({ numerical: 55, logical: 70, comm: 60, soft: 65 }),
    ],
    bands: bands({ entry_ready: 65, strong: 75 }),
    readyThreshold: 75,
    journeyEstimate: "12–16 weeks from a typical graduate baseline",
    project: {
      id: "devops-pipeline",
      title: "Containerized app with a full pipeline",
      brief:
        "Take a small web application, containerize it, and build a CI/CD pipeline that tests, builds and deploys it on every push.",
      requirements: [
        "Public repository with Dockerfile and pipeline configuration",
        "Pipeline runs tests, builds an image and deploys automatically",
        "README with an architecture diagram and rollback steps",
        "Basic health check or monitoring endpoint",
      ],
      skillIds: ["docker", "ci-cd", "linux", "cloud-fundamentals"],
    },
  },
];

const byId = new Map(ROLES.map((r) => [r.id, r]));

export function getRole(id: string): Role {
  const r = byId.get(id);
  if (!r) throw new Error(`Unknown role: ${id}`);
  return r;
}

export function findRoleBySlug(slug: string): Role | undefined {
  return ROLES.find((r) => r.slug === slug);
}
