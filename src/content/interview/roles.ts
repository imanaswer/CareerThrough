import type { InterviewPrompt } from "../taxonomy";

export const prompts: InterviewPrompt[] = [
  // ── Data Analyst ───────────────────────────────────────────────
  {
    id: "data-analyst-int-1",
    kind: "behavioural",
    roleId: "data-analyst",
    depth: 1,
    prompt:
      "Tell us a little about yourself, and what pulled you towards data analysis rather than another path.",
    lookFor: [
      "Names their background (degree, course or self-study) in one or two lines",
      "Gives a specific moment or task that sparked the interest, not just 'I like data'",
      "Connects that interest to what analysts actually do: querying, cleaning or explaining data",
    ],
    minWords: 40,
  },
  {
    id: "data-analyst-int-2",
    kind: "behavioural",
    roleId: "data-analyst",
    depth: 1,
    prompt:
      "What have you built or learned so far to prepare for a data analyst role? Walk us through one thing you worked on.",
    lookFor: [
      "Names the specific tools used (SQL, Excel, Python, a BI tool) and what each was used for",
      "Describes the dataset or question, not only the technology",
      "States what the analysis actually concluded or produced",
      "Mentions something that was harder than expected and how it was handled",
    ],
    minWords: 40,
  },
  {
    id: "data-analyst-int-3",
    kind: "behavioural",
    roleId: "data-analyst",
    depth: 2,
    prompt:
      "Describe a time you had to explain something technical or number-heavy to people who did not share your background. This can be from a project, a class, or any team you've been part of.",
    lookFor: [
      "Sets up the situation and who the audience was",
      "Names the concrete thing they changed to make it land (an analogy, a chart, dropping jargon)",
      "States the outcome: what the audience understood or decided afterwards",
      "Shows they checked understanding rather than assuming it",
    ],
    followUp: "What part of your explanation did people still find confusing, and how did you fix it?",
    minWords: 60,
  },
  {
    id: "data-analyst-int-4",
    kind: "situational",
    roleId: "data-analyst",
    depth: 2,
    context:
      "A manager asks you for a single number for a review meeting: 'our average order value last quarter'. You've seen the data and you know a handful of bulk corporate orders are pulling the average far above what a typical customer spends. The manager wants it in the next hour.",
    prompt: "What do you send back, and how do you frame it?",
    lookFor: [
      "Still delivers something within the deadline rather than stalling on perfection",
      "Names a concrete fix: median alongside mean, excluding or segmenting the bulk orders",
      "Flags the caveat to the manager instead of quietly shipping the misleading number",
      "Keeps the framing helpful rather than blaming the request",
    ],
    followUp: "What would you do if the manager said they just wanted the one number, caveats aside?",
    minWords: 60,
  },
  {
    id: "data-analyst-int-5",
    kind: "behavioural",
    roleId: "data-analyst",
    depth: 3,
    prompt:
      "Tell us about a time your work turned out to be wrong, or someone gave you hard feedback on it. What happened, and what do you do differently now because of it?",
    lookFor: [
      "Describes a specific error or piece of feedback, not a disguised strength",
      "Owns their part in it without over-apologising or blaming others",
      "Names the concrete step taken to correct it and who was told",
      "Names a habit or check they added afterwards, with evidence it stuck",
    ],
    followUp: "Has that new habit caught anything since? Tell us about one time it did.",
    minWords: 80,
  },
  {
    id: "data-analyst-int-6",
    kind: "situational",
    roleId: "data-analyst",
    depth: 3,
    context:
      "You're two days into a week-long analysis when you find that roughly 8% of the records have missing or clearly wrong values in the column your whole conclusion depends on. Cleaning it properly means tracing the source system and would cost you at least two days. The report is presented to leadership on Friday.",
    prompt: "How do you decide what to do, and what do you tell the people waiting on the report?",
    lookFor: [
      "Assesses whether the bad 8% is random or concentrated before deciding it doesn't matter",
      "Proposes a concrete middle path (sensitivity check, analyse both with and without, partial clean)",
      "Communicates the delay or the limitation early rather than at the deadline",
      "States the trade-off explicitly: what confidence is gained or lost for the time spent",
    ],
    followUp: "If the bad records turned out to be concentrated in your most important segment, what changes?",
    minWords: 80,
  },

  // ── Frontend Developer ─────────────────────────────────────────
  {
    id: "frontend-developer-int-1",
    kind: "behavioural",
    roleId: "frontend-developer",
    depth: 1,
    prompt:
      "Introduce yourself and tell us what draws you to frontend development specifically.",
    lookFor: [
      "Names their background and current level of experience honestly",
      "Gives a specific reason tied to frontend work: the interface, the user, the visual feedback loop",
      "Mentions at least one technology they've actually used, with context",
    ],
    minWords: 40,
  },
  {
    id: "frontend-developer-int-2",
    kind: "behavioural",
    roleId: "frontend-developer",
    depth: 1,
    prompt:
      "Tell us about something you've built for the web. What was it, and what was the hardest part to get working?",
    lookFor: [
      "Describes what the thing does from a user's point of view",
      "Names the specific stack or framework and why it was chosen",
      "Names a concrete technical problem, not just 'it was difficult'",
      "Says how it was solved and where the answer came from",
    ],
    minWords: 40,
  },
  {
    id: "frontend-developer-int-3",
    kind: "behavioural",
    roleId: "frontend-developer",
    depth: 2,
    prompt:
      "Describe a time you worked with others on something that had to fit together — a project, a class assignment, or any team you've been part of. What was your part, and how did you keep it in sync with everyone else's?",
    lookFor: [
      "States clearly what they personally owned versus the team",
      "Names the actual coordination mechanism used (Git branches, a shared doc, daily check-ins)",
      "Describes a specific point of friction or mismatch and how it was resolved",
      "States how the work ended up: shipped, graded, demoed",
    ],
    followUp: "What would you set up differently at the start if you did that project again?",
    minWords: 60,
  },
  {
    id: "frontend-developer-int-4",
    kind: "situational",
    roleId: "frontend-developer",
    depth: 2,
    context:
      "You're building a page from a design file. The design looks good on a desktop screen, but on a narrow phone the table it specifies would be unreadable, and one text colour on the background is very hard to read. The designer is busy and the feature is due in two days.",
    prompt: "What do you do, and what do you say to the designer?",
    lookFor: [
      "Raises the issues rather than silently building something broken or silently overriding the design",
      "Proposes a concrete alternative for the mobile table (stacked cards, horizontal scroll, fewer columns)",
      "Treats the contrast problem as a real accessibility issue, not a preference",
      "Keeps the deadline in view: suggests shipping something and flagging the rest",
    ],
    followUp: "What if the designer disagrees with your suggestion and wants it exactly as drawn?",
    minWords: 60,
  },
  {
    id: "frontend-developer-int-5",
    kind: "behavioural",
    roleId: "frontend-developer",
    depth: 3,
    prompt:
      "Tell us about a time your code broke something, or someone reviewed your work and asked for significant changes. How did you react then, and what do you do differently now?",
    lookFor: [
      "Describes the specific bug or review comment concretely",
      "Is honest about the initial reaction, including if it stung",
      "Names what was actually done to fix it and how long it took",
      "Names a lasting change: a testing habit, a review habit, a way of asking questions earlier",
    ],
    followUp: "What does your self-review look like now before you hand code to someone else?",
    minWords: 80,
  },
  {
    id: "frontend-developer-int-6",
    kind: "situational",
    roleId: "frontend-developer",
    depth: 3,
    context:
      "A feature ships tomorrow. It works, but you know the component you wrote is messy: state is duplicated in two places and it will be painful for the next person. Rewriting it properly would take most of a day and risk introducing new bugs right before release.",
    prompt: "What do you do, and how do you justify that choice to your team lead?",
    lookFor: [
      "Makes an actual decision rather than listing options",
      "Separates 'ugly but correct' from 'likely to break', and reasons about risk of a late rewrite",
      "Proposes making the debt visible: a ticket, a TODO with context, a note in the PR",
      "Gives the lead the information to overrule them, rather than deciding in silence",
    ],
    followUp: "How would your answer change if the messy state was also causing a bug users could hit?",
    minWords: 80,
  },

  // ── Backend Developer ──────────────────────────────────────────
  {
    id: "backend-developer-int-1",
    kind: "behavioural",
    roleId: "backend-developer",
    depth: 1,
    prompt:
      "Tell us about yourself and why backend development appeals to you more than the other parts of building software.",
    lookFor: [
      "Names their background and how they got into programming",
      "Gives a specific pull towards backend work: data, logic, APIs, correctness",
      "Names a language or stack they're actually comfortable in",
      "Shows some awareness of what backend engineers do day to day",
    ],
    minWords: 40,
  },
  {
    id: "backend-developer-int-2",
    kind: "behavioural",
    roleId: "backend-developer",
    depth: 1,
    prompt:
      "What have you built that had a backend or a database behind it? Tell us how you designed it.",
    lookFor: [
      "Describes the domain and what the API or service was responsible for",
      "Names concrete design decisions: the tables, the endpoints, or how data was modelled",
      "Explains why one choice was made over another, even briefly",
      "Mentions something they'd change now that they've seen it working",
    ],
    minWords: 40,
  },
  {
    id: "backend-developer-int-3",
    kind: "behavioural",
    roleId: "backend-developer",
    depth: 2,
    prompt:
      "Tell us about a time you had to agree on an interface or a shared piece of work with someone else — in a project, a class, or any team you've been part of. How did you get to agreement?",
    lookFor: [
      "Names the specific thing being agreed on (an API contract, a data format, a module boundary)",
      "Describes how it was written down or communicated, not just discussed",
      "Names a disagreement or misunderstanding and how it was resolved",
      "States whether the agreement actually held once code was written",
    ],
    followUp: "What broke, or nearly broke, because something wasn't agreed clearly enough?",
    minWords: 60,
  },
  {
    id: "backend-developer-int-4",
    kind: "situational",
    roleId: "backend-developer",
    depth: 2,
    context:
      "A frontend teammate is blocked waiting on your endpoint. They ask you to just return the data quickly and skip the validation and permission checks for now, promising to 'add it later once the demo is done'.",
    prompt: "How do you respond?",
    lookFor: [
      "Recognises that skipped auth or validation rarely gets added back later",
      "Offers a concrete way to unblock them anyway (mock data, a stub, a flagged dev-only route)",
      "Distinguishes what is genuinely safe to defer from what is not",
      "Handles it as a collaboration, not a refusal",
    ],
    followUp: "What would you do if a manager, not a teammate, made the same request?",
    minWords: 60,
  },
  {
    id: "backend-developer-int-5",
    kind: "behavioural",
    roleId: "backend-developer",
    depth: 3,
    prompt:
      "Describe a mistake you made in code or a design decision that turned out badly. How did you find out, what did you do, and what changed in how you work?",
    lookFor: [
      "Describes a real, specific mistake with enough detail to be believable",
      "Says how it was discovered: a test, a user, a teammate, or themselves",
      "Describes the fix and any communication that went with it",
      "Names a concrete practice adopted afterwards, not a general resolution to 'be careful'",
    ],
    followUp: "Where would that same mistake still be possible in your work today?",
    minWords: 80,
  },
  {
    id: "backend-developer-int-6",
    kind: "situational",
    roleId: "backend-developer",
    depth: 3,
    context:
      "An endpoint you own is slow: it takes about four seconds under real load and users are complaining. The clean fix is to restructure how the data is stored, which is a week of work. A quick fix — caching the response for five minutes — would take an afternoon but would sometimes show people slightly stale data.",
    prompt: "Which do you do, and what do you need to know before deciding?",
    lookFor: [
      "Asks what the data is and whether staleness is actually harmful for it",
      "Picks a path and commits, with a stated reason",
      "Treats the quick fix as buying time, with a plan for the real fix rather than abandoning it",
      "Mentions measuring: confirming where the four seconds actually goes before optimising",
    ],
    followUp: "If the data were account balances rather than a product listing, what changes?",
    minWords: 80,
  },

  // ── QA Engineer ────────────────────────────────────────────────
  {
    id: "qa-engineer-int-1",
    kind: "behavioural",
    roleId: "qa-engineer",
    depth: 1,
    prompt:
      "Introduce yourself, and tell us what made you interested in quality assurance and testing.",
    lookFor: [
      "Names their background and how they came across testing as a career",
      "Gives a specific reason beyond 'I have an eye for detail'",
      "Shows some understanding that QA is designing tests, not only clicking through screens",
    ],
    minWords: 40,
  },
  {
    id: "qa-engineer-int-2",
    kind: "behavioural",
    roleId: "qa-engineer",
    depth: 1,
    prompt:
      "What have you done to learn testing so far — a course, a tool, a practice project? Tell us about one thing you tested and what you found.",
    lookFor: [
      "Names the specific tools or techniques learned (test case design, Postman, a bug tracker)",
      "Describes an actual application or feature they tested",
      "Names at least one concrete defect or issue they found",
      "Shows how they decided what to test, not just that they tested",
    ],
    minWords: 40,
  },
  {
    id: "qa-engineer-int-3",
    kind: "behavioural",
    roleId: "qa-engineer",
    depth: 2,
    prompt:
      "Tell us about a time you had to tell someone their work had a problem — in a project, a class, or any team you've been part of. How did you raise it, and how did they take it?",
    lookFor: [
      "Describes the problem factually and what evidence they had",
      "Names how it was raised: privately, in writing, with reproduction steps, with the impact stated",
      "Describes the other person's reaction honestly, including if it was defensive",
      "States the outcome: whether the problem got fixed",
    ],
    followUp: "How do you word a report so it lands as helpful rather than as criticism?",
    minWords: 60,
  },
  {
    id: "qa-engineer-int-4",
    kind: "situational",
    roleId: "qa-engineer",
    depth: 2,
    context:
      "An hour before a release goes live, you find a bug: under a specific but realistic sequence of steps, a user's saved details are wiped. The developer says it's an edge case and the release has already been announced to customers.",
    prompt: "What do you do next?",
    lookFor: [
      "Establishes the facts first: exact reproduction steps, how often, what data is lost",
      "Frames the decision in terms of user impact and recoverability, not 'edge case' versus 'not'",
      "Escalates to whoever actually owns the go/no-go call rather than arguing it alone with the developer",
      "Offers options: block, ship with a fix planned, ship with the path disabled or a warning",
    ],
    followUp: "What do you do if the call is made to release anyway?",
    minWords: 60,
  },
  {
    id: "qa-engineer-int-5",
    kind: "behavioural",
    roleId: "qa-engineer",
    depth: 3,
    prompt:
      "Tell us about a time you missed something, or someone caught a problem you'd overlooked. What happened, and how has it changed the way you check your own work?",
    lookFor: [
      "Describes a specific miss or rejection, not a hypothetical",
      "Explains why it was missed: assumption made, area not covered, time pressure",
      "Describes how it was handled once discovered",
      "Names a concrete change: a checklist, a coverage habit, asking about requirements earlier",
    ],
    followUp: "What does that change actually look like on a normal working day?",
    minWords: 80,
  },
  {
    id: "qa-engineer-int-6",
    kind: "situational",
    roleId: "qa-engineer",
    depth: 3,
    context:
      "You have two days to test a release with more changes in it than you can cover properly. Testing everything shallowly means you might miss a serious bug; testing a few areas deeply means whole features go untested. Nobody is going to give you more time.",
    prompt: "How do you decide where your two days go, and what do you tell the team?",
    lookFor: [
      "Uses a stated basis for prioritising: risk, what changed, what users touch most, money paths",
      "Makes the untested areas explicit to the team rather than leaving them assumed-tested",
      "Commits to a concrete split of the two days rather than describing prioritisation in the abstract",
      "Mentions what would make them come back and re-plan mid-way",
    ],
    followUp: "How would you report your coverage so the team knows exactly what risk they're accepting?",
    minWords: 80,
  },

  // ── DevOps Engineer ────────────────────────────────────────────
  {
    id: "devops-engineer-int-1",
    kind: "behavioural",
    roleId: "devops-engineer",
    depth: 1,
    prompt:
      "Tell us about yourself and what drew you to DevOps rather than writing application code.",
    lookFor: [
      "Names their background and how they found their way to infrastructure or automation",
      "Gives a specific pull: automation, Linux, reliability, making things repeatable",
      "Names at least one tool they've actually used (Docker, a CI service, a cloud provider)",
      "Shows awareness that DevOps is about how software gets shipped and run",
    ],
    minWords: 40,
  },
  {
    id: "devops-engineer-int-2",
    kind: "behavioural",
    roleId: "devops-engineer",
    depth: 1,
    prompt:
      "What have you set up or automated yourself — a pipeline, a container, a server, a script? Walk us through one of them.",
    lookFor: [
      "Describes what the setup does end to end, from trigger to result",
      "Names the specific tools used and why they were chosen",
      "Names a concrete thing that didn't work at first and how it was debugged",
      "States what the automation saved or made possible",
    ],
    minWords: 40,
  },
  {
    id: "devops-engineer-int-3",
    kind: "behavioural",
    roleId: "devops-engineer",
    depth: 2,
    prompt:
      "Describe a time you helped other people work faster or unblocked someone — in a project, a class, or any team you've been part of. What did you actually do?",
    lookFor: [
      "Names the specific friction or blocker the others were hitting",
      "Describes the concrete thing they built, documented or fixed",
      "States how the others knew about it: documentation, a walkthrough, a README",
      "States the result in observable terms: time saved, errors stopped, people unblocked",
    ],
    followUp: "How did you check the fix actually stuck rather than being worked around?",
    minWords: 60,
  },
  {
    id: "devops-engineer-int-4",
    kind: "situational",
    roleId: "devops-engineer",
    depth: 2,
    context:
      "A deployment you ran twenty minutes ago has gone out, and the application is now throwing errors for some users. You have the pipeline logs open, and three people are messaging you asking what's happening.",
    prompt: "What are your first steps, and in what order?",
    lookFor: [
      "Prioritises restoring service (rollback) over finding the root cause first",
      "Names the concrete signals they'd check: logs, error rate, health checks, what changed",
      "Sends one clear update to the people asking instead of answering each separately",
      "Keeps the investigation for after recovery, and says so",
    ],
    followUp: "Once things are stable again, what do you do before you attempt the deploy a second time?",
    minWords: 60,
  },
  {
    id: "devops-engineer-int-5",
    kind: "behavioural",
    roleId: "devops-engineer",
    depth: 3,
    prompt:
      "Tell us about a time you broke something, lost work, or got a change badly wrong. What happened, how did you recover, and what do you do differently now?",
    lookFor: [
      "Describes a specific incident with enough detail to be real",
      "Is clear about their own role in causing it",
      "Describes the recovery steps taken and how long it took",
      "Names a concrete safeguard added afterwards: a backup, a check, a staging step, a confirmation",
    ],
    followUp: "Has that safeguard been tested since? How do you know it works?",
    minWords: 80,
  },
  {
    id: "devops-engineer-int-6",
    kind: "situational",
    roleId: "devops-engineer",
    depth: 3,
    context:
      "Your CI pipeline takes 25 minutes, and the team is frustrated. Most of that is the test suite. Someone suggests running only a subset of tests on every push and the full suite nightly — which would cut it to five minutes, but means a broken change could sit in the main branch until the next morning.",
    prompt: "Would you make that change? Explain the trade-off you're accepting.",
    lookFor: [
      "States a decision and the reasoning, not just both sides",
      "Looks for a third option: parallelising, caching, running the full suite only before merge",
      "Names what would make the risk acceptable: how quickly a nightly failure gets noticed and reverted",
      "Ties the choice to the team's actual situation (release frequency, how bad a broken main is)",
    ],
    followUp: "How would you know, three months later, whether that was the right call?",
    minWords: 80,
  },
];
