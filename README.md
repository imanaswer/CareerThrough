# Career Through

**Choose the role. Prove you're ready. Get access to opportunities.**

A role-first career-readiness system. Not a course platform: a candidate picks a target job, finds out how ready they actually are, learns exactly what is missing, proves each skill, and watches real opportunities unlock as the evidence builds.

The product vision and the original UI references are in [`docs/`](docs/).

---

## The one loop

```
Pick a role  →  Real profile  →  Baseline  →  Readiness + gaps  →  Next best action
     ↑                                                                    ↓
Opportunities  ←  Career Card  ←  Final verification  ←  Evidence  ←  Learn / practise
```

Every screen answers one of these, in order:

1. What role am I pursuing?
2. Where do I stand?
3. Why am I at that level?
4. What is blocking me?
5. What should I do next?
6. What will that change?
7. What proves my ability?
8. What opportunities does it open?

---

## The one rule: evidence, not claims

This is the whole product philosophy, and it is enforced in code, not just in the copy.

| What a candidate does | What it is worth |
|---|---|
| Lists a skill on their resume | A **claim**. Capped at 30% until assessed. |
| Passes a timed assessment | **Assessed evidence.** This sets the skill level. |
| Works through a plan | **Nothing on its own.** Studying never moves the score. |
| Submits a project | **Practical evidence.** Raises confidence; never sets a level. |

Other rules that hold everywhere:

- A skill level is the **most recent** assessed result, not the best one. Scores can go down.
- Missing evidence is not failure and not mastery. It is simply unproven.
- Assessed evidence expires after 12 months, with a reminder at 10 months.
- Interview readiness is shown as "Not yet assessed" and excluded from the score.
- AI is used for **one thing only**: reading an uploaded resume. It never scores, ranks or decides eligibility.

---

## Quick start

You need Node 20+ and a Vercel account.

```bash
npm install

# 1. Provision Supabase (auth + database + file storage) through Vercel
vercel link
vercel integration add supabase --name career-through-db
vercel env pull            # writes credentials into .env.local

# 2. Create the tables, security rules and the private resume bucket
npm run db:migrate

# 3. Run it
npm run dev                # http://localhost:3000
```

One manual step in the Supabase dashboard: under **Auth → URL Configuration**, add `http://localhost:3000/auth/callback` to the redirect URLs (and your deployed address later). Without it, email confirmation links don't return to the app.

---

## Test accounts

> **Rotate these before pushing this repo anywhere or showing it to anyone outside your team.** They are working logins, written here for convenience during development. Change them in Supabase under **Auth → Users**.

### Demo candidate — mid-journey, good for showing the product

| | |
|---|---|
| **Email** | `demo@gteceducation.com` |
| **Password** | `CT-5IwJQMMvRzcE` |

Priya Nair, targeting **DevOps Engineer**, sitting at **69/100 (Entry-ready)**.

She has a confirmed profile with 5 resume claims, a baseline across all 12 role skills, and two later skill assessments — so her dashboard shows a real trend, not an empty state. She has **3 critical gaps**, **1 of 5 opportunities unlocked**, and no Career Card yet (it needs 75% and zero critical gaps). Her next move is Linux & Shell, 67% → 75%.

Her numbers were not typed in. The seeder generated an answer sheet, ran it through the real scorer, and searched only over results a real candidate could get until the engine produced exactly 69.

### Your own account

| | |
|---|---|
| **Email** | `gtm@gteceducation.com` |
| **Password** | `CT-orED83CdBMM_` |

Targeting DevOps Engineer. Readiness currently **0** — the first baseline was submitted after 18 seconds with 2 of 36 questions answered, and blanks score zero. To fix it, go to **Assessments → Retake the baseline**.

---

## Making more demo profiles

```bash
set -a && . ./.env.local && set +a
SEED_DEMO=1 SEED_TARGET=45 SEED_ROLE=qa-engineer SEED_EMAIL=demo-qa@example.com \
  npx vitest run src/lib/demo-seed.test.ts
```

`SEED_TARGET` is the exact readiness you want. Roles: `data-analyst`, `frontend-developer`, `backend-developer`, `qa-engineer`, `devops-engineer`.

The generated password lands in `demo-credentials.json` (git-ignored). The seeder **recreates** the account every run, so never point `SEED_EMAIL` at a real user. It is skipped during normal test runs unless `SEED_DEMO=1` is set.

---

## How the scoring works

All of it runs on the server and is deterministic: the same evidence always gives the same result.

**Readiness (0–100).** Each skill counts towards its target and no further, weighted by how much the role depends on it. A skill at 90% against a 70% target contributes the same as one at exactly 70% — extra ability in one place does not paper over a gap in another.

**Bands are per role.** 60% does not mean "job ready" everywhere. Backend and DevOps open their entry band at 65; QA opens at 58. Each role also sets its own threshold for the Career Card.

**Job matching is rule-based.** Every job has hard requirements (a minimum level per skill, sometimes requiring assessed evidence specifically), a readiness floor, and sometimes a project requirement. A job is either eligible or not; there is no fuzzy ranking and no AI. Locked jobs always state the exact blocker, e.g. "Missing: CI/CD Pipelines — reach 72% to satisfy this requirement (currently 50%)."

**Next best action** is ranked in a fixed order: critical gaps first, then whatever blocks the most opportunities, then role weight, then whichever is closest to its target. A skill's prerequisite always comes before it.

**Expected impact** is a real simulation, not an estimate. The app re-runs the same readiness and matching engines over the candidate's real evidence, with one hypothetical assessment at the target level, and reports the difference. It is always phrased "if you reach X%" — a projection, never a promise.

**Everything is versioned.** Every stored score records the formula version and the content version it was calculated with, so old results stay reproducible.

---

## Where things live

| Path | What's in it |
|---|---|
| `src/content/` | Roles, skills, questions, plans and jobs — all as typed code, stamped with `CONTENT_VERSION`. There is no CMS. |
| `src/lib/readiness.ts` | The readiness engine. `FORMULA_VERSION` lives here. |
| `src/lib/matching.ts` | Job eligibility and blockers. |
| `src/lib/next-action.ts` | What to do next, and why. |
| `src/lib/simulate.ts` | "What would this change?" projections. |
| `src/lib/assessment.ts` | Question selection and server-side scoring. |
| `src/lib/data.ts` | The only place readiness is saved (`recordSnapshot`). |
| `src/app/actions.ts` | Every write. The browser never sends a score. |
| `src/db/schema.ts` | `profile`, `attempt`, `evidence`, `readiness_snapshot`, `career_event`. |

**Security model.** Row-level security is on for every table with no policies, so the public API key can read nothing — all access goes through the server. Answer keys never reach the browser. Scores, verified flags and job unlocks are always recomputed server-side. A public Career Card is only reachable while the candidate has sharing switched on; otherwise the link 404s.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Run locally |
| `npm test` | Domain logic and content checks (42 tests) |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `npm run db:migrate` | Apply database migrations |

To also run the database integration test: `TEST_DATABASE_URL=postgres://... npm test`.

---

## Known limits

- **Resume upload doesn't parse yet.** Vercel's AI Gateway refuses requests until a credit card is on file (Vercel → AI). Uploading works and the file is stored; the AI step fails with a clear message and the manual profile form is the fallback.
- **Sign-in is email and password only.** Google sign-in needs OAuth configured in Supabase.
- **Project validation** only checks that a public GitHub repo exists at the link. GitLab and Bitbucket links stay at "validation pending". Nothing is human-reviewed in v1, and the product never claims otherwise.
- **Question bank is 8 per skill.** Fine for a demo; it needs to grow before a real student cohort, and a subject expert should review the answer keys.
- **Role thresholds are starting estimates.** They need calibrating against real job descriptions and placement outcomes.
- **Not built in v1:** recruiter portal, payments (enrolment is free, no fake pricing shown), AI mock interviews, human review, college/TPO workflows, and the opportunity map.

# CareerThrough
