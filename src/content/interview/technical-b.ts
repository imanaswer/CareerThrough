import type { InterviewPrompt } from "../taxonomy";

export const prompts: InterviewPrompt[] = [
  // ───────── manual-testing ─────────
  {
    id: "manual-testing-int-1",
    kind: "technical",
    skillId: "manual-testing",
    depth: 2,
    prompt:
      "A fresher joining your team asks why you bother with a smoke test when the full regression suite exists anyway. Explain the difference to them, and how you decide what to run when a new build arrives.",
    lookFor: [
      "Describes smoke as a shallow check of critical paths, run first",
      "Uses the smoke result as the gate for whether deeper testing starts",
      "Ties regression scope to what the change actually touched",
      "Gives a concrete example of a check in each category",
    ],
    followUp: "What would you run if the smoke test passed but you only had two hours left?",
    minWords: 60,
  },
  {
    id: "manual-testing-int-2",
    kind: "technical",
    skillId: "manual-testing",
    depth: 3,
    context:
      "Release day. A payment defect was fixed at 4pm and the build reached QA at 5pm. The release window closes at 7pm. A full regression pass takes about nine hours.",
    prompt:
      "You cannot run everything. Explain how you decide what to test in those two hours, and what you say on the release call.",
    lookFor: [
      "Confirms the specific fix first, then widens by risk",
      "Prioritises areas that depend on payments (totals, invoices, refunds)",
      "States untested areas explicitly instead of implying full coverage",
      "Gives a go/no-go recommendation with the residual risk named",
    ],
    followUp: "What is the one check you would refuse to skip, and why that one?",
    minWords: 80,
  },

  // ───────── test-case-design ─────────
  {
    id: "test-case-design-int-1",
    kind: "technical",
    skillId: "test-case-design",
    depth: 2,
    context: "Requirement: a delivery-slot field accepts bookings from 1 to 30 days ahead, whole days only.",
    prompt:
      "Walk me through how you turn this one line into a small set of test cases, explaining your technique to someone who has never heard of it.",
    lookFor: [
      "Names equivalence partitioning and boundary value analysis",
      "Identifies valid and invalid partitions, including below 1 and above 30",
      "Tests the edges 0, 1, 30 and 31 rather than only middle values",
      "Explains why one value per partition is enough",
    ],
    followUp: "If you could run only one of your test cases, which would you keep?",
    minWords: 60,
  },
  {
    id: "test-case-design-int-2",
    kind: "technical",
    skillId: "test-case-design",
    depth: 3,
    context:
      "The requirement reads, in full: \"Members get free delivery. Orders over 2000 get free delivery. A coupon cannot be combined with the member discount.\"",
    prompt:
      "Explain where this rule is ambiguous, and how you would use a decision table to expose the gaps before writing a single test case.",
    lookFor: [
      "Lists the conditions and counts the full combinations (2 to the power of n)",
      "Names a specific combination with no stated outcome, such as a member using a coupon",
      "Says it would take the gaps back to the BA or product owner rather than guess",
      "Mentions collapsing rules using don't-care entries",
    ],
    followUp: "After collapsing, how many cases would you keep, and what coverage did you give up?",
    minWords: 80,
  },

  // ───────── sdlc-stlc ─────────
  {
    id: "sdlc-stlc-int-1",
    kind: "technical",
    skillId: "sdlc-stlc",
    depth: 2,
    prompt:
      "A developer on your team says testers have nothing to do until there is code to test. Explain what a tester is actually doing on a story in the days before any code exists.",
    lookFor: [
      "Names early activities: requirement analysis, acceptance criteria review, test design",
      "Explains static testing, reviewing requirements, as cheap defect removal",
      "Connects it to shift-left or testing in parallel with development",
      "Names a concrete output, such as test cases or questions raised in refinement",
    ],
    followUp: "Give one question you would ask in refinement about a story that looked clear.",
    minWords: 60,
  },
  {
    id: "sdlc-stlc-int-2",
    kind: "technical",
    skillId: "sdlc-stlc",
    depth: 3,
    context:
      "Your team's exit criteria say no critical or high defects may be open at release. Two days out, three high defects are open and the product owner asks the team to re-label them as medium so the release can proceed.",
    prompt: "Explain how you respond, and what you would put in writing either way.",
    lookFor: [
      "Separates the severity judgement from the schedule pressure",
      "Proposes a documented exception with sign-off rather than silently re-labelling",
      "Names the business or product owner as the one who owns the release decision",
      "Insists the residual risk is recorded in the test summary report",
    ],
    followUp: "What do you do if the product owner overrules you anyway?",
    minWords: 80,
  },

  // ───────── api-testing ─────────
  {
    id: "api-testing-int-1",
    kind: "technical",
    skillId: "api-testing",
    depth: 2,
    prompt:
      "A teammate closes an API test as passed because the response was 200 OK. Explain what else you would check before agreeing, and why the status code alone is not enough.",
    lookFor: [
      "Distinguishes the request succeeding from the data being correct",
      "Names concrete checks: field presence, data types, specific values",
      "Compares the response against the documented contract or spec",
      "Gives an example of a 200 response that should still fail the test",
    ],
    followUp: "How would you check that a field which should be absent really is absent?",
    minWords: 60,
  },
  {
    id: "api-testing-int-2",
    kind: "technical",
    skillId: "api-testing",
    depth: 3,
    context: "GET /orders/88 with a valid token for user A returns 404 Not Found. Order 88 exists and belongs to user B.",
    prompt:
      "Argue whether 404 or 403 is the right response here, covering both sides, and say what you would raise with the team.",
    lookFor: [
      "States that 403 means authenticated but not permitted, 401 means not identified",
      "Recognises 404 deliberately hides whether the resource exists",
      "Reaches a decision and ties it to the API's documented convention",
      "Says the same choice must be applied consistently across endpoints to be testable",
    ],
    followUp: "How would you test that the chosen convention is used consistently everywhere?",
    minWords: 80,
  },

  // ───────── bug-reporting ─────────
  {
    id: "bug-reporting-int-1",
    kind: "technical",
    skillId: "bug-reporting",
    depth: 2,
    prompt:
      "A developer keeps returning your defects as \"cannot reproduce\". Explain what goes into a report that removes that outcome, and why each part earns its place.",
    lookFor: [
      "Numbered steps with the exact test data and account used",
      "Environment and build or version number stated",
      "Expected result written separately from actual result",
      "Evidence attached: screenshot, recording, console or network log",
    ],
    followUp: "What would you add for a bug that only appears on one particular account?",
    minWords: 60,
  },
  {
    id: "bug-reporting-int-2",
    kind: "technical",
    skillId: "bug-reporting",
    depth: 3,
    context:
      "Checkout fails roughly one attempt in ten with the message \"Something went wrong\". You have not found a pattern yet. The release is next week.",
    prompt: "Describe how you investigate before logging it, and how you would argue its priority in triage.",
    lookFor: [
      "Varies one factor at a time: browser, account, input data, network",
      "Records a reproduction rate, such as 3 failures in 30 attempts",
      "Separates the severity of a failing checkout from the priority argument",
      "Names evidence to attach: timestamps, request ids, console or network logs",
    ],
    followUp: "What would you say if triage wanted to close it as not reproducible?",
    minWords: 80,
  },

  // ───────── test-automation ─────────
  {
    id: "test-automation-int-1",
    kind: "technical",
    skillId: "test-automation",
    depth: 2,
    prompt:
      "Your lead asks you to \"automate the whole regression suite\". Explain how you would decide what gets automated first and what you would deliberately leave manual.",
    lookFor: [
      "Prioritises stable, repetitive, high-risk flows run on every build",
      "Names poor candidates: one-off checks, screens still being redesigned, look-and-feel",
      "Counts ongoing maintenance cost as part of the decision",
      "Suggests pushing checks down to the API or unit level where possible",
    ],
    followUp: "For a login and checkout app, which five checks would you automate first?",
    minWords: 60,
  },
  {
    id: "test-automation-int-2",
    kind: "technical",
    skillId: "test-automation",
    depth: 3,
    context:
      "A UI test passes every time on your laptop but fails on roughly one CI run in four, always at the step asserting the order confirmation message.",
    prompt: "Explain how you would find the cause, and which fixes you would rule out and why.",
    lookFor: [
      "Suspects a synchronisation or timing gap before blaming the application",
      "Proposes an explicit, condition-based wait on the confirmation element",
      "Rules out fixed sleeps and blind CI retries, giving a reason for each",
      "Mentions other flake sources: shared test data, test order dependence",
    ],
    followUp: "When would a retry actually be the right answer rather than a cover-up?",
    minWords: 80,
  },

  // ───────── linux ─────────
  {
    id: "linux-int-1",
    kind: "technical",
    skillId: "linux",
    depth: 2,
    prompt:
      "A colleague messages you that a service on a Linux server is down. Describe, in order, what you would look at and why, before restarting anything.",
    lookFor: [
      "Checks service status and recent logs before taking any action",
      "Names a concrete place to look, such as journalctl or /var/log",
      "Checks whether the process is running and listening on its port",
      "Explains that restarting first destroys the evidence of the cause",
    ],
    followUp: "What would you capture before a restart so the cause is still investigable afterwards?",
    minWords: 60,
  },
  {
    id: "linux-int-2",
    kind: "technical",
    skillId: "linux",
    depth: 3,
    context:
      "A deploy fails with:\nbash: ./deploy.sh: Permission denied\nA long listing shows:\n-rw-r--r-- 1 deploy deploy 2140 Sep 18 09:12 deploy.sh",
    prompt: "Explain what that listing tells you about the cause, then say what you would change and what you would refuse to change.",
    lookFor: [
      "Reads the mode correctly: no execute bit for owner, group or others",
      "Proposes adding execute for the owner, such as chmod +x or 755",
      "Explains why chmod 777 is the wrong fix here",
      "Notes the file is owned by deploy, so the running user matters",
    ],
    followUp: "How would your answer change if the file were owned by root instead?",
    minWords: 80,
  },

  // ───────── ci-cd ─────────
  {
    id: "ci-cd-int-1",
    kind: "technical",
    skillId: "ci-cd",
    depth: 2,
    prompt:
      "Explain to a final-year student what a CI/CD pipeline actually does between \"I pushed my code\" and \"it is running on the server\", and why a team bothers building one.",
    lookFor: [
      "Describes stages in order: build, test, package an artifact, deploy",
      "Explains catching breakage early, on every change",
      "Notes the same process runs for everyone, removing \"works on my machine\"",
      "Names a trigger, such as a push or a pull request",
    ],
    followUp: "What should the pipeline do when the test stage fails, and who should find out?",
    minWords: 60,
  },
  {
    id: "ci-cd-int-2",
    kind: "technical",
    skillId: "ci-cd",
    depth: 3,
    context:
      "A deploy step fails only on the main branch:\nError: connect ECONNREFUSED - DB_PASSWORD is undefined\nThe identical step passes on every pull-request build.",
    prompt: "Say what you would suspect first, and how you would confirm it without ever printing the secret.",
    lookFor: [
      "Suspects an environment or secret scoping difference between branches and jobs",
      "Knows secrets are often withheld from forked or differently-scoped runs",
      "Proposes checking that the variable is set or its length, not echoing its value",
      "States that secrets must never be committed to the repo or written to logs",
    ],
    followUp: "What would you change so this fails loudly and early next time instead of at deploy?",
    minWords: 80,
  },

  // ───────── docker ─────────
  {
    id: "docker-int-1",
    kind: "technical",
    skillId: "docker",
    depth: 2,
    prompt:
      "Explain the difference between an image and a container to someone new, and why \"it works in my container\" is a stronger claim than \"it works on my machine\".",
    lookFor: [
      "Image as the immutable template, container as a running instance of it",
      "Names the Dockerfile as the versioned recipe for the image",
      "Explains that dependencies ship with the application",
      "Notes many containers can run from one image",
    ],
    followUp: "What about a container is still not identical between your laptop and production?",
    minWords: 60,
  },
  {
    id: "docker-int-2",
    kind: "technical",
    skillId: "docker",
    depth: 3,
    context:
      "A teammate reports: \"Every time we restart the database container, all the data is gone. The app container restarts fine.\"",
    prompt: "Explain what is almost certainly happening, and what you would check to confirm it before changing anything.",
    lookFor: [
      "Identifies the container's writable layer as ephemeral, lost on recreate",
      "Names a volume or bind mount as the fix for the data directory",
      "Proposes inspecting the compose file or run command for a missing volume",
      "Explains the app container is unaffected because it holds no state",
    ],
    followUp: "Once you add a named volume, where does the data actually live?",
    minWords: 80,
  },

  // ───────── cloud-fundamentals ─────────
  {
    id: "cloud-fundamentals-int-1",
    kind: "technical",
    skillId: "cloud-fundamentals",
    depth: 2,
    prompt:
      "Your manager says that now the company is on the cloud, security is the provider's problem. Explain what that gets right and what it gets wrong.",
    lookFor: [
      "Names the shared responsibility split: provider secures the cloud, customer secures what is in it",
      "Gives a concrete customer responsibility: access control, patching, or data",
      "Explains that IaaS, PaaS and SaaS move where the line sits",
      "Corrects the claim clearly without being dismissive",
    ],
    followUp: "Which responsibilities shift to the provider when you move from a VM to a managed database?",
    minWords: 60,
  },
  {
    id: "cloud-fundamentals-int-2",
    kind: "technical",
    skillId: "cloud-fundamentals",
    depth: 3,
    context: "An internal reporting job runs for about 90 seconds once an hour. It currently sits on a virtual machine that is powered on 24/7.",
    prompt:
      "Compare leaving it on the VM against moving it to a serverless function or a scheduled container, and say what you would need to know before choosing.",
    lookFor: [
      "Notices the VM sits idle almost all of the time, and frames that as cost",
      "Names a real constraint: cold start, maximum runtime, memory, or private network access",
      "Asks about runtime and dependencies before committing to an option",
      "Ends with an actual recommendation rather than a list of options",
    ],
    followUp: "What would change your recommendation if the job sometimes ran for 20 minutes?",
    minWords: 80,
  },

  // ───────── networking ─────────
  {
    id: "networking-int-1",
    kind: "technical",
    skillId: "networking",
    depth: 2,
    prompt:
      "A colleague cannot reach an internal web app at app.company.internal. Walk me through how you would narrow down where the traffic is failing, and why in that order.",
    lookFor: [
      "Separates name resolution, network reachability and the application itself",
      "Checks the DNS lookup early because it is cheap and often the cause",
      "Checks the specific port, not just whether the host answers",
      "Distinguishes no response at all from an error response",
    ],
    followUp: "How would you tell a DNS problem apart from a firewall problem?",
    minWords: 60,
  },
  {
    id: "networking-int-2",
    kind: "technical",
    skillId: "networking",
    depth: 3,
    context:
      "Users intermittently see:\n502 Bad Gateway\nA load balancer sits in front of four application servers. The logs on three of them look completely normal.",
    prompt: "Explain what a 502 from the load balancer tells you, and where you would look next.",
    lookFor: [
      "Reads 502 as the gateway failing to get a valid response from upstream",
      "Points the investigation at the backend, not the user's browser",
      "Suspects the fourth server and checks its logs and health-check status",
      "Links the roughly one-in-four intermittency to load balancing across four backends",
    ],
    followUp: "How would a correctly configured health check have kept users from seeing this at all?",
    minWords: 80,
  },

  // ───────── iac ─────────
  {
    id: "iac-int-1",
    kind: "technical",
    skillId: "iac",
    depth: 2,
    prompt:
      "Explain to someone who configures servers by hand what \"declarative\" means in infrastructure as code, and why there is a plan step before apply.",
    lookFor: [
      "Contrasts describing the desired end state with writing the steps to get there",
      "Describes the plan as a preview or diff of what will change",
      "Explains idempotency: applying twice does not create duplicate resources",
      "Names a real benefit: peer review, repeatability, or matching environments",
    ],
    followUp: "What would you do if a plan showed a change you did not expect?",
    minWords: 60,
  },
  {
    id: "iac-int-2",
    kind: "technical",
    skillId: "iac",
    depth: 3,
    context:
      "A teammate stopped an outage last night by editing a security group rule directly in the cloud console. The infrastructure code was never updated, and today's plan shows that rule will be removed.",
    prompt: "Explain what has happened here, and how you would resolve it without causing a second outage.",
    lookFor: [
      "Names drift between the real infrastructure and the code or state file",
      "Refuses to apply a plan that would silently revert the fix",
      "Proposes codifying the manual change and re-planning until there is no diff",
      "Explains why console changes are discouraged when state is the source of truth",
    ],
    followUp: "What would you put in place so the same drift does not happen again next month?",
    minWords: 80,
  },

  // ───────── monitoring ─────────
  {
    id: "monitoring-int-1",
    kind: "technical",
    skillId: "monitoring",
    depth: 2,
    prompt:
      "Using a single request through a web app as your example, explain the difference between metrics, logs and traces, and what each one is actually good at.",
    lookFor: [
      "Metrics as aggregated numbers over time, cheap to chart and alert on",
      "Logs as detailed discrete events you read for one specific request",
      "Traces as the path of one request across services, showing where time went",
      "Says which of the three it would reach for first when latency spikes",
    ],
    followUp: "If a service had none of the three, which would you add first and why?",
    minWords: 60,
  },
  {
    id: "monitoring-int-2",
    kind: "technical",
    skillId: "monitoring",
    depth: 3,
    context: "The on-call channel receives about 40 alerts a night. Most read \"CPU above 80% for 1 minute\" and nobody has acted on one in weeks.",
    prompt: "Explain what is wrong with this setup and how you would redesign the alerts, including what you would delete outright.",
    lookFor: [
      "Names alert fatigue, and that real incidents now get missed, as the actual risk",
      "Argues for alerting on user-visible symptoms such as errors or latency",
      "Proposes raising thresholds or durations, or deleting non-actionable alerts entirely",
      "States the rule that every alert must require a specific human action",
    ],
    followUp: "If you could keep only one alert for this service, which would it be?",
    minWords: 80,
  },

  // ───────── apt-numerical ─────────
  {
    id: "apt-numerical-int-1",
    kind: "technical",
    skillId: "apt-numerical",
    depth: 2,
    context:
      "Support handled 6,000 tickets last quarter with 7 agents. One agent closes about 12 tickets a day. Ticket volume is growing roughly 25% each quarter.",
    prompt:
      "Work out how many agents will be needed next quarter, showing every step of your reasoning and stating each assumption you had to make.",
    lookFor: [
      "States assumptions explicitly, such as working days per quarter",
      "Shows the arithmetic step by step rather than only a final number",
      "Sanity-checks whether the answer's magnitude is plausible against the current 7",
      "Flags a real-world factor that would change it, such as leave or ramp-up time",
    ],
    followUp: "Which single assumption is your answer most sensitive to?",
    minWords: 60,
  },
  {
    id: "apt-numerical-int-2",
    kind: "technical",
    skillId: "apt-numerical",
    depth: 3,
    context:
      "A report claims: \"Conversion improved 50% this month, from 2% to 3%.\" That month also ran a site-wide sale, and total visitors fell from 100,000 to 40,000.",
    prompt: "Reason through the numbers and say whether you would repeat that claim to leadership, and what you would report instead.",
    lookFor: [
      "Distinguishes a 1 percentage-point rise from a 50% relative rise",
      "Computes the actual conversions, 2,000 before versus 1,200 after, and notices the fall",
      "Names a confound: the sale, or a smaller and differently-composed audience",
      "Commits to the specific figure it would report and explains why",
    ],
    followUp: "What extra data would you ask for before drawing any conclusion at all?",
    minWords: 80,
  },

  // ───────── apt-logical ─────────
  {
    id: "apt-logical-int-1",
    kind: "technical",
    skillId: "apt-logical",
    depth: 2,
    context:
      "Facts given: every engineer on the project attended the security training. Priya attended the security training. Rahul is an engineer on the project.",
    prompt:
      "Say what you can and cannot conclude about Priya and about Rahul, reasoning aloud in writing as you would explain it to a teammate.",
    lookFor: [
      "Concludes correctly that Rahul attended the training",
      "Refuses to conclude Priya is an engineer, and says the facts do not support it",
      "Spells out that the rule runs one way only, engineers to training",
      "Explains the error in plain language, not just by naming a label",
    ],
    followUp: "What single extra fact would let you conclude Priya is an engineer?",
    minWords: 60,
  },
  {
    id: "apt-logical-int-2",
    kind: "technical",
    skillId: "apt-logical",
    depth: 3,
    context:
      "Four releases, A, B, C and D, went out one per day from Monday to Thursday. B was released after A. C was released on neither Monday nor Thursday. D was released on the day immediately after C.",
    prompt: "Work out the order, showing how each clue narrows the possibilities, and say whether the answer is unique.",
    lookFor: [
      "Uses the clues to eliminate positions rather than guessing an order",
      "Treats C and D as an adjacent pair with C first, so C is Tuesday or Wednesday",
      "Finds both valid orders: A, C, D, B and A, B, C, D",
      "States the answer is not unique instead of stopping at the first order found",
    ],
    followUp: "Which single extra clue would leave exactly one possible order?",
    minWords: 80,
  },

  // ───────── comm-written ─────────
  {
    id: "comm-written-int-1",
    kind: "technical",
    skillId: "comm-written",
    depth: 2,
    context:
      "A task you own was due Friday. It is Wednesday and you now know it needs three more days. A designer is blocked waiting for it.",
    prompt:
      "Write the message you would post in the team channel, then add a line or two explaining why you structured it that way.",
    lookFor: [
      "Leads with the slip and the impact rather than the backstory",
      "Commits to a specific revised date instead of \"soon\" or \"asap\"",
      "Says what the blocked designer should do in the meantime",
      "Takes ownership without excessive apology or blaming others",
    ],
    followUp: "How would the message change if you were writing to the client instead of your team?",
    minWords: 60,
  },
  {
    id: "comm-written-int-2",
    kind: "technical",
    skillId: "comm-written",
    depth: 3,
    context:
      "A colleague sent this to a client at 11pm:\n\"Hi, as discussed the thing is still not working, we tried everything but the issue is on your side I think. Can you check and revert asap? Thanks\"",
    prompt: "Critique this message and rewrite it, being specific about which parts cause a problem and why.",
    lookFor: [
      "Flags \"the thing\" and \"we tried everything\" as vague and unverifiable",
      "Objects to assigning blame to the client without evidence",
      "Calls out \"revert asap\" as an unclear ask with no deadline",
      "Rewrite names the issue, the evidence, one specific ask and a time",
    ],
    followUp: "How would you write it if you genuinely did believe the fault was on their side?",
    minWords: 80,
  },

  // ───────── soft-workplace ─────────
  {
    id: "soft-workplace-int-1",
    kind: "technical",
    skillId: "soft-workplace",
    depth: 2,
    context: "You are one month into your first job. You realise a report you produced last week has wrong totals, and it has already been sent to a client.",
    prompt: "Describe what you do, in order, and explain the reasoning behind that order.",
    lookFor: [
      "Raises it immediately rather than hoping it goes unnoticed",
      "Tells the person who can act, such as the lead, before quietly patching it",
      "Brings the cause and a proposed correction, not only the problem",
      "Suggests a concrete way to prevent a repeat, such as a check before sending",
    ],
    followUp: "What would make you hesitate to report it, and how would you handle that hesitation?",
    minWords: 60,
  },
  {
    id: "soft-workplace-int-2",
    kind: "technical",
    skillId: "soft-workplace",
    depth: 3,
    context:
      "It is 4pm. Your lead asked for a test report by end of day. A senior developer then asks you to drop it and help debug a production issue. Both call theirs urgent, and your lead is in meetings until 6.",
    prompt: "Explain what you actually do in the next ten minutes, and what you say to each of them.",
    lookFor: [
      "Acts within the ten minutes rather than freezing or silently picking one",
      "Makes the conflict visible to both people instead of deciding alone",
      "Proposes a concrete split of time or a revised deadline with a specific hour",
      "Escalates to the lead with options attached, not just the problem",
    ],
    followUp: "What would you do if you had to choose and could reach neither of them?",
    minWords: 80,
  },
];
