import type { Role } from "@/content/taxonomy";
import { getSkill } from "@/content/skills";
import type { ResumeData } from "./resume-schema";

// Extra keywords per skill, beyond the skill's own name. Lowercase.
const ALIASES: Record<string, string[]> = {
  sql: ["mysql", "postgres", "postgresql", "sql server", "sqlite", "oracle"],
  python: ["python", "pandas", "numpy"],
  excel: ["excel", "spreadsheet", "google sheets", "vlookup", "pivot"],
  statistics: ["statistical", "hypothesis testing", "regression"],
  "data-viz": ["visualisation", "visualization", "tableau", "power bi", "powerbi", "looker", "matplotlib", "dashboard"],
  "data-cleaning": ["data cleaning", "data wrangling", "etl", "data preparation"],
  "html-css": ["html", "css", "tailwind", "bootstrap", "sass"],
  javascript: ["js", "es6", "node"],
  react: ["react.js", "reactjs", "next.js", "nextjs", "redux"],
  typescript: ["ts"],
  "web-apis": ["web api", "rest", "fetch", "axios", "ajax"],
  git: ["git", "github", "gitlab", "version control"],
  "programming-fundamentals": ["programming", "data structures", "algorithms", "dsa", "java", "c++", "oop"],
  "api-design": ["api design", "rest api", "restful", "express", "spring boot", "django", "fastapi", "flask"],
  "auth-security": ["authentication", "security", "jwt", "oauth", "authentication", "owasp"],
  "testing-basics": ["automated testing", "unit test", "jest", "junit", "pytest", "tdd"],
  "system-design": ["system design", "microservices", "redis", "kafka", "scalab"],
  "manual-testing": ["manual testing", "functional testing", "regression testing", "exploratory"],
  "test-case-design": ["test case", "test cases", "test scenarios", "boundary value"],
  "sdlc-stlc": ["sdlc", "stlc", "agile", "scrum"],
  "api-testing": ["postman", "rest assured", "swagger"],
  "bug-reporting": ["bug report", "defect report", "jira", "bugzilla", "defect"],
  "test-automation": ["test automation", "selenium", "playwright", "cypress", "appium"],
  linux: ["linux", "bash", "shell", "ubuntu", "unix"],
  "ci-cd": ["ci/cd", "ci cd", "continuous integration", "jenkins", "github actions", "gitlab ci", "ci/cd", "pipeline"],
  docker: ["docker", "container", "kubernetes", "k8s"],
  "cloud-fundamentals": ["cloud", "aws", "azure", "gcp", "cloud"],
  networking: ["networking", "network", "dns", "tcp/ip", "load balanc", "nginx"],
  iac: ["infrastructure as code", "terraform", "ansible", "cloudformation"],
  monitoring: ["monitoring", "observability", "prometheus", "grafana", "datadog", "observability"],
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Deterministic keyword match from the CONFIRMED resume to role skills.
 * A match only creates a capped, low-confidence claim — it never counts as proof.
 * Aptitude/communication/soft skills cannot be claimed; they must be assessed.
 */
export function claimedSkills(role: Role, resume: ResumeData): string[] {
  const text = [
    ...resume.skills,
    ...resume.certifications,
    ...resume.projects.flatMap((p) => [p.name, p.description]),
    ...resume.experience.flatMap((e) => [e.title, e.summary]),
  ]
    .join(" \n ")
    .toLowerCase();

  return role.skills
    .map((s) => getSkill(s.skillId))
    .filter((s) => s.dimension === "technical")
    .filter((s) =>
      [s.name.toLowerCase(), ...(ALIASES[s.id] ?? [])].some((k) =>
        // Short keywords ("js", "ts", "sql") need a boundary on both sides; longer ones may be prefixes.
        new RegExp(`(^|[^a-z0-9+#])${escape(k)}${k.length <= 3 ? "($|[^a-z0-9+#])" : ""}`, "i").test(text),
      ),
    )
    .map((s) => s.id);
}
