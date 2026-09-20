import type { Skill, Question, SkillPlan } from "../taxonomy";

export const skills: Skill[] = [
  {
    id: "apt-numerical",
    name: "Numerical Reasoning",
    dimension: "aptitude",
    description:
      "Works quickly and accurately with percentages, ratios, tables of data and rate problems to reach sound everyday business conclusions.",
    topics: [
      { id: "apt-numerical-percentages", name: "Percentages" },
      { id: "apt-numerical-ratios", name: "Ratios & Mixtures" },
      { id: "apt-numerical-data-interpretation", name: "Data Interpretation" },
      { id: "apt-numerical-time-work-rate", name: "Time, Work & Rate" },
    ],
  },
  {
    id: "apt-logical",
    name: "Logical Reasoning",
    dimension: "aptitude",
    description:
      "Spots patterns, draws only the conclusions the facts support, and works through constraints step by step to solve unfamiliar problems.",
    topics: [
      { id: "apt-logical-sequences", name: "Sequences & Patterns" },
      { id: "apt-logical-deduction", name: "Syllogisms & Deduction" },
      { id: "apt-logical-arrangements", name: "Arrangements & Ordering" },
      { id: "apt-logical-problem-solving", name: "Problem Solving" },
    ],
  },
  {
    id: "comm-written",
    name: "Professional Communication",
    dimension: "communication",
    description:
      "Writes clear, well-structured and appropriately toned emails, chat messages and status updates that colleagues can act on without follow-up questions.",
    topics: [
      { id: "comm-written-clarity", name: "Clarity & Concision" },
      { id: "comm-written-structure", name: "Structure & Subject Lines" },
      { id: "comm-written-tone", name: "Tone & Professionalism" },
      { id: "comm-written-updates", name: "Status Updates & Chat" },
    ],
  },
  {
    id: "soft-workplace",
    name: "Workplace Judgement",
    dimension: "soft_skills",
    description:
      "Chooses the professional course of action in everyday workplace situations: owning outcomes, collaborating, using feedback, prioritising and acting with integrity.",
    topics: [
      { id: "soft-workplace-ownership", name: "Ownership & Initiative" },
      { id: "soft-workplace-teamwork", name: "Teamwork & Disagreement" },
      { id: "soft-workplace-feedback", name: "Handling Feedback" },
      { id: "soft-workplace-prioritisation-integrity", name: "Prioritisation & Integrity" },
    ],
  },
];

export const questions: Question[] = [
  // ---------- apt-numerical ----------
  {
    id: "apt-numerical-q1",
    skillId: "apt-numerical",
    topicId: "apt-numerical-percentages",
    prompt: "The price of an item is increased by 20% and the new price is then reduced by 20%. What is the net change from the original price?",
    options: ["No change", "4% increase", "4% decrease", "2% decrease"],
    answer: 2,
    explanation: "1.20 x 0.80 = 0.96, so the final price is 96% of the original: a 4% decrease.",
  },
  {
    id: "apt-numerical-q2",
    skillId: "apt-numerical",
    topicId: "apt-numerical-percentages",
    prompt:
      "Meera earns Rs 40,000 a month and spends 65% of it. Her salary rises by 10% while her spending stays the same in rupees. What are her new monthly savings?",
    options: ["Rs 18,000", "Rs 15,400", "Rs 14,000", "Rs 16,600"],
    answer: 0,
    explanation: "Spending = 65% of 40,000 = 26,000. New salary = 44,000. Savings = 44,000 - 26,000 = Rs 18,000.",
  },
  {
    id: "apt-numerical-q3",
    skillId: "apt-numerical",
    topicId: "apt-numerical-ratios",
    prompt: "Rs 640 is divided between A and B in the ratio 3 : 5. How much more does B receive than A?",
    options: ["Rs 80", "Rs 120", "Rs 240", "Rs 160"],
    answer: 3,
    explanation: "8 parts = 640, so 1 part = 80. B - A = 5 - 3 = 2 parts = Rs 160.",
  },
  {
    id: "apt-numerical-q4",
    skillId: "apt-numerical",
    topicId: "apt-numerical-ratios",
    prompt: "A 60-litre mixture contains milk and water in the ratio 7 : 3. How many litres of water must be added to make the ratio 3 : 2?",
    options: ["8 litres", "10 litres", "12 litres", "6 litres"],
    answer: 1,
    explanation: "Milk = 42 L, water = 18 L. 42 / (18 + x) = 3/2 gives 18 + x = 28, so x = 10 litres.",
  },
  {
    id: "apt-numerical-q5",
    skillId: "apt-numerical",
    topicId: "apt-numerical-data-interpretation",
    prompt:
      "A company's quarterly sales (in Rs lakh) were: Q1 = 120, Q2 = 150, Q3 = 180, Q4 = 150. Q3 sales were what percentage of the annual total?",
    options: ["25%", "36%", "30%", "33%"],
    answer: 2,
    explanation: "Annual total = 120 + 150 + 180 + 150 = 600. 180 / 600 = 30%.",
  },
  {
    id: "apt-numerical-q6",
    skillId: "apt-numerical",
    topicId: "apt-numerical-data-interpretation",
    prompt:
      "Units sold in January and February: Product A 200 then 250; Product B 80 then 108; Product C 500 then 600; Product D 150 then 195. Which product had the highest percentage growth?",
    options: ["Product A", "Product B", "Product C", "Product D"],
    answer: 1,
    explanation: "A: 50/200 = 25%, B: 28/80 = 35%, C: 100/500 = 20%, D: 45/150 = 30%. B is highest even though C added the most units.",
  },
  {
    id: "apt-numerical-q7",
    skillId: "apt-numerical",
    topicId: "apt-numerical-time-work-rate",
    prompt: "A can finish a job alone in 12 days and B alone in 18 days. Working together, how long will they take?",
    options: ["15 days", "6 days", "7.5 days", "7.2 days"],
    answer: 3,
    explanation: "Combined rate = 1/12 + 1/18 = 3/36 + 2/36 = 5/36 of the job per day, so time = 36/5 = 7.2 days.",
  },
  {
    id: "apt-numerical-q8",
    skillId: "apt-numerical",
    topicId: "apt-numerical-time-work-rate",
    prompt: "A train 150 m long travelling at 54 km/h crosses a platform 300 m long. How long does it take to cross completely?",
    options: ["30 seconds", "20 seconds", "10 seconds", "25 seconds"],
    answer: 0,
    explanation: "54 km/h = 54 x 5/18 = 15 m/s. Distance = 150 + 300 = 450 m. Time = 450 / 15 = 30 seconds.",
  },

  // ---------- apt-logical ----------
  {
    id: "apt-logical-q1",
    skillId: "apt-logical",
    topicId: "apt-logical-sequences",
    prompt: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "36", "44"],
    answer: 1,
    explanation: "The differences are 4, 6, 8, 10, so the next difference is 12: 30 + 12 = 42 (the terms are n x (n + 1)).",
  },
  {
    id: "apt-logical-q2",
    skillId: "apt-logical",
    topicId: "apt-logical-sequences",
    prompt: "What is the next number in the series: 3, 5, 9, 17, 33, ?",
    options: ["49", "66", "57", "65"],
    answer: 3,
    explanation: "The differences double each time: 2, 4, 8, 16, so the next is 32 and 33 + 32 = 65 (each term is 2 x previous - 1).",
  },
  {
    id: "apt-logical-q3",
    skillId: "apt-logical",
    topicId: "apt-logical-deduction",
    prompt: "Every intern at a firm has been issued a laptop. Ravi has not been issued a laptop. Which conclusion must be true?",
    options: [
      "Ravi is not an intern at the firm",
      "Ravi is a full-time employee of the firm",
      "Everyone with a laptop is an intern",
      "Ravi will be issued a laptop soon",
    ],
    answer: 0,
    explanation: "If Ravi were an intern he would have a laptop; he does not, so he cannot be an intern. The other options add facts the statements do not give.",
  },
  {
    id: "apt-logical-q4",
    skillId: "apt-logical",
    topicId: "apt-logical-deduction",
    prompt: "Rule: if the build fails, the deployment is blocked. Today the deployment was not blocked. What can you conclude with certainty?",
    options: [
      "The build failed but was overridden",
      "Nothing can be concluded about the build",
      "The build did not fail",
      "Deployments are blocked only when builds fail",
    ],
    answer: 2,
    explanation: "A failed build would have forced a blocked deployment. Since it was not blocked, the build cannot have failed (contrapositive).",
  },
  {
    id: "apt-logical-q5",
    skillId: "apt-logical",
    topicId: "apt-logical-arrangements",
    prompt:
      "A, B, C, D and E sit in a row of five seats. C is in the middle seat, A is at the left end, B is immediately to the right of C, and D is not next to A. Who sits second from the left?",
    options: ["B", "D", "C", "E"],
    answer: 3,
    explanation: "A = seat 1, C = seat 3, B = seat 4. D and E take seats 2 and 5; D cannot be beside A, so D = seat 5 and E = seat 2.",
  },
  {
    id: "apt-logical-q6",
    skillId: "apt-logical",
    topicId: "apt-logical-arrangements",
    prompt:
      "P is taller than Q. R is shorter than Q. S is taller than P. T is shorter than P but taller than Q. When the five stand in order of height, who is in the middle?",
    options: ["T", "P", "Q", "S"],
    answer: 0,
    explanation: "The order from tallest is S > P > T > Q > R, so T is third of five.",
  },
  {
    id: "apt-logical-q7",
    skillId: "apt-logical",
    topicId: "apt-logical-problem-solving",
    prompt: "If today is Wednesday, what day of the week will it be 45 days from today?",
    options: ["Friday", "Sunday", "Saturday", "Thursday"],
    answer: 2,
    explanation: "45 = 6 x 7 + 3, so it is 3 days after Wednesday: Saturday.",
  },
  {
    id: "apt-logical-q8",
    skillId: "apt-logical",
    topicId: "apt-logical-problem-solving",
    prompt:
      "You have 9 identical-looking coins, one of which is heavier than the rest. Using a two-pan balance, what is the minimum number of weighings that guarantees finding the heavy coin?",
    options: ["1", "2", "3", "4"],
    answer: 1,
    explanation: "Weigh 3 against 3: the heavier side (or the unweighed 3 if balanced) holds the coin. Then weigh 1 against 1 from that group. Two weighings always suffice, and one cannot separate 9 cases.",
  },

  // ---------- comm-written ----------
  {
    id: "comm-written-q1",
    skillId: "comm-written",
    topicId: "comm-written-clarity",
    prompt:
      "Choose the best rewrite of: \"I am writing this email to inform you that, with regard to the sales report, it is the case that it will be delayed until Friday.\"",
    options: [
      "With regard to the sales report, please be informed that a delay until Friday is expected.",
      "Just FYI, report's late, will send whenever it's done.",
      "The sales report will be delayed until Friday.",
      "I wanted to reach out to let you know the sales report is going to be somewhat delayed.",
    ],
    answer: 2,
    explanation: "It keeps every fact (what, delayed, until when) and drops the filler. The others stay wordy, turn vague, or lose the date.",
  },
  {
    id: "comm-written-q2",
    skillId: "comm-written",
    topicId: "comm-written-clarity",
    prompt: "What is the main problem with this sentence in a team update? \"Rahul told Amit that his code broke the build.\"",
    options: [
      "It is unclear whose code broke the build",
      "It is written in the past tense",
      "It names colleagues directly",
      "It is too short to be professional",
    ],
    answer: 0,
    explanation: "\"His\" could refer to Rahul or Amit, so the reader cannot tell who needs to act. Naming people and being brief are not problems.",
  },
  {
    id: "comm-written-q3",
    skillId: "comm-written",
    topicId: "comm-written-structure",
    prompt: "You need your busy manager to approve two days of leave next week. Which is the best way to open the email?",
    options: [
      "A paragraph on how hard you have worked this quarter, then the request at the end",
      "\"Hope you are doing well. I wanted to discuss something when you have time.\"",
      "A detailed account of the family event, followed by the dates",
      "\"I'd like to request leave on 14-15 March. My tasks are on track and Priya will cover the support queue.\"",
    ],
    answer: 3,
    explanation: "A busy reader should see the ask, the dates and the impact in the first lines. The other openings bury or hide the request.",
  },
  {
    id: "comm-written-q4",
    skillId: "comm-written",
    topicId: "comm-written-structure",
    prompt: "Which subject line is best for an email asking finance to approve a vendor invoice before Thursday evening?",
    options: [
      "Invoice",
      "Approval needed by Thu 5 PM: Vendor invoice #4521",
      "URGENT!!! PLEASE READ IMMEDIATELY",
      "Quick question",
    ],
    answer: 1,
    explanation: "It states the action, the deadline and the specific item, so it can be prioritised and found later. The others are vague or alarmist.",
  },
  {
    id: "comm-written-q5",
    skillId: "comm-written",
    topicId: "comm-written-tone",
    prompt: "A colleague has not sent the data you need, and your own deadline is tomorrow. Which message is most professional?",
    options: [
      "\"Hi Sana, I need the Q2 data to finish the client deck due tomorrow. Could you share it by 3 PM today? If that's tight, tell me what you have and I'll work with it.\"",
      "\"Sana, I'm still waiting. This is the second time you've delayed me.\"",
      "\"Hi Sana, no rush at all, whenever you get a chance is fine!\"",
      "\"Sana, as per my previous email, kindly do the needful at the earliest.\"",
    ],
    answer: 0,
    explanation: "It is polite, specific about what is needed, why and by when, and offers a fallback. The others blame, hide the real urgency, or are stiff and vague.",
  },
  {
    id: "comm-written-q6",
    skillId: "comm-written",
    topicId: "comm-written-tone",
    prompt: "A client emails, upset that your team sent a report with wrong figures. Which reply is best?",
    options: [
      "\"The figures came from your own team's spreadsheet, so the error originated at your end.\"",
      "\"We are extremely, deeply sorry. This is unacceptable and we feel terrible about it.\"",
      "\"I'm sorry about the incorrect figures in yesterday's report. We traced it to a formula error, and a corrected version will reach you by 2 PM today.\"",
      "\"Noted. We will look into it.\"",
    ],
    answer: 2,
    explanation: "It acknowledges the problem, apologises once, and gives the cause, the fix and a time. The others deflect blame, over-apologise without a fix, or are dismissive.",
  },
  {
    id: "comm-written-q7",
    skillId: "comm-written",
    topicId: "comm-written-updates",
    prompt: "Which daily status update is most useful to your team lead?",
    options: [
      "\"Worked on the login module all day. Will continue tomorrow.\"",
      "\"Done: login API validation. Next: password reset flow, ETA Wed. Blocked: need staging DB access from DevOps.\"",
      "\"Very busy day, lots of progress, a few small issues but nothing major.\"",
      "\"Attended stand-up, replied to emails, had lunch, coded, attended a review meeting.\"",
    ],
    answer: 1,
    explanation: "Done / next / blocked with specifics and an ETA lets the lead see progress and unblock you. The others are vague or list activity instead of outcomes.",
  },
  {
    id: "comm-written-q8",
    skillId: "comm-written",
    topicId: "comm-written-updates",
    prompt: "At noon you realise you will miss today's 6 PM deadline that your lead is relying on. Which chat message is best?",
    options: [
      "Say nothing for now and send the work tomorrow morning with an apology",
      "\"Hey, might be a bit late on that thing, will keep you posted.\"",
      "At 5:55 PM: \"Sorry, the dashboard won't be ready today.\"",
      "\"Heads-up: the dashboard won't be ready by 6 PM because the export API changed. I can deliver it by 11 AM tomorrow, or send it today without the export tab. Which do you prefer?\"",
    ],
    answer: 3,
    explanation: "It flags the slip early and gives the reason, a new ETA and options, so the lead can plan. The others are late, vague or silent.",
  },

  // ---------- soft-workplace ----------
  {
    id: "soft-workplace-q1",
    skillId: "soft-workplace",
    topicId: "soft-workplace-ownership",
    prompt: "A week after your work went live, you discover a mistake in it that nobody else has noticed. What should you do?",
    options: [
      "Quietly fix it in the next release without mentioning it",
      "Tell your lead promptly, explain the impact, and propose a fix",
      "Wait and see whether anyone reports a problem",
      "Point out that the reviewer should have caught it",
    ],
    answer: 1,
    explanation: "Owning the mistake early lets the team limit the impact and builds trust. Hiding it, waiting or shifting blame all raise the risk and damage credibility.",
  },
  {
    id: "soft-workplace-q2",
    skillId: "soft-workplace",
    topicId: "soft-workplace-ownership",
    prompt: "You are assigned a task with one unclear requirement, and your lead is on leave today. The task is due in three days. What is the best approach?",
    options: [
      "Stop work until your lead returns and can explain it",
      "Guess the requirement and build the whole task without telling anyone",
      "Email the client directly to ask what they want",
      "Check the documents and ask a teammate, progress the clear parts, note your assumption, and confirm with your lead tomorrow",
    ],
    answer: 3,
    explanation: "It keeps work moving while making the assumption visible and cheap to correct. Waiting wastes time, silent guessing risks rework, and bypassing your lead to the client is out of turn.",
  },
  {
    id: "soft-workplace-q3",
    skillId: "soft-workplace",
    topicId: "soft-workplace-teamwork",
    prompt: "You have finished your part of a team deliverable. A teammate is clearly struggling with theirs, and the deadline is at risk. What should you do?",
    options: [
      "Offer to help them directly, and if the deadline is still at risk, agree together to flag it to the lead",
      "Do nothing, since your own part is complete",
      "Tell the lead privately that the teammate is not capable",
      "Redo their part yourself overnight without telling them",
    ],
    answer: 0,
    explanation: "The team is judged on the deliverable, so helping and raising risk openly is the professional move. Ignoring it, complaining behind their back or secretly redoing their work harms delivery or trust.",
  },
  {
    id: "soft-workplace-q4",
    skillId: "soft-workplace",
    topicId: "soft-workplace-teamwork",
    prompt: "In a team meeting, a colleague proposes an approach you believe has a serious flaw. What is the best response?",
    options: [
      "Stay silent in the meeting and complain to other teammates afterwards",
      "Say the idea will not work and insist that the team use yours",
      "Explain your concern with reasons, suggest an alternative, and support whatever the team finally decides",
      "Agree in the meeting, then quietly build it your own way",
    ],
    answer: 2,
    explanation: "Raising a reasoned concern in the open and then committing to the decision is how healthy teams disagree. The other options either withhold useful input or undermine the team.",
  },
  {
    id: "soft-workplace-q5",
    skillId: "soft-workplace",
    topicId: "soft-workplace-feedback",
    prompt: "A senior leaves many blunt comments on your first piece of reviewed work. What is the best way to respond?",
    options: [
      "Reply to each comment defending why you did it your way",
      "Ask your manager to assign you a different reviewer",
      "Fix only the easy comments and mark the rest as resolved",
      "Thank them, ask about anything unclear, address every comment, and note the patterns to avoid next time",
    ],
    answer: 3,
    explanation: "Review comments are about the work, not you; using them fully is the fastest way to improve. Defensiveness, avoidance and partial fixes waste the feedback.",
  },
  {
    id: "soft-workplace-q6",
    skillId: "soft-workplace",
    topicId: "soft-workplace-feedback",
    prompt: "In a one-to-one, your manager criticises you for missing a deadline, but you believe the delay was caused by a late input from another team. What should you do?",
    options: [
      "Listen fully, then calmly share the timeline with the facts, and ask what you could do differently next time",
      "Interrupt straight away to say it was the other team's fault",
      "Accept it silently and vent to colleagues later",
      "Send an email to the wider team explaining who was really to blame",
    ],
    answer: 0,
    explanation: "Hearing the feedback out, correcting the record with evidence, and still looking for your own lesson (for example, flagging the dependency earlier) is both honest and professional.",
  },
  {
    id: "soft-workplace-q7",
    skillId: "soft-workplace",
    topicId: "soft-workplace-prioritisation-integrity",
    prompt: "Two seniors each give you an \"urgent\" task due tomorrow. You can realistically finish only one. What should you do?",
    options: [
      "Do the task from the more senior person and ignore the other",
      "Attempt both and hand in whatever is finished at the deadline",
      "Tell both now, share your time estimates, and ask them or your manager to decide the priority",
      "Pick the one you find more interesting and explain later",
    ],
    answer: 2,
    explanation: "Surfacing the conflict early with estimates lets the people who own the priorities decide. The alternatives guarantee a surprise miss for someone.",
  },
  {
    id: "soft-workplace-q8",
    skillId: "soft-workplace",
    topicId: "soft-workplace-prioritisation-integrity",
    prompt: "To meet a release deadline, a teammate asks you to mark several test cases as \"passed\" without running them. What should you do?",
    options: [
      "Mark them as passed; the code will probably work",
      "Decline, run as many as time allows, and report the true status to your lead",
      "Mark them as passed but keep a private note in case it goes wrong",
      "Refuse, and post about the teammate's request in the company-wide chat",
    ],
    answer: 1,
    explanation: "Falsifying results is an integrity breach that pushes risk on to users; honest status lets the lead make an informed call. Public shaming is unnecessary when the lead can handle it.",
  },
];

export const plans: SkillPlan[] = [
  {
    skillId: "apt-numerical",
    days: [
      {
        topicId: "apt-numerical-percentages",
        title: "Percentages without a calculator",
        minutes: 45,
        summary: "Turn percentage change, successive change and percentage-of problems into quick multiplier arithmetic.",
        learn: [
          "Percent as a multiplier: +20% is x1.2, -20% is x0.8; successive changes multiply, they do not add",
          "Fraction equivalents worth memorising: 12.5% = 1/8, 16.67% = 1/6, 33.33% = 1/3, 37.5% = 3/8",
          "Percentage change = (new - old) / old, and why the base matters (a 25% rise needs a 20% fall to undo)",
          "Percentage points versus percent: moving from 10% to 12% is +2 points but +20%",
        ],
        practice:
          "Solve 15 mixed percentage problems (discount chains, salary/savings, reverse percentages) in 20 minutes, then redo every miss using multipliers.",
      },
      {
        topicId: "apt-numerical-ratios",
        title: "Ratios, proportion and mixtures",
        minutes: 45,
        summary: "Use the parts method to split quantities and adjust mixtures cleanly.",
        learn: [
          "Parts method: for a : b of total T, one part = T / (a + b)",
          "Combining ratios such as a : b and b : c by equalising the shared term",
          "Mixture problems: track the quantity that does not change (e.g. milk when only water is added)",
          "Direct versus inverse proportion, and how to spot which one a problem describes",
        ],
        practice:
          "Solve 12 problems: 4 on sharing in a ratio, 4 on combined ratios, 4 on mixtures, writing the unchanged quantity first for each mixture question.",
      },
      {
        topicId: "apt-numerical-data-interpretation",
        title: "Reading tables and charts",
        minutes: 60,
        summary: "Extract the right numbers from tables, bar charts and pie charts and compare them correctly.",
        learn: [
          "Read the title, units and axis scale before the question; most errors are unit or base errors",
          "Absolute change versus percentage growth: the largest increase is not always the fastest growth",
          "Share of total, averages across rows, and approximating by rounding to two significant figures",
          "Pie charts: converting between degrees, percentages and values (360 degrees = 100%)",
        ],
        practice:
          "Take two data-interpretation sets (one table, one bar or pie chart, 5 questions each) in 25 minutes, estimating before calculating exactly.",
      },
      {
        topicId: "apt-numerical-time-work-rate",
        title: "Time, work, speed and rate",
        minutes: 60,
        summary: "Model work and motion problems as rates that add, then solve with one equation.",
        learn: [
          "Work rate = 1 / time; rates of people or pipes working together add (outlets subtract)",
          "LCM method: assume total work equals the LCM of the given days to avoid fractions",
          "Speed, distance and time; converting km/h to m/s by multiplying by 5/18",
          "Trains and relative speed: total distance includes the train's own length; add speeds when opposite, subtract when same direction",
        ],
        practice:
          "Solve 12 problems (4 work, 4 pipes, 4 trains/relative speed) in 25 minutes, writing the rate equation before any arithmetic.",
      },
      {
        topicId: null,
        title: "Timed numerical challenge",
        minutes: 60,
        summary: "Simulate a placement-test numerical section under real time pressure and analyse your errors.",
        learn: [
          "Two-pass strategy: answer the quick questions first, mark the long ones and return",
          "Eliminating options by estimation and last-digit checks before computing in full",
          "Keeping an error log: concept gap, misread question, or calculation slip",
        ],
        practice:
          "Attempt a 25-question mixed numerical test in 30 minutes without a calculator, then classify every wrong or skipped question in your error log and re-solve it untimed.",
      },
    ],
  },
  {
    skillId: "apt-logical",
    days: [
      {
        topicId: "apt-logical-sequences",
        title: "Number and letter patterns",
        minutes: 45,
        summary: "Build a fixed checklist for cracking series questions quickly.",
        learn: [
          "First check differences, then differences of differences, then ratios",
          "Common families: squares, cubes, n x (n + 1), primes, doubling plus or minus a constant",
          "Interleaved series: test the odd and even positions as two separate patterns",
          "Letter series: convert letters to positions (A = 1 ... Z = 26) and treat them as numbers",
        ],
        practice:
          "Solve 20 series questions (15 number, 5 letter) in 20 minutes, writing the difference row under each series before choosing an answer.",
      },
      {
        topicId: "apt-logical-deduction",
        title: "Syllogisms and valid deduction",
        minutes: 60,
        summary: "Separate what must be true from what merely could be true.",
        learn: [
          "Venn diagrams for All, Some, No and Some-not statements",
          "If P then Q: the contrapositive (not Q, so not P) is valid; the converse and inverse are not",
          "\"Must be true\" versus \"could be true\": test a conclusion by trying to build a counter-example",
          "Ignoring real-world knowledge: use only the statements given",
        ],
        practice:
          "Solve 15 syllogism and conditional-statement questions, drawing a Venn diagram or writing the contrapositive for every one.",
      },
      {
        topicId: "apt-logical-arrangements",
        title: "Seating, ranking and ordering",
        minutes: 60,
        summary: "Turn a paragraph of constraints into a diagram you can read answers from.",
        learn: [
          "Draw the slots first, then place the fixed clues (ends, middle, exact positions) before the relative ones",
          "Glue pairs given as \"immediately next to\" into blocks and try each possible placement",
          "Ranking chains: write inequalities (S > P > T) and merge them into one order",
          "Circular arrangements: fix one person to remove rotations, and watch left/right when facing the centre",
        ],
        practice:
          "Solve 4 arrangement sets (2 linear, 1 ranking, 1 circular, about 4 questions each) in 30 minutes, completing the diagram before reading the questions.",
      },
      {
        topicId: "apt-logical-problem-solving",
        title: "Structured problem solving",
        minutes: 60,
        summary: "Apply reusable tactics to puzzle-style questions on calendars, directions, relations and weighing.",
        learn: [
          "Calendar and clock questions using remainders (days mod 7)",
          "Blood relations and direction sense: always draw the family tree or the path",
          "Divide-and-conquer reasoning, such as splitting into three groups for balance puzzles",
          "Working backwards from the answer options when the forward route is slow",
        ],
        practice:
          "Solve 16 mixed puzzles (4 calendar, 4 direction, 4 blood-relation, 4 logic puzzles), explaining each solution aloud in two sentences.",
      },
      {
        topicId: null,
        title: "Timed logical reasoning challenge",
        minutes: 60,
        summary: "Sit a full mixed logical section under time pressure and review your method, not just your score.",
        learn: [
          "Order of attack: series and deduction first, long arrangement sets last",
          "When to abandon a set: if the diagram is not fixed within 3 minutes, move on and return",
          "Reviewing method: for each miss, find the first step where your reasoning went wrong",
        ],
        practice:
          "Attempt a 25-question mixed logical reasoning test in 30 minutes, then rework every missed question from scratch and write down the clue you overlooked.",
      },
    ],
  },
  {
    skillId: "comm-written",
    days: [
      {
        topicId: "comm-written-clarity",
        title: "Say it clearly in fewer words",
        minutes: 40,
        summary: "Cut filler and ambiguity so each sentence carries one clear point.",
        learn: [
          "Cutting filler openers such as \"I am writing to inform you that\" and \"with regard to\"",
          "Active voice with a named actor: who does what by when",
          "Removing ambiguity: unclear pronouns, vague words (soon, some, ASAP) replaced by names, numbers and dates",
          "One idea per sentence; plain words over jargon and stock phrases",
        ],
        practice:
          "Take five long emails or messages you have written (or sample ones), cut each by at least 40% without losing a fact, and compare before and after.",
      },
      {
        topicId: "comm-written-structure",
        title: "Structure emails for busy readers",
        minutes: 45,
        summary: "Lead with the ask and organise the rest so a reader can act in 30 seconds.",
        learn: [
          "Bottom line up front: the request or conclusion in the first two lines, context after",
          "Subject lines that state action, item and deadline",
          "Short paragraphs, bullets for parallel items, and one email per topic",
          "A clear close: who owns the next step and by when",
        ],
        practice:
          "Write three emails (a leave request, a request for approval, a meeting follow-up with action items) and check each against a checklist: ask first, specific subject, clear next step.",
      },
      {
        topicId: "comm-written-tone",
        title: "Get the tone right",
        minutes: 45,
        summary: "Stay polite, direct and calm when asking, following up, disagreeing or apologising.",
        learn: [
          "Polite and direct at once: state the need and reason, and avoid both blame and false \"no rush\"",
          "Apology pattern: acknowledge, apologise once, give the cause, the fix and the time",
          "Adjusting formality for peers, managers and clients without becoming stiff or casual",
          "Things to avoid: all caps, sarcasm, passive-aggressive phrases and emotional replies sent in the moment",
        ],
        practice:
          "Rewrite four difficult messages (a follow-up on a late input, a reply to an upset client, declining a request, disagreeing with a senior) and have a peer rate each for clarity and respect.",
      },
      {
        topicId: "comm-written-updates",
        title: "Status updates and team chat",
        minutes: 40,
        summary: "Write updates and chat messages that show progress, surface risk early and need no follow-up questions.",
        learn: [
          "Done / Next / Blocked format with specifics and ETAs, reporting outcomes rather than activity",
          "Flagging bad news early with the reason, the new date and options",
          "Chat etiquette: a complete message in one go, the right channel or thread, no bare \"hi\"",
          "Asking good questions: what you tried, what you expected, what happened",
        ],
        practice:
          "Write a Done / Next / Blocked update for each of the last five days of your study or project work, plus one message warning of a missed deadline with options.",
      },
      {
        topicId: null,
        title: "Timed inbox simulation",
        minutes: 60,
        summary: "Handle a realistic batch of workplace messages against the clock and review them with a checklist.",
        learn: [
          "Triage first: decide the order of replies by urgency and who is blocked",
          "A 60-second pre-send check: ask up front, facts complete, tone, names, dates and attachments",
          "Self-review using the four lenses from days 1-4: clarity, structure, tone, actionability",
        ],
        practice:
          "In 40 minutes, write replies to six scenarios (manager request, client complaint, unclear task, deadline slip, peer follow-up, daily status), then score each out of 4 on the four lenses and rewrite the weakest one.",
      },
    ],
  },
  {
    skillId: "soft-workplace",
    days: [
      {
        topicId: "soft-workplace-ownership",
        title: "Ownership and initiative",
        minutes: 40,
        summary: "Learn what taking ownership looks like for a new hire when things are unclear or go wrong.",
        learn: [
          "Owning outcomes, not just tasks: the work is done when it works for the user, not when it is handed over",
          "Reporting your own mistakes early with the impact and a proposed fix",
          "Handling ambiguity: check available sources, progress the clear parts, state assumptions and confirm",
          "Knowing the limits of initiative: what to decide yourself versus what to escalate",
        ],
        practice:
          "Write up three situations from college, internships or projects where something went wrong or was unclear, in Situation-Action-Result form, and note what a stronger ownership response would have been.",
      },
      {
        topicId: "soft-workplace-teamwork",
        title: "Teamwork and healthy disagreement",
        minutes: 45,
        summary: "Practise helping teammates, raising risks and disagreeing without damaging trust.",
        learn: [
          "Team goal over individual task: the deliverable is what gets judged",
          "Offering help and raising delivery risk openly with the person, not behind their back",
          "Disagreeing well: concern plus reason plus alternative, stated in the room",
          "Disagree and commit: supporting the final decision even when it was not yours",
        ],
        practice:
          "Script, in three or four sentences each, how you would (a) offer help to a struggling teammate, (b) challenge a flawed idea in a meeting, and (c) raise a deadline risk with your lead.",
      },
      {
        topicId: "soft-workplace-feedback",
        title: "Receiving and using feedback",
        minutes: 40,
        summary: "Turn even blunt or partly unfair feedback into specific improvement.",
        learn: [
          "Separating the work from yourself: feedback targets output, not your worth",
          "Listen, clarify, act: ask questions before responding, then close every point",
          "Correcting wrong facts calmly with evidence, in private, while still finding your own lesson",
          "Asking for feedback proactively and tracking recurring themes",
        ],
        practice:
          "Ask a mentor, teacher or peer for two specific pieces of critical feedback on recent work, write down your clarifying questions and one action for each, and complete one action today.",
      },
      {
        topicId: "soft-workplace-prioritisation-integrity",
        title: "Prioritisation and integrity under pressure",
        minutes: 45,
        summary: "Decide what to do first, surface conflicts early, and hold the line on honesty when deadlines bite.",
        learn: [
          "Urgent versus important, and estimating honestly before committing",
          "Conflicting priorities: surface them early with estimates and let the owners of the priorities decide",
          "Integrity basics: never falsify status, results or data; report the truth and let leads make the call",
          "Saying no professionally: decline the action, offer what you can do, escalate through the right channel",
        ],
        practice:
          "List everything on your plate this week, sort it with an urgent/important grid and time estimates, then write the exact message you would send if two items clashed and one if you were asked to cut a corner.",
      },
      {
        topicId: null,
        title: "Situational judgement challenge",
        minutes: 60,
        summary: "Work through realistic workplace scenarios against the clock and justify each choice.",
        learn: [
          "A quick decision test: is it honest, is it early, does it involve the right person, does it help the team goal",
          "Spotting trap options: avoidance, blame, going over someone's head, and heroics done in secret",
          "Explaining your reasoning in STAR form for interview follow-up questions",
        ],
        practice:
          "Answer 15 situational-judgement scenarios in 25 minutes, picking both the best and the worst option for each, then write a one-line justification for every answer and review any you got wrong.",
      },
    ],
  },
];
