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
| Passes a timed assessment | **Assessed evidence.** This sets the skill level — but only up to 84%. |
| Works through a plan | **Nothing on its own.** Studying never moves the score. |
| Submits a project | **Practical evidence.** Raises confidence, and lifts the 84% ceiling. |
| Answers the interview | **Recorded as evidence.** Scored once the AI scorer is connected; never assumed passed. |

Other rules that hold everywhere:

- A skill level is the **most recent** assessed result, not the best one. Scores can go down.
- Missing evidence is not failure and not mastery. It is simply unproven.
- Assessed evidence expires after 12 months, with a reminder at 10 months.
- Interview answers are stored and shown as "awaiting evaluation" until a scorer is connected. They never silently count as a pass.
- AI never scores, ranks or decides eligibility. It reads resumes, and (once connected) assists interview scoring against a fixed rubric.

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
| **Password** | `CT-vMpM38pFGkzU` |

Priya Nair, targeting **DevOps Engineer**, sitting at **69/100 (Entry-ready)**.

She has a confirmed profile with 5 resume claims, a baseline across all 12 role skills, and three later skill assessments — so her dashboard shows a real trend, not an empty state. She has **2 critical gaps**, **1 of 5 opportunities unlocked**, and no Career Card yet (it needs 75% and zero critical gaps). Her next move is CI/CD Pipelines.

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

**Questions are progressive.** Every assessment adapts: answer correctly and the next question is harder, answer wrong and it steps back down. Difficulty comes from the skill's own topic order (foundational → applied). The server issues one question at a time, so the browser never holds the rest of the paper and you cannot go back — the next question depends on the last one.

**Harder questions are worth more.** A skill's score is the difficulty-weighted credit you earned, divided by what a perfect run through the same ladder would earn. Answering only the easy questions correctly therefore produces a low score, not a high one.

**Nobody reaches the top band on questions alone.** Multiple-choice shows knowledge, so on its own it takes a skill to at most **84%**. Going above that requires two things together: the hardest band answered correctly, *and* demonstrated ability — project evidence covering the skill, or a passed interview on it. That is what makes "85%+" mean industry-ready rather than good-at-quizzes. The ladder is: 30% for a claim → 84% for proven knowledge → above that only for demonstrated work.

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
| `src/lib/adaptive.ts` | Progressive difficulty and difficulty-weighted scoring. |
| `src/lib/attempt.ts` | Serving questions one at a time, and turning a finished attempt into evidence. |
| `src/lib/interview/` | Rubric, progressive prompt selection, the conversation engine, rule-based feedback, and the pluggable scorer. |
| `src/content/interview/` | 98 interview prompts: 6 per role, 2 per skill. |
| `src/lib/data.ts` | The only place readiness is saved (`recordSnapshot`). |
| `src/app/actions.ts` | Every write. The browser never sends a score. |
| `src/db/schema.ts` | `profile`, `attempt`, `evidence`, `interview_response`, `readiness_snapshot`, `career_event`. |

**Security model.** Row-level security is on for every table with no policies, so the public API key can read nothing — all access goes through the server. Answer keys never reach the browser. Scores, verified flags and job unlocks are always recomputed server-side. A public Career Card is only reachable while the candidate has sharing switched on; otherwise the link 404s.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Run locally |
| `npm test` | Domain logic and content checks (66 tests) |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `npm run db:migrate` | Apply database migrations |

To also run the database integration test: `TEST_DATABASE_URL=postgres://... npm test`.

---

## Interview practice and the confidence track

**Practice** (`/practice`) is a spoken mock interview, separate from assessment. It opens with "Hello, can you hear me?", introduces itself using the candidate's real profile and weakest skills, asks its questions, and **probes whatever the answer was missing** before moving on. Answer out loud or type; nothing is recorded as evidence, so a candidate can be bad at it first.

Voice uses the browser's own engines — `SpeechRecognition` for listening and `speechSynthesis` for speaking — so it needs **no API key** and no audio ever leaves the machine. Speech-to-text is Chrome-only today; elsewhere the call falls back to typing automatically. Both modes produce the same transcript.

The follow-up is chosen from the same analysis as the written feedback, so it asks about the actual weakness:

| What the answer lacked | What the interviewer says |
|---|---|
| Only "we", never "I" | "What was your part in it specifically — what did you do yourself?" |
| No numbers or named tools | "Can you put some numbers on that?" |
| A story with no ending | "And how did it end? What actually changed?" |
| A technical answer with no *why* | "Why that approach rather than the alternative?" |
| Hedging throughout | "You sound unsure there. Say it plainly." |

It probes **once** per question, then moves on — the same courtesy a real interviewer extends. `src/lib/interview/conductor.ts` holds the dialogue engine; swapping `nextInterviewerTurn` for a model call is all that's needed to make the conversation fully AI-driven.

The written one-question-at-a-time mode is still there at `/practice?mode=written`.

The feedback is rule-based and deliberately honest about its limits. It reports what can actually be measured:

| Signal | What it catches |
|---|---|
| Length | Too short to show reasoning, or too long to hold an interviewer |
| Structure | A story with no result, or a technical answer with no *why* |
| Specifics | No numbers, no named tools — the generic-answer smell |
| Ownership | "We" five times and "I" never, so nobody can tell what you did |
| Confidence | Hedging and filler that make a right answer sound unsure |

It also lists the prompt's own markers it could not find, hedged as "we couldn't see this" — it is a word-level check, not a judgement. It never claims to know whether an answer is *correct*; that is the scored interview's job.

**The confidence track** (`/plan#confidence`) treats communication and workplace judgement as scored skills for the role, not soft extras, and links them to practice.

## Connecting the interview scorer

Every assessment ends with an interview — 3 questions after a baseline, 2 after a skill assessment, 5 after final verification, always ordered warm-up → core → probing, and run as the same conversation as practice. Answers are stored now and scored when you connect a provider.

To wire it up, implement `InterviewScorer` and register it:

```ts
// src/lib/interview/provider.ts defines the interface.
registerInterviewScorer({
  name: "ai-gateway",
  model: "anthropic/claude-sonnet-5",
  async evaluate(answer) { /* call the model, return rubric scores 0-4 */ },
});
```

`buildScoringPrompt()` already produces the exact prompt for the rubric, including the instruction to treat the candidate's answer as untrusted input. The 0-100 score is always recomputed from the rubric server-side, so a provider cannot report its own score. Until one is registered, answers stay `pending`, readiness is unaffected, and the UI says so plainly.

## Known limits

- **Resume upload doesn't parse yet.** Vercel's AI Gateway refuses requests until a credit card is on file (Vercel → AI). Uploading works and the file is stored; the AI step fails with a clear message and the manual profile form is the fallback.
- **Sign-in is email and password only.** Google sign-in needs OAuth configured in Supabase.
- **Project validation** only checks that a public GitHub repo exists at the link. GitLab and Bitbucket links stay at "validation pending". Nothing is human-reviewed in v1, and the product never claims otherwise.
- **Question bank is 8 per skill (2 per difficulty band).** Enough to demonstrate the ladder, but a real cohort needs more — with only two questions per band, a long run exhausts the hardest ones. A subject expert should review the answer keys and the interview rubric anchors.
- **Role thresholds are starting estimates.** They need calibrating against real job descriptions and placement outcomes.
- **Interview scoring is not connected.** The conversation, storage, rubric and UI are built; the model call is not. The interviewer's lines are generated by rules, so it probes what is missing but cannot react to the *content* of an answer the way a model would. See above.
- **Speech-to-text is Chrome-only** (browser API). Other browsers get typing.
- **Not built:** recruiter portal, payments (enrolment is free, no fake pricing shown), human review of projects or interviews, college/TPO workflows, and the opportunity map.

# CareerThrough
