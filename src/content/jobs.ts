import type { Job } from "./taxonomy";

// v1 opportunities are seed content with fictional employers, not live postings.
// They move to the database when the recruiter portal ships.

type S = [skillId: string, weight: number];
type H = [skillId: string, min: number, requiresAssessed?: boolean];

function job(
  j: Omit<Job, "skills" | "hardRequirements"> & { skills: S[]; hard: H[] },
): Job {
  const { hard, skills, ...rest } = j;
  return {
    ...rest,
    skills: skills.map(([skillId, weight]) => ({ skillId, weight })),
    hardRequirements: hard.map(([skillId, min, requiresAssessed]) => ({ skillId, min, requiresAssessed })),
  };
}

export const JOBS: Job[] = [
  // ── Data Analyst ─────────────────────────────────────────────
  job({
    id: "da-intern-northwind", roleId: "data-analyst", title: "Data Analyst Intern", company: "Northwind Retail Labs",
    location: "Bengaluru", employmentType: "Internship", level: "internship", minReadiness: 50,
    summary: "Support the merchandising team with weekly sales reporting in SQL and spreadsheets.",
    skills: [["sql", 3], ["excel", 3], ["comm-written", 1]],
    hard: [["sql", 55, true], ["excel", 55]],
  }),
  job({
    id: "da-junior-ledgerly", roleId: "data-analyst", title: "Junior Data Analyst", company: "Ledgerly Finance",
    location: "Mumbai", employmentType: "Full-time", level: "entry", minReadiness: 60,
    summary: "Own recurring finance reports, reconcile data sources and flag anomalies.",
    skills: [["sql", 3], ["excel", 2], ["data-cleaning", 2], ["apt-numerical", 1]],
    hard: [["sql", 70, true], ["excel", 65, true]],
  }),
  job({
    id: "da-reporting-kitekart", roleId: "data-analyst", title: "Reporting Analyst", company: "KiteKart Commerce",
    location: "Remote (India)", employmentType: "Full-time", level: "entry", minReadiness: 62,
    summary: "Build and maintain dashboards for category managers.",
    skills: [["data-viz", 3], ["sql", 2], ["excel", 2], ["comm-written", 1]],
    hard: [["data-viz", 65, true], ["sql", 65, true]],
  }),
  job({
    id: "da-product-loopline", roleId: "data-analyst", title: "Product Data Analyst", company: "Loopline Apps",
    location: "Hyderabad", employmentType: "Full-time", level: "junior", minReadiness: 72, requiresProject: true,
    summary: "Analyse product funnels and experiments and present findings to product managers.",
    skills: [["sql", 3], ["statistics", 3], ["data-viz", 2], ["python", 1], ["comm-written", 2]],
    hard: [["sql", 75, true], ["statistics", 70, true]],
  }),
  job({
    id: "da-analytics-meridian", roleId: "data-analyst", title: "Analytics Associate", company: "Meridian Health Data",
    location: "Pune", employmentType: "Full-time", level: "junior", minReadiness: 80, requiresProject: true,
    summary: "Python-led analysis on large operational datasets with strict data quality standards.",
    skills: [["python", 3], ["sql", 3], ["statistics", 2], ["data-cleaning", 2]],
    hard: [["python", 70, true], ["sql", 75, true], ["data-cleaning", 70, true]],
  }),

  // ── Frontend Developer ───────────────────────────────────────
  job({
    id: "fe-intern-pixelforge", roleId: "frontend-developer", title: "Frontend Intern", company: "Pixelforge Studio",
    location: "Remote (India)", employmentType: "Internship", level: "internship", minReadiness: 50,
    summary: "Build marketing pages and small UI components from Figma designs.",
    skills: [["html-css", 3], ["javascript", 2], ["git", 1]],
    hard: [["html-css", 60, true], ["javascript", 50]],
  }),
  job({
    id: "fe-junior-tallybird", roleId: "frontend-developer", title: "Junior Frontend Developer", company: "Tallybird",
    location: "Bengaluru", employmentType: "Full-time", level: "entry", minReadiness: 60,
    summary: "Ship React features in an accounting product alongside a senior developer.",
    skills: [["react", 3], ["javascript", 3], ["html-css", 2], ["git", 1]],
    hard: [["javascript", 70, true], ["react", 65, true]],
  }),
  job({
    id: "fe-ui-harborpay", roleId: "frontend-developer", title: "UI Developer", company: "HarborPay",
    location: "Chennai", employmentType: "Full-time", level: "entry", minReadiness: 64,
    summary: "Own responsive, accessible checkout UI.",
    skills: [["html-css", 3], ["javascript", 2], ["react", 2], ["web-apis", 1]],
    hard: [["html-css", 75, true], ["javascript", 65, true]],
  }),
  job({
    id: "fe-react-orbitdesk", roleId: "frontend-developer", title: "React Developer", company: "OrbitDesk",
    location: "Delhi NCR", employmentType: "Full-time", level: "junior", minReadiness: 72, requiresProject: true,
    summary: "Build data-heavy dashboard screens on a TypeScript + React codebase.",
    skills: [["react", 3], ["typescript", 2], ["web-apis", 2], ["javascript", 2]],
    hard: [["react", 75, true], ["web-apis", 65, true], ["typescript", 55]],
  }),
  job({
    id: "fe-product-lumen", roleId: "frontend-developer", title: "Frontend Engineer, Product", company: "Lumen Learning Tools",
    location: "Remote (India)", employmentType: "Full-time", level: "junior", minReadiness: 80, requiresProject: true,
    summary: "Work across the product with high ownership; strong TypeScript expected.",
    skills: [["react", 3], ["typescript", 3], ["javascript", 2], ["comm-written", 1]],
    hard: [["react", 78, true], ["typescript", 70, true], ["javascript", 78, true]],
  }),

  // ── Backend Developer ────────────────────────────────────────
  job({
    id: "be-intern-cargonest", roleId: "backend-developer", title: "Backend Intern", company: "CargoNest Logistics",
    location: "Pune", employmentType: "Internship", level: "internship", minReadiness: 55,
    summary: "Add endpoints and fix bugs in an internal logistics API.",
    skills: [["programming-fundamentals", 3], ["sql", 2], ["git", 1]],
    hard: [["programming-fundamentals", 60, true], ["sql", 50]],
  }),
  job({
    id: "be-junior-fieldnote", roleId: "backend-developer", title: "Junior Backend Developer", company: "Fieldnote",
    location: "Bengaluru", employmentType: "Full-time", level: "entry", minReadiness: 65,
    summary: "Build REST endpoints and data models for a field-service product.",
    skills: [["api-design", 3], ["programming-fundamentals", 3], ["sql", 2], ["testing-basics", 1]],
    hard: [["programming-fundamentals", 70, true], ["api-design", 65, true], ["sql", 65, true]],
  }),
  job({
    id: "be-api-paylane", roleId: "backend-developer", title: "API Developer", company: "Paylane Systems",
    location: "Mumbai", employmentType: "Full-time", level: "entry", minReadiness: 68,
    summary: "Payments APIs: correctness, validation and security come first.",
    skills: [["api-design", 3], ["auth-security", 3], ["sql", 2], ["testing-basics", 2]],
    hard: [["api-design", 70, true], ["auth-security", 65, true]],
  }),
  job({
    id: "be-platform-gridworks", roleId: "backend-developer", title: "Software Engineer, Platform", company: "Gridworks Energy",
    location: "Hyderabad", employmentType: "Full-time", level: "junior", minReadiness: 75, requiresProject: true,
    summary: "Services that ingest and serve meter data at scale.",
    skills: [["programming-fundamentals", 3], ["sql", 3], ["system-design", 2], ["api-design", 2]],
    hard: [["programming-fundamentals", 75, true], ["sql", 72, true], ["system-design", 50]],
  }),
  job({
    id: "be-engineer-quillstack", roleId: "backend-developer", title: "Backend Engineer", company: "Quillstack",
    location: "Remote (India)", employmentType: "Full-time", level: "junior", minReadiness: 82, requiresProject: true,
    summary: "High-ownership role on a small team; tests are non-negotiable.",
    skills: [["programming-fundamentals", 3], ["api-design", 3], ["testing-basics", 2], ["auth-security", 2]],
    hard: [["programming-fundamentals", 80, true], ["api-design", 75, true], ["testing-basics", 65, true]],
  }),

  // ── QA Engineer ──────────────────────────────────────────────
  job({
    id: "qa-intern-brightcart", roleId: "qa-engineer", title: "QA Intern", company: "BrightCart",
    location: "Remote (India)", employmentType: "Internship", level: "internship", minReadiness: 48,
    summary: "Execute regression suites and log defects for a shopping app.",
    skills: [["manual-testing", 3], ["bug-reporting", 2], ["comm-written", 1]],
    hard: [["manual-testing", 60, true]],
  }),
  job({
    id: "qa-manual-medisync", roleId: "qa-engineer", title: "Manual Test Engineer", company: "MediSync",
    location: "Chennai", employmentType: "Full-time", level: "entry", minReadiness: 58,
    summary: "Requirement-driven functional testing in a regulated healthcare product.",
    skills: [["manual-testing", 3], ["test-case-design", 3], ["sdlc-stlc", 2], ["bug-reporting", 2]],
    hard: [["manual-testing", 75, true], ["test-case-design", 70, true]],
  }),
  job({
    id: "qa-junior-farepilot", roleId: "qa-engineer", title: "Junior QA Engineer", company: "FarePilot",
    location: "Bengaluru", employmentType: "Full-time", level: "entry", minReadiness: 62,
    summary: "Test web and API layers of a travel booking platform.",
    skills: [["manual-testing", 3], ["test-case-design", 2], ["sdlc-stlc", 2], ["api-testing", 3]],
    hard: [["manual-testing", 75, true], ["test-case-design", 70, true], ["api-testing", 65, true]],
  }),
  job({
    id: "qa-api-ledgerly", roleId: "qa-engineer", title: "API Test Engineer", company: "Ledgerly Finance",
    location: "Mumbai", employmentType: "Full-time", level: "junior", minReadiness: 70, requiresProject: true,
    summary: "Own API test coverage and data verification for ledger services.",
    skills: [["api-testing", 3], ["sql", 2], ["test-case-design", 2], ["bug-reporting", 1]],
    hard: [["api-testing", 75, true], ["sql", 60, true]],
  }),
  job({
    id: "qa-sdet-orbitdesk", roleId: "qa-engineer", title: "QA Engineer, Automation track", company: "OrbitDesk",
    location: "Delhi NCR", employmentType: "Full-time", level: "junior", minReadiness: 80, requiresProject: true,
    summary: "Strong manual foundation with a path into automation.",
    skills: [["test-automation", 3], ["api-testing", 3], ["manual-testing", 2], ["test-case-design", 2]],
    hard: [["test-automation", 60, true], ["api-testing", 75, true], ["manual-testing", 80, true]],
  }),

  // ── DevOps Engineer ──────────────────────────────────────────
  job({
    id: "do-intern-stacklight", roleId: "devops-engineer", title: "DevOps Intern", company: "Stacklight",
    location: "Remote (India)", employmentType: "Internship", level: "internship", minReadiness: 55,
    summary: "Maintain build scripts and help keep CI green.",
    skills: [["linux", 3], ["git", 2], ["ci-cd", 1]],
    hard: [["linux", 60, true], ["git", 55]],
  }),
  job({
    id: "do-junior-cargonest", roleId: "devops-engineer", title: "Junior DevOps Engineer", company: "CargoNest Logistics",
    location: "Pune", employmentType: "Full-time", level: "entry", minReadiness: 65,
    summary: "Run pipelines and containerized deployments for a dozen services.",
    skills: [["linux", 3], ["docker", 3], ["ci-cd", 3], ["git", 1]],
    hard: [["linux", 70, true], ["docker", 65, true], ["ci-cd", 65, true]],
  }),
  job({
    id: "do-build-harborpay", roleId: "devops-engineer", title: "Build & Release Engineer", company: "HarborPay",
    location: "Chennai", employmentType: "Full-time", level: "entry", minReadiness: 68,
    summary: "Own release pipelines and rollback procedures.",
    skills: [["ci-cd", 3], ["git", 2], ["docker", 2], ["comm-written", 1]],
    hard: [["ci-cd", 72, true], ["git", 65, true]],
  }),
  job({
    id: "do-cloud-gridworks", roleId: "devops-engineer", title: "Cloud Operations Engineer", company: "Gridworks Energy",
    location: "Hyderabad", employmentType: "Full-time", level: "junior", minReadiness: 75, requiresProject: true,
    summary: "Operate cloud infrastructure and respond to incidents.",
    skills: [["cloud-fundamentals", 3], ["networking", 3], ["linux", 2], ["monitoring", 2]],
    hard: [["cloud-fundamentals", 70, true], ["networking", 65, true], ["linux", 72, true]],
  }),
  job({
    id: "do-platform-quillstack", roleId: "devops-engineer", title: "Platform Engineer", company: "Quillstack",
    location: "Remote (India)", employmentType: "Full-time", level: "junior", minReadiness: 82, requiresProject: true,
    summary: "Infrastructure as code and observability for a growing platform.",
    skills: [["iac", 3], ["docker", 3], ["ci-cd", 2], ["monitoring", 2], ["cloud-fundamentals", 2]],
    hard: [["iac", 60, true], ["docker", 75, true], ["cloud-fundamentals", 70, true]],
  }),
];

export function jobsForRole(roleId: string): Job[] {
  return JOBS.filter((j) => j.roleId === roleId);
}

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id);
}
