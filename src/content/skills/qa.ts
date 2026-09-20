import type { Skill, Question, SkillPlan } from "../taxonomy";

export const skills: Skill[] = [
  {
    id: "manual-testing",
    name: "Manual Testing",
    dimension: "technical",
    description:
      "Can test a feature by hand methodically, choosing the right test types and executing, re-testing and exploring without needing a script for every step.",
    topics: [
      { id: "manual-testing-fundamentals", name: "Testing Fundamentals & Principles" },
      { id: "manual-testing-levels-types", name: "Test Levels & Test Types" },
      { id: "manual-testing-execution", name: "Test Execution, Re-testing & Regression" },
      { id: "manual-testing-exploratory", name: "Exploratory & Non-functional Checks" },
    ],
  },
  {
    id: "test-case-design",
    name: "Test Case Design",
    dimension: "technical",
    description:
      "Can turn a requirement into a small, high-coverage set of well-written test cases using standard black-box design techniques.",
    topics: [
      { id: "test-case-design-equivalence-partitioning", name: "Equivalence Partitioning" },
      { id: "test-case-design-boundary-values", name: "Boundary Value Analysis" },
      { id: "test-case-design-decision-tables", name: "Decision Tables" },
      { id: "test-case-design-writing-cases", name: "Writing Clear Test Cases" },
    ],
  },
  {
    id: "sdlc-stlc",
    name: "SDLC & STLC",
    dimension: "technical",
    description:
      "Understands how software is built and where testing activities fit, so they can contribute at the right time in a waterfall or agile team.",
    topics: [
      { id: "sdlc-stlc-sdlc-models", name: "SDLC Phases & Models" },
      { id: "sdlc-stlc-stlc-phases", name: "STLC Phases & Deliverables" },
      { id: "sdlc-stlc-agile-testing", name: "Testing in Agile Teams" },
      { id: "sdlc-stlc-planning-traceability", name: "Test Planning, Entry/Exit Criteria & Traceability" },
    ],
  },
  {
    id: "api-testing",
    name: "API Testing",
    dimension: "technical",
    description:
      "Can send requests to a REST API with a client tool, and verify status codes, authentication behaviour and response data against the specification.",
    topics: [
      { id: "api-testing-http-methods", name: "HTTP Requests & Methods" },
      { id: "api-testing-status-codes", name: "Status Codes" },
      { id: "api-testing-auth", name: "Authentication & Headers" },
      { id: "api-testing-validation", name: "Response Validation & Chained Workflows" },
    ],
  },
  {
    id: "bug-reporting",
    name: "Bug Reporting & Triage",
    dimension: "technical",
    description:
      "Can write defect reports a developer can reproduce on the first read, classify them sensibly and follow them through to closure.",
    topics: [
      { id: "bug-reporting-report-anatomy", name: "Anatomy of a Good Bug Report" },
      { id: "bug-reporting-severity-priority", name: "Severity vs Priority" },
      { id: "bug-reporting-lifecycle", name: "Defect Life Cycle" },
      { id: "bug-reporting-triage", name: "Triage, Duplicates & Isolation" },
    ],
  },
  {
    id: "test-automation",
    name: "Test Automation Basics",
    dimension: "technical",
    description:
      "Understands what is worth automating and the core ideas behind stable browser automation: locators, waits and maintainable framework structure.",
    topics: [
      { id: "test-automation-what-to-automate", name: "What (and What Not) to Automate" },
      { id: "test-automation-locators", name: "Locators & Element Selection" },
      { id: "test-automation-waits", name: "Waits, Synchronisation & Flakiness" },
      { id: "test-automation-framework", name: "Framework Structure & CI" },
    ],
  },
];

export const questions: Question[] = [
  // ───────── manual-testing ─────────
  {
    id: "manual-testing-q1",
    skillId: "manual-testing",
    topicId: "manual-testing-fundamentals",
    prompt:
      "Your team ran 400 test cases on a release and all of them passed. A stakeholder asks whether the product is now bug-free. What is the most accurate reply?",
    options: [
      "Yes, a 100% pass rate proves there are no remaining defects",
      "No, testing can show that defects are present but cannot prove that none remain",
      "Yes, provided the test cases were reviewed by a senior tester",
      "No, because manual tests are never reliable evidence of quality",
    ],
    answer: 1,
    explanation:
      "A core testing principle is that testing shows the presence of defects, not their absence. Passing tests reduce risk but cannot prove the software is defect-free.",
  },
  {
    id: "manual-testing-q2",
    skillId: "manual-testing",
    topicId: "manual-testing-fundamentals",
    prompt:
      "The team built a loyalty-points feature exactly as written in the specification and every test passes, but customers say it does not solve the problem they actually have. Which activity failed?",
    options: [
      "Verification, because the product does not match the specification",
      "Regression testing, because old functionality was broken",
      "Validation, because the right product for the user's need was not built",
      "Unit testing, because the code was not checked by developers",
    ],
    answer: 2,
    explanation:
      "Verification asks 'did we build the product right?' (it matches the spec, which it did). Validation asks 'did we build the right product?', which is what failed here.",
  },
  {
    id: "manual-testing-q3",
    skillId: "manual-testing",
    topicId: "manual-testing-levels-types",
    prompt:
      "A new build has just been deployed to the QA environment. Before starting the full test cycle, you spend 20 minutes checking that the app launches, login works and the main pages load. What is this called?",
    options: [
      "Smoke testing",
      "Regression testing",
      "User acceptance testing",
      "Exhaustive testing",
    ],
    answer: 0,
    explanation:
      "Smoke testing is a quick, shallow check of critical functions to decide whether a build is stable enough for deeper testing.",
  },
  {
    id: "manual-testing-q4",
    skillId: "manual-testing",
    topicId: "manual-testing-levels-types",
    prompt:
      "The cart module and the payment module each pass their own tests. You now check that the order total calculated by the cart is passed correctly to the payment module. Which test level is this?",
    options: [
      "Unit testing",
      "Acceptance testing",
      "Usability testing",
      "Integration testing",
    ],
    answer: 3,
    explanation:
      "Integration testing focuses on the interfaces and data flow between components that already work individually.",
  },
  {
    id: "manual-testing-q5",
    skillId: "manual-testing",
    topicId: "manual-testing-execution",
    prompt:
      "A developer marks a login defect as Fixed. You re-run the exact steps that originally failed to confirm the fix works. What is this activity called?",
    options: [
      "Regression testing",
      "Sanity profiling",
      "Re-testing (confirmation testing)",
      "Ad hoc testing",
    ],
    answer: 2,
    explanation:
      "Re-testing, or confirmation testing, re-executes the failed test to confirm the specific defect is fixed. Regression testing instead checks that the change did not break other areas.",
  },
  {
    id: "manual-testing-q6",
    skillId: "manual-testing",
    topicId: "manual-testing-execution",
    prompt:
      "A fix was made to the discount calculation in checkout. You have limited time before release. Which regression approach is most sensible?",
    options: [
      "Re-run tests for checkout and the areas that depend on it, such as order totals, invoices and refunds",
      "Re-run only the single test case that originally failed",
      "Skip regression because the fix was only a few lines of code",
      "Re-run tests only for modules that have never had a defect",
    ],
    answer: 0,
    explanation:
      "Risk-based regression targets the changed area plus anything that depends on it. Small code changes can still have side effects in connected functionality.",
  },
  {
    id: "manual-testing-q7",
    skillId: "manual-testing",
    topicId: "manual-testing-exploratory",
    prompt:
      "You are given 60 minutes to explore a new file-upload feature with no written test cases. Which approach reflects good exploratory testing practice?",
    options: [
      "Click around randomly and report whatever breaks, without keeping notes",
      "Refuse to start until detailed test cases have been written and approved",
      "Only repeat the happy-path demo the developer showed you",
      "Set a charter for the session, test within the time box, and note what you tried, found and still want to explore",
    ],
    answer: 3,
    explanation:
      "Session-based exploratory testing uses a charter, a time box and notes so that learning, test design and execution happen together while staying accountable and repeatable.",
  },
  {
    id: "manual-testing-q8",
    skillId: "manual-testing",
    topicId: "manual-testing-exploratory",
    prompt:
      "A web form works perfectly on Chrome on your laptop, but a user reports the Submit button is hidden off-screen on Safari on an iPhone. Which type of testing would have caught this?",
    options: [
      "Load testing",
      "Compatibility (cross-browser and cross-device) testing",
      "Unit testing",
      "Security testing",
    ],
    answer: 1,
    explanation:
      "Compatibility testing checks that the application behaves correctly across different browsers, devices, operating systems and screen sizes.",
  },

  // ───────── test-case-design ─────────
  {
    id: "test-case-design-q1",
    skillId: "test-case-design",
    topicId: "test-case-design-equivalence-partitioning",
    prompt:
      "An age field accepts whole numbers from 18 to 60 inclusive. Using equivalence partitioning, which set of values covers each partition exactly once?",
    options: [
      "18, 19 and 20",
      "17, 18, 60 and 61",
      "10, 35 and 70",
      "30, 40 and 50",
    ],
    answer: 2,
    explanation:
      "There are three partitions: below 18 (invalid), 18 to 60 (valid) and above 60 (invalid). The values 10, 35 and 70 take one representative from each.",
  },
  {
    id: "test-case-design-q2",
    skillId: "test-case-design",
    topicId: "test-case-design-equivalence-partitioning",
    prompt:
      "A shipping fee depends on parcel weight: up to 1 kg, more than 1 kg up to 5 kg, and more than 5 kg up to 20 kg. Zero or negative weights and weights above 20 kg are rejected. How many equivalence partitions should you test at minimum?",
    options: ["5", "3", "4", "20"],
    answer: 0,
    explanation:
      "There are three valid partitions (the fee bands) and two invalid partitions (zero or below, and above 20 kg), giving five partitions in total.",
  },
  {
    id: "test-case-design-q3",
    skillId: "test-case-design",
    topicId: "test-case-design-boundary-values",
    prompt:
      "A password must be 8 to 16 characters long. Using two-value boundary value analysis, which password lengths should you test?",
    options: [
      "8, 12 and 16",
      "1, 8, 16 and 100",
      "0, 8, 16 and 17",
      "7, 8, 16 and 17",
    ],
    answer: 3,
    explanation:
      "Two-value BVA tests each boundary and its nearest neighbour in the adjacent partition: 7 and 8 at the lower edge, 16 and 17 at the upper edge.",
  },
  {
    id: "test-case-design-q4",
    skillId: "test-case-design",
    topicId: "test-case-design-boundary-values",
    prompt:
      "The requirement says orders of 500 or more get free delivery. A developer wrote the condition as 'total > 500'. Which test value exposes the defect?",
    options: ["499", "500", "501", "1000"],
    answer: 1,
    explanation:
      "At exactly 500 the requirement expects free delivery but 'total > 500' evaluates to false. Off-by-one errors like this sit on the boundary value itself.",
  },
  {
    id: "test-case-design-q5",
    skillId: "test-case-design",
    topicId: "test-case-design-decision-tables",
    prompt:
      "A loan rule depends on three independent yes/no conditions: salaried, credit score above 700, and existing customer. How many rules does a full decision table contain before any are merged?",
    options: ["3", "6", "8", "9"],
    answer: 2,
    explanation:
      "A full decision table has 2 to the power of n rules for n binary conditions, so three conditions give 2 x 2 x 2 = 8 combinations.",
  },
  {
    id: "test-case-design-q6",
    skillId: "test-case-design",
    topicId: "test-case-design-decision-tables",
    prompt:
      "In a decision table for a discount rule, whenever 'Account is blocked' is true the action is always 'Reject order', regardless of the other two conditions. What is the correct way to simplify the table?",
    options: [
      "Merge those rules into one and mark the other conditions as 'don't care'",
      "Delete the 'Account is blocked' condition from the table",
      "Keep only the rules where all conditions are true",
      "Replace the decision table with boundary value analysis",
    ],
    answer: 0,
    explanation:
      "When other conditions do not affect the outcome, the rules can be collapsed into one using 'don't care' entries, which reduces test cases without losing coverage of the logic.",
  },
  {
    id: "test-case-design-q7",
    skillId: "test-case-design",
    topicId: "test-case-design-writing-cases",
    prompt: "Which expected result is written well enough for another tester to judge pass or fail?",
    options: [
      "Login should work properly",
      "The system behaves as expected",
      "The user is redirected to /dashboard and the header shows 'Welcome, Asha'",
      "The page looks fine and there are no issues",
    ],
    answer: 2,
    explanation:
      "A good expected result is specific and observable, so any tester reaches the same verdict. Phrases like 'works properly' are subjective and cannot be verified.",
  },
  {
    id: "test-case-design-q8",
    skillId: "test-case-design",
    topicId: "test-case-design-writing-cases",
    prompt:
      "You wrote a test case 'Verify a user can cancel an order'. A colleague runs it and is blocked at step 1 because no order exists in their account. What was missing from the test case?",
    options: [
      "A severity rating",
      "A defect ID",
      "A longer title",
      "Preconditions and test data",
    ],
    answer: 3,
    explanation:
      "Preconditions and test data state what must be true before step 1, for example a logged-in user with one order in 'Placed' status, so the case is executable by anyone.",
  },

  // ───────── sdlc-stlc ─────────
  {
    id: "sdlc-stlc-q1",
    skillId: "sdlc-stlc",
    topicId: "sdlc-stlc-sdlc-models",
    prompt:
      "A defect caused by an ambiguous requirement is discovered only during system testing in a waterfall project. Why is it expensive to fix at this point?",
    options: [
      "Testers charge more for defects found late",
      "The design, code and tests built on that requirement all have to be reworked",
      "Waterfall projects do not allow any defects to be fixed after coding",
      "System testing tools are more costly than unit testing tools",
    ],
    answer: 1,
    explanation:
      "The later a defect is found, the more downstream work products depend on the mistake, so the cost of change rises. This is the argument for early testing and requirement reviews.",
  },
  {
    id: "sdlc-stlc-q2",
    skillId: "sdlc-stlc",
    topicId: "sdlc-stlc-sdlc-models",
    prompt: "In the V-model, acceptance test planning is paired with which development phase?",
    options: [
      "Coding",
      "Detailed (low-level) design",
      "Architecture (high-level) design",
      "Requirements analysis",
    ],
    answer: 3,
    explanation:
      "The V-model pairs each development phase with a test level: requirements with acceptance testing, system design with system testing, architecture design with integration testing, and detailed design with unit testing.",
  },
  {
    id: "sdlc-stlc-q3",
    skillId: "sdlc-stlc",
    topicId: "sdlc-stlc-stlc-phases",
    prompt: "Which sequence shows the STLC phases in the correct order?",
    options: [
      "Requirement analysis, test planning, test case development, environment setup, test execution, test closure",
      "Test planning, requirement analysis, test execution, test case development, test closure, environment setup",
      "Test case development, test planning, requirement analysis, test execution, environment setup, test closure",
      "Requirement analysis, test execution, test planning, test case development, test closure, environment setup",
    ],
    answer: 0,
    explanation:
      "STLC starts with understanding requirements, then planning, designing cases, preparing the environment, executing, and finally closing the cycle with reports and lessons learned.",
  },
  {
    id: "sdlc-stlc-q4",
    skillId: "sdlc-stlc",
    topicId: "sdlc-stlc-stlc-phases",
    prompt:
      "Testing for a release has finished. Your lead asks you to help with the test closure phase. Which task belongs to it?",
    options: [
      "Writing new test cases for the next feature",
      "Setting up the QA database and test accounts",
      "Preparing the test summary report and recording lessons learned",
      "Estimating the effort needed for test execution",
    ],
    answer: 2,
    explanation:
      "Test closure wraps up the cycle: summarising results and metrics, archiving testware and capturing lessons learned. The other tasks belong to design, environment setup and planning.",
  },
  {
    id: "sdlc-stlc-q5",
    skillId: "sdlc-stlc",
    topicId: "sdlc-stlc-agile-testing",
    prompt:
      "In a two-week Scrum sprint, when should a tester ideally start working on a user story?",
    options: [
      "After the developers have finished coding all stories in the sprint",
      "Only during the last two days, which are reserved for testing",
      "After the sprint review, once the product owner has seen the demo",
      "From backlog refinement and sprint planning, by clarifying acceptance criteria and preparing tests while development is in progress",
    ],
    answer: 3,
    explanation:
      "Agile testing is continuous. Testers get involved early to question acceptance criteria and prepare tests in parallel, so stories can meet the definition of done within the sprint.",
  },
  {
    id: "sdlc-stlc-q6",
    skillId: "sdlc-stlc",
    topicId: "sdlc-stlc-agile-testing",
    prompt:
      "A developer says a story is done because the code is merged. The team's Definition of Done says stories must be tested against acceptance criteria with no open critical defects, and testing has not started. What is the story's correct status?",
    options: [
      "Done, because the code is merged to the main branch",
      "Not done, because it has not met the team's Definition of Done",
      "Done, as long as testing is scheduled for the next sprint",
      "Done, if the product owner was present at the daily stand-up",
    ],
    answer: 1,
    explanation:
      "The Definition of Done is a shared checklist that every story must satisfy. If it includes testing and that has not happened, the story is not done regardless of code status.",
  },
  {
    id: "sdlc-stlc-q7",
    skillId: "sdlc-stlc",
    topicId: "sdlc-stlc-planning-traceability",
    prompt:
      "Midway through a project, requirement REQ-12 changes. Which artifact lets you quickly identify the test cases that need updating?",
    options: [
      "Requirements traceability matrix (RTM)",
      "Test summary report",
      "Defect density chart",
      "Test environment checklist",
    ],
    answer: 0,
    explanation:
      "An RTM maps each requirement to its test cases (and often defects), so you can see coverage and immediately find what is affected when a requirement changes.",
  },
  {
    id: "sdlc-stlc-q8",
    skillId: "sdlc-stlc",
    topicId: "sdlc-stlc-planning-traceability",
    prompt: "Which of the following is an example of an exit criterion for system testing?",
    options: [
      "The test environment is set up and accessible",
      "The build has passed the smoke test",
      "All planned test cases are executed and no critical or high severity defects remain open",
      "The test plan has been reviewed and approved",
    ],
    answer: 2,
    explanation:
      "Exit criteria define when testing can stop, such as execution coverage and open-defect thresholds. The other options are conditions that must be met before testing starts, which are entry criteria.",
  },

  // ───────── api-testing ─────────
  {
    id: "api-testing-q1",
    skillId: "api-testing",
    topicId: "api-testing-http-methods",
    prompt:
      "A user profile has name, email and phone. You need to change only the phone number without sending the rest of the profile. Which HTTP method is designed for this?",
    options: ["GET", "PATCH", "PUT", "DELETE"],
    answer: 1,
    explanation:
      "PATCH applies a partial update to a resource. PUT is meant to replace the whole resource representation, so it would require sending every field.",
  },
  {
    id: "api-testing-q2",
    skillId: "api-testing",
    topicId: "api-testing-http-methods",
    prompt:
      "Because of a network retry, the same 'POST /orders' request is sent twice and two orders are created, while repeating 'PUT /orders/42' leaves a single order in the same state. Which property does PUT have that POST does not guarantee?",
    options: ["Idempotency", "Statelessness", "Cacheability", "Encryption"],
    answer: 0,
    explanation:
      "An idempotent method produces the same server state whether it is sent once or many times. PUT, GET and DELETE are defined as idempotent; POST is not.",
  },
  {
    id: "api-testing-q3",
    skillId: "api-testing",
    topicId: "api-testing-status-codes",
    prompt:
      "You send a valid 'POST /users' request and the server successfully creates a new user. Which status code is the most appropriate response?",
    options: ["204 No Content", "200 OK with an empty body", "302 Found", "201 Created"],
    answer: 3,
    explanation:
      "201 Created signals that a new resource was created as a result of the request, usually with the new resource or its location in the response.",
  },
  {
    id: "api-testing-q4",
    skillId: "api-testing",
    topicId: "api-testing-status-codes",
    prompt:
      "You send a request with a missing required field. The API responds with 500 Internal Server Error and a stack trace. How should you treat this?",
    options: [
      "Pass, because the invalid request was rejected",
      "Pass, because 5xx is the standard range for client mistakes",
      "Report a defect: bad client input should return a 4xx error with a clear message, and the server should not crash or leak a stack trace",
      "Ignore it, because negative tests are outside the scope of API testing",
    ],
    answer: 2,
    explanation:
      "4xx codes indicate client errors such as invalid input, while 5xx means the server failed. An unhandled exception on bad input is a defect, and exposing a stack trace is also a security concern.",
  },
  {
    id: "api-testing-q5",
    skillId: "api-testing",
    topicId: "api-testing-auth",
    prompt:
      "You are logged in with a valid token as a regular user and call 'DELETE /admin/users/7', an admin-only endpoint. Which status code should a correctly built API return?",
    options: ["401 Unauthorized", "405 Method Not Allowed", "200 OK", "403 Forbidden"],
    answer: 3,
    explanation:
      "403 Forbidden means the server knows who you are but you lack permission. 401 is for missing or invalid credentials, which is not the case here.",
  },
  {
    id: "api-testing-q6",
    skillId: "api-testing",
    topicId: "api-testing-auth",
    prompt:
      "An API uses bearer tokens. In your API client, how is the token normally sent with each request?",
    options: [
      "In the request header 'Authorization: Bearer <token>'",
      "As plain text at the start of the request body",
      "In the 'Content-Type' header",
      "In the 'Accept' header",
    ],
    answer: 0,
    explanation:
      "Bearer tokens are sent in the Authorization header using the 'Bearer' scheme. Content-Type and Accept describe body formats, not credentials.",
  },
  {
    id: "api-testing-q7",
    skillId: "api-testing",
    topicId: "api-testing-validation",
    prompt:
      "'GET /products/10' returns 200 OK. Which additional check adds the most value to this test?",
    options: [
      "Confirming the request was sent from your own machine",
      "Asserting the body matches the expected schema and values, for example id equals 10 and price is a non-negative number",
      "Re-sending the same request ten times and confirming it is still 200",
      "Checking that the response contains at least one character",
    ],
    answer: 1,
    explanation:
      "A 200 status only shows the request succeeded. Verifying field presence, data types and actual values against the contract is what catches wrong or malformed data.",
  },
  {
    id: "api-testing-q8",
    skillId: "api-testing",
    topicId: "api-testing-validation",
    prompt:
      "In a Postman-style collection you create an order with POST, then need its id for the following GET and DELETE requests. What is the best practice?",
    options: [
      "Copy the id by hand into each request before every run",
      "Hard-code the id that was returned the first time you ran it",
      "Extract the id from the POST response in a script, store it in a variable and reference the variable in later requests",
      "Skip the GET and DELETE requests because they depend on other requests",
    ],
    answer: 2,
    explanation:
      "Chaining requests through variables makes the workflow repeatable and runnable unattended, since ids change on every run and hard-coded values quickly go stale.",
  },

  // ───────── bug-reporting ─────────
  {
    id: "bug-reporting-q1",
    skillId: "bug-reporting",
    topicId: "bug-reporting-report-anatomy",
    prompt: "Which bug title is the most useful to a developer scanning the defect list?",
    options: [
      "Checkout is broken!!",
      "Bug in payment page, please fix urgently",
      "Coupon not working",
      "Checkout: applying coupon SAVE10 twice makes the order total negative",
    ],
    answer: 3,
    explanation:
      "A good title states where, what action and what went wrong, so the issue is understandable and searchable without opening the report.",
  },
  {
    id: "bug-reporting-q2",
    skillId: "bug-reporting",
    topicId: "bug-reporting-report-anatomy",
    prompt:
      "A developer returns your bug with the comment 'Cannot reproduce'. Your report contains a title and one screenshot. What should you add first to make it actionable?",
    options: [
      "A higher priority so the developer takes it more seriously",
      "Numbered steps to reproduce with the test data used, environment and build details, and expected versus actual results",
      "A note that the bug definitely exists because you saw it",
      "A suggestion for which line of code should be changed",
    ],
    answer: 1,
    explanation:
      "Reproducibility depends on exact steps, data and environment, and the expected versus actual result makes clear why it is a defect. Raising priority does not help anyone reproduce it.",
  },
  {
    id: "bug-reporting-q3",
    skillId: "bug-reporting",
    topicId: "bug-reporting-severity-priority",
    prompt:
      "The company name is misspelled in the large banner on the home page the day before a public launch. How would this defect typically be classified?",
    options: [
      "Low severity, high priority",
      "High severity, low priority",
      "High severity, high priority",
      "Low severity, low priority",
    ],
    answer: 0,
    explanation:
      "Severity measures technical impact, which is low because nothing is functionally broken. Priority measures urgency to fix, which is high because of the visible brand damage at launch.",
  },
  {
    id: "bug-reporting-q4",
    skillId: "bug-reporting",
    topicId: "bug-reporting-severity-priority",
    prompt:
      "The app crashes when a user exports a yearly report from a legacy screen used by one internal admin about once a year. A workaround exists. How would this typically be classified?",
    options: [
      "Low severity, high priority",
      "Low severity, low priority",
      "High severity, low priority",
      "High severity, high priority",
    ],
    answer: 2,
    explanation:
      "A crash is a high-severity failure, but because it is rarely triggered, affects one user and has a workaround, the business urgency and therefore priority is low.",
  },
  {
    id: "bug-reporting-q5",
    skillId: "bug-reporting",
    topicId: "bug-reporting-lifecycle",
    prompt:
      "A defect is marked Fixed and deployed to QA. You re-test and the same failure still occurs. What should you do with the defect?",
    options: [
      "Close it, because the developer has already marked it as fixed",
      "Log a brand-new defect and leave the old one as Fixed",
      "Change its status to Deferred",
      "Reopen it with the build number and fresh evidence of the failure",
    ],
    answer: 3,
    explanation:
      "When a fix fails verification the defect is reopened so its history stays in one place. Adding the build and new evidence shows the developer exactly what was re-tested.",
  },
  {
    id: "bug-reporting-q6",
    skillId: "bug-reporting",
    topicId: "bug-reporting-lifecycle",
    prompt:
      "In triage, the team agrees a defect is valid but decides to fix it in a later release because of the low impact and a tight deadline. Which status fits?",
    options: ["Rejected", "Deferred", "Duplicate", "Closed"],
    answer: 1,
    explanation:
      "Deferred means the defect is accepted as genuine but the fix is postponed to a future release. Rejected would mean it is not considered a defect at all.",
  },
  {
    id: "bug-reporting-q7",
    skillId: "bug-reporting",
    topicId: "bug-reporting-triage",
    prompt:
      "You have found what looks like a new defect in the search feature. What should you do before logging it?",
    options: [
      "Search the defect tracker for an existing report of the same issue",
      "Log it immediately so that your defect count goes up",
      "Wait until the end of the sprint and report all defects together",
      "Tell the developer verbally and skip the tracker",
    ],
    answer: 0,
    explanation:
      "Checking for duplicates first avoids wasted triage effort. If a report already exists, adding your new details to it is more useful than creating a second ticket.",
  },
  {
    id: "bug-reporting-q8",
    skillId: "bug-reporting",
    topicId: "bug-reporting-triage",
    prompt:
      "A page fails to save only sometimes. Before reporting, which action best helps isolate the defect?",
    options: [
      "Report it as 'random failure' and let the developer investigate",
      "Wait to see whether users complain in production",
      "Vary one factor at a time, such as browser, account, input data and network, and record how often it fails under each condition",
      "Mark it as not reproducible because it does not happen every time",
    ],
    answer: 2,
    explanation:
      "Changing one variable at a time narrows down the trigger, and recording the reproduction rate (for example 3 out of 10 attempts) gives developers a concrete starting point for intermittent issues.",
  },

  // ───────── test-automation ─────────
  {
    id: "test-automation-q1",
    skillId: "test-automation",
    topicId: "test-automation-what-to-automate",
    prompt: "Which of these is the best candidate for UI test automation?",
    options: [
      "A one-time check of a promotional banner that will be removed next week",
      "A stable login and checkout regression suite that is run on every build",
      "Judging whether a new page layout feels visually pleasing",
      "A feature whose screens are still being redesigned every few days",
    ],
    answer: 1,
    explanation:
      "Automation pays off for stable, repetitive, high-value checks. One-off tests, subjective judgements and rapidly changing UIs cost more to automate and maintain than they return.",
  },
  {
    id: "test-automation-q2",
    skillId: "test-automation",
    topicId: "test-automation-what-to-automate",
    prompt:
      "According to the test automation pyramid, how should a team distribute its automated tests?",
    options: [
      "Mostly end-to-end UI tests, with a few unit tests",
      "Equal numbers of tests at every level",
      "Only UI tests, because they are closest to what the user sees",
      "Many fast unit tests at the base, fewer API or integration tests in the middle, and a small number of end-to-end UI tests at the top",
    ],
    answer: 3,
    explanation:
      "Lower-level tests are faster, cheaper and more stable, so they should form the bulk of the suite. UI tests are slow and brittle and are kept for a few critical user journeys.",
  },
  {
    id: "test-automation-q3",
    skillId: "test-automation",
    topicId: "test-automation-locators",
    prompt: "You need to locate the Login button in an automated test. Which locator is the most robust?",
    options: [
      "A dedicated test attribute such as data-testid='login-button'",
      "An absolute XPath like /html/body/div[2]/div/form/div[3]/button",
      "An auto-generated CSS class such as .css-1x9k2f",
      "The button's pixel coordinates on the screen",
    ],
    answer: 0,
    explanation:
      "Dedicated test ids or unique stable ids do not change when layout or styling changes. Absolute XPaths, generated class names and coordinates break with minor UI changes.",
  },
  {
    id: "test-automation-q4",
    skillId: "test-automation",
    topicId: "test-automation-locators",
    prompt:
      "Your test breaks every time a developer adds a wrapper div to the page, even though the target button itself has not changed. What is the most likely cause?",
    options: [
      "The browser driver is out of date",
      "The assertion library has a defect",
      "The locator depends on the page structure, such as an absolute XPath or an index-based path",
      "The test is running in headless mode",
    ],
    answer: 2,
    explanation:
      "Structure-dependent locators encode the element's position in the DOM, so any layout change invalidates them. Locating by a stable attribute, role or label avoids this.",
  },
  {
    id: "test-automation-q5",
    skillId: "test-automation",
    topicId: "test-automation-waits",
    prompt:
      "A test clicks Search and immediately reads the results list. It passes on your laptop but fails intermittently on the slower CI server. What is the best fix?",
    options: [
      "Add a fixed 10-second sleep after every click in the suite",
      "Configure the CI job to re-run the test until it passes",
      "Delete the test because flaky tests cannot be fixed",
      "Wait explicitly for the results list to become visible before reading it",
    ],
    answer: 3,
    explanation:
      "An explicit, condition-based wait proceeds as soon as the element is ready and only fails at the timeout. Fixed sleeps are either too short or waste time, and retries hide the real synchronisation problem.",
  },
  {
    id: "test-automation-q6",
    skillId: "test-automation",
    topicId: "test-automation-waits",
    prompt:
      "What is the difference between an implicit wait and an explicit wait in Selenium-style tools?",
    options: [
      "An implicit wait always pauses for its full duration, while an explicit wait never pauses",
      "An implicit wait is a global timeout applied to every element lookup, while an explicit wait polls for a specific condition on a specific element",
      "An implicit wait works only for alerts, while an explicit wait works only for page loads",
      "There is no difference; they are two names for the same setting",
    ],
    answer: 1,
    explanation:
      "An implicit wait sets one timeout for all element searches. An explicit wait targets a particular condition such as visible or clickable, which makes it more precise for dynamic pages.",
  },
  {
    id: "test-automation-q7",
    skillId: "test-automation",
    topicId: "test-automation-framework",
    prompt:
      "The id of the Login button changes and 40 test scripts fail. With a well-applied Page Object Model, how many places should need updating?",
    options: [
      "One: the locator inside the login page object",
      "Forty: once in each failing test script",
      "None: page objects detect locator changes and repair themselves",
      "Two: the test data file and the report template",
    ],
    answer: 0,
    explanation:
      "The Page Object Model keeps each page's locators and actions in one class, so tests call methods like login() and a UI change is fixed in a single place.",
  },
  {
    id: "test-automation-q8",
    skillId: "test-automation",
    topicId: "test-automation-framework",
    prompt:
      "The same login test needs to run for 20 different username and password combinations. Which approach is best?",
    options: [
      "Copy the test script 20 times and edit the values in each copy",
      "Run the test manually for the remaining 19 combinations",
      "Keep the combinations in an external data source and run one parameterised test over them (data-driven testing)",
      "Put all 20 combinations into one long test with 20 hard-coded blocks of steps",
    ],
    answer: 2,
    explanation:
      "Data-driven testing separates test logic from test data, so adding a new combination means adding a data row rather than duplicating code.",
  },
];

export const plans: SkillPlan[] = [
  {
    skillId: "manual-testing",
    days: [
      {
        topicId: "manual-testing-fundamentals",
        title: "Why we test: principles and vocabulary",
        minutes: 60,
        summary: "Build the mental model and vocabulary every other testing skill rests on.",
        learn: [
          "The seven testing principles, especially 'testing shows presence of defects' and 'exhaustive testing is impossible'",
          "Error vs defect vs failure, and how one leads to the next",
          "Verification vs validation with one example of each",
          "Quality assurance vs quality control vs testing",
        ],
        practice:
          "Pick an app you use daily and write down three realistic failures it could have; for each, describe the likely human error, the defect in the product and the failure a user would see.",
      },
      {
        topicId: "manual-testing-levels-types",
        title: "Test levels and test types",
        minutes: 75,
        summary: "Learn which kind of testing answers which question, and when each is used.",
        learn: [
          "Test levels: unit, integration, system and acceptance, and who usually owns each",
          "Functional vs non-functional testing with examples",
          "Smoke vs sanity vs regression testing and when each is run",
          "Black-box vs white-box testing at a conceptual level",
        ],
        practice:
          "For a food-delivery app, list two concrete checks for each of: smoke, integration, system, acceptance, usability and performance testing, and note who would run each.",
      },
      {
        topicId: "manual-testing-execution",
        title: "Executing tests, re-testing and regression",
        minutes: 90,
        summary: "Practise running tests carefully and deciding what to re-run after a change.",
        learn: [
          "Recording execution results: pass, fail, blocked, not run, with evidence",
          "Re-testing (confirmation) vs regression testing",
          "Choosing a regression scope based on risk and what the change touches",
          "Keeping test data and environment notes so runs are repeatable",
        ],
        practice:
          "Write 10 test steps for a public demo site's login and registration, execute them in a spreadsheet with status and evidence columns, then imagine the password rule changed and mark which cases you would re-run and why.",
      },
      {
        topicId: "manual-testing-exploratory",
        title: "Exploratory and non-functional checks",
        minutes: 90,
        summary: "Learn to test without a script and to look beyond pure functionality.",
        learn: [
          "Session-based exploratory testing: charter, time box, notes and debrief",
          "Common heuristics: boundaries, interruptions, invalid data, back button, double submit",
          "Basic usability and accessibility observations a tester can make",
          "Cross-browser and cross-device compatibility checks",
        ],
        practice:
          "Run a 45-minute exploratory session on the search and filter feature of any shopping site using a written charter; keep timestamped notes and end with a list of issues, questions and unexplored areas.",
      },
      {
        topicId: null,
        title: "Challenge: test a feature end to end",
        minutes: 120,
        summary: "Apply smoke, scripted, exploratory and compatibility testing to one real feature.",
        learn: [
          "How to split limited time between smoke, scripted and exploratory testing",
          "Summarising test results so a lead can make a release decision",
          "Communicating risks and untested areas honestly",
        ],
        practice:
          "Choose the sign-up flow of a public demo web app: run a 5-check smoke test, execute 12 scripted cases, do one 30-minute exploratory session, repeat the key path on a second browser or a phone, and write a one-page test summary with results, issues found and remaining risks.",
      },
    ],
  },
  {
    skillId: "test-case-design",
    days: [
      {
        topicId: "test-case-design-equivalence-partitioning",
        title: "Equivalence partitioning",
        minutes: 60,
        summary: "Reduce endless input values to a few representative classes.",
        learn: [
          "What an equivalence partition is and why one value per partition is enough",
          "Identifying valid and invalid partitions for numbers, text and lists",
          "Partitions on outputs and not just inputs",
          "Testing one invalid partition at a time so failures are not masked",
        ],
        practice:
          "For a registration form with age (18 to 60), username (5 to 15 letters or digits) and country (a fixed list), list every valid and invalid partition and choose one test value for each.",
      },
      {
        topicId: "test-case-design-boundary-values",
        title: "Boundary value analysis",
        minutes: 60,
        summary: "Target the edges of each partition, where off-by-one defects live.",
        learn: [
          "Why defects cluster at boundaries (wrong comparison operators, off-by-one errors)",
          "Two-value vs three-value boundary analysis",
          "Boundaries for lengths, dates, amounts and counts",
          "Combining partitions and boundaries into one compact test set",
        ],
        practice:
          "Take yesterday's form and derive two-value boundary tests for each field; then write the specific values that would catch a developer using '>' instead of '>=' on each limit.",
      },
      {
        topicId: "test-case-design-decision-tables",
        title: "Decision tables",
        minutes: 75,
        summary: "Test business rules that depend on combinations of conditions.",
        learn: [
          "Conditions, actions and rules, and the 2-to-the-power-n size of a full table",
          "Building a table step by step from a written business rule",
          "Collapsing rules with 'don't care' entries",
          "Spotting missing or contradictory rules in a requirement",
        ],
        practice:
          "Build a decision table for this rule: members get 10% off, orders above 1000 get free shipping, and a coupon cannot be combined with the member discount. Collapse it and write one test case per remaining rule.",
      },
      {
        topicId: "test-case-design-writing-cases",
        title: "Writing clear, executable test cases",
        minutes: 90,
        summary: "Write cases that anyone on the team can run and judge the same way.",
        learn: [
          "Parts of a test case: id, title, preconditions, test data, steps, expected result",
          "Writing specific, observable expected results",
          "Positive, negative and edge cases for the same requirement",
          "Keeping cases independent, atomic and traceable to a requirement",
        ],
        practice:
          "Write 8 test cases for a 'forgot password' feature in a spreadsheet using a standard template, then give two of them to a friend and fix anything they could not execute without asking you a question.",
      },
      {
        topicId: null,
        title: "Challenge: design a test suite from a requirement",
        minutes: 120,
        summary: "Combine all three techniques to produce a lean, high-coverage suite.",
        learn: [
          "Choosing the right technique for each part of a requirement",
          "Removing redundant cases while keeping coverage",
          "Reviewing your own suite against the requirement line by line",
        ],
        practice:
          "For a money-transfer screen (amount 1 to 100,000, daily limit 200,000, beneficiary must be verified, OTP required above 10,000), list partitions and boundaries, build a decision table for the rules, and write a final suite of no more than 20 well-formed test cases with a short note on what each technique contributed.",
      },
    ],
  },
  {
    skillId: "sdlc-stlc",
    days: [
      {
        topicId: "sdlc-stlc-sdlc-models",
        title: "SDLC phases and models",
        minutes: 60,
        summary: "Understand how software moves from idea to production in different models.",
        learn: [
          "SDLC phases: requirements, design, implementation, testing, deployment, maintenance",
          "Waterfall, V-model, iterative and agile models and when each fits",
          "How the V-model pairs each development phase with a test level",
          "Why the cost of fixing a defect rises the later it is found",
        ],
        practice:
          "Draw the V-model from memory and label each pair; then write a short paragraph on which model you would choose for a banking core system vs a startup's mobile app, and why.",
      },
      {
        topicId: "sdlc-stlc-stlc-phases",
        title: "STLC phases and deliverables",
        minutes: 60,
        summary: "Learn what testers produce at each stage of a test cycle.",
        learn: [
          "STLC phases in order, from requirement analysis to test closure",
          "Deliverables of each phase: RTM, test plan, test cases, environment checklist, execution report, closure report",
          "Static testing: reviewing requirements before any code exists",
          "How STLC runs inside or alongside the SDLC",
        ],
        practice:
          "Create a one-page table with a row for each STLC phase and columns for activities, deliverables and who is involved, using a simple 'online exam portal' project as the example.",
      },
      {
        topicId: "sdlc-stlc-agile-testing",
        title: "Testing in agile teams",
        minutes: 75,
        summary: "See how testing becomes a continuous, whole-team activity in Scrum.",
        learn: [
          "Scrum events and where a tester contributes in each",
          "User stories, acceptance criteria and the Definition of Done",
          "Shift-left testing and testing in parallel with development",
          "Regression risk in short sprints and why automation matters",
        ],
        practice:
          "Take the user story 'As a customer I can save items to a wishlist' and write 5 acceptance criteria, 3 questions you would raise in refinement, and a day-by-day outline of your testing activities across a two-week sprint.",
      },
      {
        topicId: "sdlc-stlc-planning-traceability",
        title: "Test planning, entry/exit criteria and traceability",
        minutes: 90,
        summary: "Learn how teams decide what to test, when to start and when to stop.",
        learn: [
          "Key sections of a test plan: scope, approach, resources, schedule, risks",
          "Entry and exit criteria with realistic examples",
          "Building and using a requirements traceability matrix",
          "Basic metrics: execution progress, pass rate, open defects by severity",
        ],
        practice:
          "For five requirements of a library-management app, build an RTM in a spreadsheet mapping each requirement to at least two test case ids, then write entry and exit criteria for its system test cycle.",
      },
      {
        topicId: null,
        title: "Challenge: plan the testing of a small project",
        minutes: 120,
        summary: "Produce a lightweight but complete test plan for a realistic project.",
        learn: [
          "Fitting the test approach to the chosen development model",
          "Identifying product risks and using them to set test priorities",
          "Presenting a plan concisely to a non-technical stakeholder",
        ],
        practice:
          "For a 'college event registration' web app built in three two-week sprints, write a two-page test plan covering scope, test levels and types per sprint, entry/exit criteria, a 10-row RTM, top five risks, and the contents of your closure report.",
      },
    ],
  },
  {
    skillId: "api-testing",
    days: [
      {
        topicId: "api-testing-http-methods",
        title: "HTTP requests and methods",
        minutes: 75,
        summary: "Understand what travels between client and server and what each method means.",
        learn: [
          "Anatomy of a request and response: URL, method, headers, body, status line",
          "GET, POST, PUT, PATCH and DELETE, and mapping them to CRUD operations",
          "Safe and idempotent methods and why they matter for retries",
          "Path parameters vs query parameters vs JSON request bodies",
        ],
        practice:
          "Install an API client such as Postman and, against any free public practice REST API, send one request for each of GET, POST, PUT, PATCH and DELETE; save them in a collection and note the method, URL, body and response for each.",
      },
      {
        topicId: "api-testing-status-codes",
        title: "Status codes",
        minutes: 60,
        summary: "Read status codes fluently and know what each family tells you.",
        learn: [
          "The 2xx, 3xx, 4xx and 5xx families and who is 'at fault' in each",
          "Common codes: 200, 201, 204, 400, 401, 403, 404, 409, 429, 500, 503",
          "Why a 500 on invalid input is a defect",
          "Checking that error responses carry a useful message without leaking internals",
        ],
        practice:
          "Using your practice API, deliberately trigger at least five different status codes (for example a missing resource, a malformed body and a successful create) and record the request that caused each one.",
      },
      {
        topicId: "api-testing-auth",
        title: "Authentication and headers",
        minutes: 75,
        summary: "Test that an API lets the right people in and keeps everyone else out.",
        learn: [
          "Authentication vs authorisation, and 401 vs 403",
          "API keys, basic auth and bearer tokens, and the Authorization header",
          "Content-Type and Accept headers",
          "Negative auth tests: no token, expired token, malformed token, wrong role",
        ],
        practice:
          "With a practice API that offers a login endpoint, obtain a token, call a protected endpoint successfully, then repeat the call with no token, a malformed token and a modified token, recording the status and body each time.",
      },
      {
        topicId: "api-testing-validation",
        title: "Response validation and chained workflows",
        minutes: 90,
        summary: "Move from sending requests to writing repeatable checks.",
        learn: [
          "Asserting status, response time, headers, field presence, data types and values",
          "Schema validation at a conceptual level",
          "Environment and collection variables, and extracting values from responses",
          "Negative and boundary tests for request fields",
        ],
        practice:
          "In your API client, build a chained flow of create, read, update, delete for one resource, passing the created id through a variable, and add at least three assertions to every request; run the whole collection in one go.",
      },
      {
        topicId: null,
        title: "Challenge: test a CRUD API end to end",
        minutes: 120,
        summary: "Deliver a small, runnable API test collection with a findings report.",
        learn: [
          "Organising a collection into folders for positive, negative and auth tests",
          "Deriving API test cases from endpoint documentation",
          "Reporting an API defect with the exact request and response",
        ],
        practice:
          "Pick a public practice API with authentication and build a collection of at least 15 requests covering the happy-path CRUD flow, invalid inputs, missing and invalid tokens, and non-existent ids, each with assertions; run it with the collection runner and write a short report listing pass/fail counts and any behaviour that contradicts the documentation.",
      },
    ],
  },
  {
    skillId: "bug-reporting",
    days: [
      {
        topicId: "bug-reporting-report-anatomy",
        title: "Anatomy of a good bug report",
        minutes: 60,
        summary: "Write reports a developer can reproduce on the first read.",
        learn: [
          "Essential fields: title, environment, build, preconditions, steps, expected, actual, evidence",
          "Writing titles in a 'where, what action, what went wrong' pattern",
          "One defect per report, with neutral and factual language",
          "Useful attachments: screenshots, screen recordings, console and network logs",
        ],
        practice:
          "Find three real issues in any website or app (broken links, validation gaps and layout problems all count) and write a complete report for each using a standard template.",
      },
      {
        topicId: "bug-reporting-severity-priority",
        title: "Severity vs priority",
        minutes: 45,
        summary: "Classify defects by impact and urgency without mixing the two up.",
        learn: [
          "Severity as technical impact, priority as business urgency",
          "Typical severity scales: critical, major, minor, trivial",
          "Examples for all four high/low severity and priority combinations",
          "Who usually sets each value and how disagreements are resolved",
        ],
        practice:
          "Write 10 short defect descriptions for an e-commerce app, assign severity and priority to each with a one-line justification, and make sure all four high/low combinations appear at least once.",
      },
      {
        topicId: "bug-reporting-lifecycle",
        title: "Defect life cycle",
        minutes: 60,
        summary: "Follow a defect from discovery to closure and know your role at each status.",
        learn: [
          "Standard statuses: New, Assigned, Open, Fixed, Retest, Verified, Closed, Reopened",
          "Alternative outcomes: Rejected, Duplicate, Deferred, Not reproducible",
          "What a tester does when a fix fails or a defect is rejected",
          "Basic workflow in a tracker such as Jira: fields, comments, links",
        ],
        practice:
          "Draw the defect life cycle as a flow diagram including the alternative outcomes, then take one of your Day 1 reports and write the comments you would add at the Retest, Reopened and Closed stages.",
      },
      {
        topicId: "bug-reporting-triage",
        title: "Triage, duplicates and isolation",
        minutes: 75,
        summary: "Make every report count by isolating the cause and supporting triage.",
        learn: [
          "What happens in a triage meeting and what information it needs",
          "Searching for duplicates and enriching an existing report",
          "Isolating a defect by changing one variable at a time",
          "Reporting intermittent defects with reproduction rates and logs",
        ],
        practice:
          "Take one defect you found earlier and try to reproduce it across two browsers, two accounts and two sets of input data; update the report with a table showing where it does and does not occur.",
      },
      {
        topicId: null,
        title: "Challenge: a triage-ready bug bash",
        minutes: 120,
        summary: "Find, isolate, classify and report defects as you would on the job.",
        learn: [
          "Balancing time between finding new defects and documenting them well",
          "Presenting defects in a short triage summary",
          "Reviewing your own reports from the developer's point of view",
        ],
        practice:
          "Spend 60 minutes testing a public demo application built for testing practice, log at least six defects in a free tracker or a spreadsheet with full reports, severity and priority, then write a half-page triage summary recommending which three to fix first and why.",
      },
    ],
  },
  {
    skillId: "test-automation",
    days: [
      {
        topicId: "test-automation-what-to-automate",
        title: "What (and what not) to automate",
        minutes: 60,
        summary: "Learn to judge where automation pays off before writing any code.",
        learn: [
          "Benefits and costs of automation, including ongoing maintenance",
          "Good candidates: stable, repetitive, high-risk, data-heavy checks",
          "Poor candidates: one-off tests, unstable UIs, subjective look-and-feel",
          "The test automation pyramid: unit, API/integration and UI layers",
        ],
        practice:
          "Take 15 manual test cases for a login and checkout flow, mark each as automate now, automate later or keep manual with a one-line reason, and sketch which pyramid layer each automated check belongs to.",
      },
      {
        topicId: "test-automation-locators",
        title: "Locators and element selection",
        minutes: 90,
        summary: "Find elements in a way that survives UI changes.",
        learn: [
          "Basic HTML and DOM structure, and using browser developer tools to inspect elements",
          "Locator strategies: id, name, CSS selector, XPath, text, role and test ids",
          "Relative vs absolute XPath and why absolute paths are brittle",
          "A sensible preference order for choosing locators",
        ],
        practice:
          "Open a public demo login page in your browser's developer tools and write two different locators (one CSS, one XPath) for each of five elements, verifying each in the console or elements search, then rank them by robustness.",
      },
      {
        topicId: "test-automation-waits",
        title: "Waits, synchronisation and flakiness",
        minutes: 90,
        summary: "Make tests wait for the application instead of guessing.",
        learn: [
          "Why tests fail on dynamic pages: the script is faster than the UI",
          "Fixed sleeps vs implicit waits vs explicit, condition-based waits",
          "Auto-waiting in modern tools such as Playwright",
          "Common causes of flaky tests: timing, shared test data, test order dependence",
        ],
        practice:
          "Install Selenium or Playwright in a language you know, write a script that logs in to a demo site and asserts a message that appears after a delay; first make it fail without a wait, then fix it with an explicit or built-in wait and no fixed sleep.",
      },
      {
        topicId: "test-automation-framework",
        title: "Framework structure and CI",
        minutes: 105,
        summary: "Organise tests so they stay maintainable as the suite grows.",
        learn: [
          "Page Object Model: keeping locators and page actions in one place",
          "Data-driven tests and separating test data from test logic",
          "Test runner basics: setup and teardown, assertions, reports",
          "Running tests automatically on every change in a CI pipeline",
        ],
        practice:
          "Refactor yesterday's script into a login page object plus a test file, then parameterise the test to run with three sets of credentials (one valid, two invalid) using your test runner's data-driven feature.",
      },
      {
        topicId: null,
        title: "Challenge: a small, stable UI test suite",
        minutes: 120,
        summary: "Build a mini framework that shows you can automate responsibly.",
        learn: [
          "Choosing which five checks deserve automation for a given app",
          "Making tests independent so they pass in any order",
          "Reading a failure report and telling a product defect from a test defect",
        ],
        practice:
          "For a public demo shopping site, automate five tests (valid login, invalid login, add to cart, remove from cart, checkout validation) using page objects, robust locators and no fixed sleeps; run the suite three times in a row to prove it is stable and write a short README-style note in your submission describing structure and how to run it.",
      },
    ],
  },
];
