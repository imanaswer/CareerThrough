import type { InterviewPrompt } from "../taxonomy";

export const prompts: InterviewPrompt[] = [
  // ── SQL ────────────────────────────────────────────────────────
  {
    id: "sql-int-1",
    kind: "technical",
    skillId: "sql",
    depth: 2,
    prompt:
      "A colleague who only works in spreadsheets asks why the data isn't just kept in one big table, and what a JOIN actually does. Explain it to them using customers and orders.",
    lookFor: [
      "Names at least one join type (INNER or LEFT) and says what happens to rows with no match",
      "Uses a concrete key relationship such as orders.customer_id = customers.id",
      "Gives a reason for separate tables: no duplicated customer data, one place to update it",
      "Says a LEFT JOIN keeps unmatched left rows and fills the right side with NULLs",
    ],
    followUp: "What would change in the result if you switched that INNER JOIN to a LEFT JOIN?",
    minWords: 60,
  },
  {
    id: "sql-int-2",
    kind: "technical",
    skillId: "sql",
    depth: 3,
    context:
      "A 'paid orders per customer' report is wrong: customers with zero paid orders vanished from it, and some counts look too high.\n\nSELECT c.name, COUNT(*) AS paid_orders\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.status = 'paid'\nGROUP BY c.name;",
    prompt:
      "Walk through what you would check in this query and what you would change. There is more than one thing wrong.",
    lookFor: [
      "Spots that WHERE o.status filters out the NULL rows, so the LEFT JOIN behaves like an INNER JOIN",
      "Moves the status condition into the ON clause (or checks o.id IS NULL) to keep zero-order customers",
      "Notes COUNT(*) counts joined rows, and suggests COUNT(o.id) so non-matches count as 0",
      "Flags GROUP BY c.name merging two different customers who share a name, and groups by c.id instead",
    ],
    followUp: "If this report also runs slowly over a million-row orders table, what would you look at first?",
    minWords: 80,
  },

  // ── Python for Data ────────────────────────────────────────────
  {
    id: "python-int-1",
    kind: "technical",
    skillId: "python",
    depth: 2,
    prompt:
      "Explain to a teammate who has only used Excel what a pandas groupby does, and walk through how you would get the average order value per city from a raw orders table.",
    lookFor: [
      "Describes split-apply-combine: rows grouped by a column, an aggregate computed per group",
      "Names a concrete call such as df.groupby('city')['amount'].mean()",
      "Maps it to the spreadsheet equivalent, e.g. a PivotTable",
      "Says what the result looks like: one row per city, city as the index or a column",
    ],
    followUp: "How would you get both the mean and the order count in the same result?",
    minWords: 60,
  },
  {
    id: "python-int-2",
    kind: "technical",
    skillId: "python",
    depth: 3,
    context:
      "A teammate's script takes about four minutes on a 500,000-row DataFrame:\n\nfor i in range(len(df)):\n    df.loc[i, 'total'] = df.loc[i, 'price'] * df.loc[i, 'qty']",
    prompt:
      "Explain why this is slow and how you would rewrite it, then say when a row-by-row loop would still be a reasonable choice.",
    lookFor: [
      "Gives the vectorised rewrite: df['total'] = df['price'] * df['qty']",
      "Explains the per-row .loc lookup repeats Python-level overhead instead of one bulk NumPy/C operation",
      "Mentions .apply as a middle ground and that it is still effectively row-by-row",
      "Names a case where a loop is fine: tiny data, a one-off script, or logic that cannot be vectorised",
    ],
    followUp: "What could go wrong with the vectorised version if price is stored as text or has missing values?",
    minWords: 80,
  },

  // ── Excel & Spreadsheets ───────────────────────────────────────
  {
    id: "excel-int-1",
    kind: "technical",
    skillId: "excel",
    depth: 2,
    prompt:
      "Walk me through how you would turn a raw sales export into a monthly summary, and explain to a non-technical manager why you would reach for a PivotTable rather than typing formulas row by row.",
    lookFor: [
      "Checks the raw data first: one row per record, consistent headers, real dates rather than text",
      "Names PivotTable rows, columns and values and says what goes in each",
      "Gives a reason a PivotTable wins: refreshes, no formula drift, regroup without rewriting",
      "Mentions a formula alternative such as SUMIFS and when that is the better fit",
    ],
    followUp: "New rows arrive every month. How would you set it up so the summary updates without rebuilding it?",
    minWords: 60,
  },
  {
    id: "excel-int-2",
    kind: "technical",
    skillId: "excel",
    depth: 3,
    context:
      "A shared workbook has this lookup in column F, copied down 2,000 rows:\n\n=VLOOKUP(A2, Sheet2!A2:C500, 3, TRUE)\n\nSome rows now return the wrong price and others return #N/A. A longer product list was pasted into Sheet2 last week.",
    prompt:
      "Name the likely causes and the order you would check them in, then say how you would rebuild the formula so it stops breaking.",
    lookFor: [
      "Flags TRUE (approximate match) as wrong for a product lookup and switches to FALSE or 0",
      "Notes the relative range A2:C500 shifts as the formula is copied down, and locks it as $A$2:$C$500 or a table reference",
      "Points out the pasted list may run past row 500, so later products fall outside the range",
      "Suggests a sturdier rebuild: XLOOKUP or INDEX/MATCH, a named table, and IFNA/IFERROR around it",
    ],
    followUp: "How would you check quickly whether an #N/A row is a genuinely missing product or a formatting mismatch?",
    minWords: 80,
  },

  // ── Statistics ─────────────────────────────────────────────────
  {
    id: "statistics-int-1",
    kind: "technical",
    skillId: "statistics",
    depth: 2,
    prompt:
      "A product manager sees a higher conversion rate on the new signup page and wants to ship it today. Explain to them what the p-value from your test does and does not tell you.",
    lookFor: [
      "Defines the p-value as the chance of a result this extreme if there were really no difference",
      "States plainly that it is not the probability the new page is better, and not the size of the effect",
      "Brings in sample size or a confidence interval as what shows how precise the estimate is",
      "Separates statistical significance from practical or business significance",
    ],
    followUp: "If the p-value came out at 0.20, would you conclude the two pages perform the same? Why or why not?",
    minWords: 60,
  },
  {
    id: "statistics-int-2",
    kind: "technical",
    skillId: "statistics",
    depth: 3,
    context:
      "An intern reports: \"Users who open our app on day one renew at 62%; users who don't renew at 24%. So pushing everyone to open the app on day one will lift renewals by 38 points.\"",
    prompt:
      "Explain what is wrong with that conclusion, and describe what evidence would actually support the recommendation.",
    lookFor: [
      "Names correlation versus causation explicitly",
      "Offers a plausible confounder or reverse-causation story, e.g. already-keen users open the app anyway",
      "Proposes a randomised A/B test with the day-one nudge as the treatment",
      "Mentions selection bias, or that the two groups are not comparable to begin with",
    ],
    followUp: "If a randomised test isn't possible here, what weaker evidence would still move you?",
    minWords: 80,
  },

  // ── Data Visualization ─────────────────────────────────────────
  {
    id: "data-viz-int-1",
    kind: "technical",
    skillId: "data-viz",
    depth: 2,
    prompt:
      "You have two years of monthly revenue across five product lines and need one chart for a leadership slide. Walk me through how you choose the chart type and what you deliberately leave out.",
    lookFor: [
      "Starts from the question or message the chart must answer, not from a chart type",
      "Names a specific chart and justifies it, e.g. a line chart for trend over time rather than stacked bars",
      "Cuts clutter: fewer series, direct labels, no 3D or heavy gridlines",
      "Considers audience and viewing context: readable from a slide, one clear takeaway",
    ],
    followUp: "What would you change if the same data were going on an always-on dashboard instead?",
    minWords: 60,
  },
  {
    id: "data-viz-int-2",
    kind: "technical",
    skillId: "data-viz",
    depth: 3,
    context:
      "A dashboard tile shows NPS by region as a bar chart. The y-axis runs from 40 to 48, each of the five bars is a different bright colour, and the tile is titled just 'NPS'. A regional manager screenshots it claiming their region is 'twice as good' as another.",
    prompt:
      "Explain which design choices produced that misreading, and say where you would push back versus where a zoomed axis is defensible.",
    lookFor: [
      "Identifies the truncated y-axis as exaggerating small differences",
      "Explains bars encode length from zero so they need a zero baseline, while a line chart may legitimately zoom",
      "Flags the five colours as encoding nothing, and suggests one colour with a single highlight",
      "Suggests a title or subtitle that states the actual takeaway and the scale",
    ],
    followUp: "How would you show that the gap between regions is within the survey's margin of error?",
    minWords: 80,
  },

  // ── Data Cleaning ──────────────────────────────────────────────
  {
    id: "data-cleaning-int-1",
    kind: "technical",
    skillId: "data-cleaning",
    depth: 2,
    prompt:
      "You have been handed a 50,000-row CSV of customer records you have never seen before. Walk me through what you do in the first hour, before any analysis.",
    lookFor: [
      "Profiles first: row count, column types, value ranges, unique counts, missing counts per column",
      "Checks that types parsed correctly: dates as dates, IDs not turned into numbers, numbers not text",
      "Looks for duplicates and defines what makes a row a duplicate (a key, not the whole row)",
      "Keeps the raw file untouched and records the cleaning steps so they can be re-run",
    ],
    followUp: "What would you write down so a teammate could reproduce your cleaned dataset exactly?",
    minWords: 60,
  },
  {
    id: "data-cleaning-int-2",
    kind: "technical",
    skillId: "data-cleaning",
    depth: 3,
    context:
      "In a 50,000-row survey dataset the income column is missing for 18% of rows, and missingness is far higher among respondents under 25. A teammate suggests filling the blanks with the column mean so no rows have to be dropped.",
    prompt:
      "Explain what that would do to the analysis, and compare at least two options you would consider instead.",
    lookFor: [
      "Explains mean imputation shrinks variance and biases results because the missingness is not random",
      "Notes that dropping the rows instead biases the sample towards older respondents",
      "Offers concrete alternatives: group-wise imputation, a 'was missing' indicator column, or reporting on the subset",
      "Says the right choice depends on what the analysis is for, and that the decision must be documented",
    ],
    followUp: "How would you check whether your chosen fix moved the headline number much?",
    minWords: 80,
  },

  // ── HTML & CSS ─────────────────────────────────────────────────
  {
    id: "html-css-int-1",
    kind: "technical",
    skillId: "html-css",
    depth: 2,
    prompt:
      "A teammate builds every page out of div elements and asks what the fuss about semantic HTML is. Explain it to them, and walk through how you would mark up a blog article page.",
    lookFor: [
      "Names concrete elements and their jobs: header, nav, main, article, an h1 with ordered headings below, footer",
      "Connects semantics to screen readers navigating by landmarks and headings",
      "Names another beneficiary: SEO, default keyboard behaviour, or simply less CSS to write",
      "Says a div with an onclick is not a button, and why (focus order, Enter/Space, announced role)",
    ],
    followUp: "If the design calls for a link that looks like a button, what do you actually put in the HTML?",
    minWords: 60,
  },
  {
    id: "html-css-int-2",
    kind: "technical",
    skillId: "html-css",
    depth: 3,
    context:
      "A card grid looks fine on a laptop, but on a phone the page scrolls sideways and one card's text spills past its border.\n\n.grid { display: flex; gap: 16px; }\n.card { width: 320px; padding: 24px; border: 1px solid #ddd; }",
    prompt:
      "Explain what is causing each symptom and what you would change, and say why you prefer your fix to the alternatives.",
    lookFor: [
      "Traces the sideways scroll to the fixed 320px width with no wrapping, and adds flex-wrap plus a flexible width or a grid with minmax",
      "Explains box-sizing: padding and border add to a content-box width, fixed with box-sizing: border-box",
      "Handles the spilling text with overflow-wrap/word-break, or min-width: 0 on the flex item",
      "Prefers a responsive rule (media query, auto-fit minmax, clamp) over hardcoding another fixed width",
    ],
    followUp: "How would you confirm which element is actually overflowing instead of guessing?",
    minWords: 80,
  },

  // ── JavaScript ─────────────────────────────────────────────────
  {
    id: "javascript-int-1",
    kind: "technical",
    skillId: "javascript",
    depth: 2,
    prompt:
      "Explain to someone who has only written synchronous code what 'asynchronous' means in JavaScript, and walk through what actually happens if you call fetch and use the result on the very next line.",
    lookFor: [
      "Describes a single thread with an event loop and a queue of callbacks, not parallel threads",
      "Says fetch returns a Promise straight away and the data arrives later",
      "Explains the next line therefore sees a pending Promise or undefined, not the data",
      "Names await or .then() as how you wait, plus try/catch or .catch() for failures",
    ],
    followUp: "What's the difference between awaiting three requests one after another and starting all three at once?",
    minWords: 60,
  },
  {
    id: "javascript-int-2",
    kind: "technical",
    skillId: "javascript",
    depth: 3,
    context:
      "This helper should return a fresh settings object, but callers report that changing one user's notification setting changes it for everyone.\n\nconst DEFAULTS = { theme: 'light', notify: { email: true } };\n\nfunction withTheme(theme) {\n  const s = { ...DEFAULTS };\n  s.theme = theme;\n  return s;\n}",
    prompt:
      "Explain why callers still end up sharing state, and compare the ways you could fix it.",
    lookFor: [
      "Identifies the spread as a shallow copy, so s.notify is still the same object as DEFAULTS.notify",
      "Contrasts theme (a primitive, copied by value) with notify (an object, copied by reference)",
      "Names at least two fixes with trade-offs, e.g. a nested spread, structuredClone, or building the object fresh each call",
      "Mentions Object.freeze or not exporting a mutable shared default as prevention",
    ],
    followUp: "How would you write a quick check that fails if this bug ever comes back?",
    minWords: 80,
  },

  // ── React ──────────────────────────────────────────────────────
  {
    id: "react-int-1",
    kind: "technical",
    skillId: "react",
    depth: 2,
    prompt:
      "Explain to someone who knows plain JavaScript and the DOM what React state is, and why changing an ordinary variable doesn't update the screen. Use a counter as your example.",
    lookFor: [
      "Says a state update triggers a re-render, whereas reassigning a plain variable tells React nothing",
      "Explains the component function runs again and React updates the DOM from the new output",
      "Describes useState returning a value plus a setter, and that the value is fixed within one render",
      "Notes updates are not applied synchronously, or reaches for the updater form when the new value depends on the old",
    ],
    followUp: "Why does calling setCount(count + 1) three times in a row not add three?",
    minWords: 60,
  },
  {
    id: "react-int-2",
    kind: "technical",
    skillId: "react",
    depth: 3,
    context:
      "A search box fetches results whenever the query changes. Users typing fast sometimes end up looking at results from an earlier query.\n\nuseEffect(() => {\n  fetch(`/api/search?q=${query}`)\n    .then(r => r.json())\n    .then(setResults);\n}, [query]);",
    prompt:
      "Explain what is going wrong here and walk through your fix, including anything you would add beyond bare correctness.",
    lookFor: [
      "Names the race: responses can arrive out of order, so a slow earlier request overwrites a newer one",
      "Uses the effect's cleanup function with a cancelled/ignore flag, or an AbortController",
      "Mentions debouncing, or that every keystroke currently fires a request",
      "Adds loading and error handling, or notes the promise chain has no .catch()",
    ],
    followUp: "How would your fix change if two components on the page were searching at the same time?",
    minWords: 80,
  },

  // ── TypeScript ─────────────────────────────────────────────────
  {
    id: "typescript-int-1",
    kind: "technical",
    skillId: "typescript",
    depth: 2,
    prompt:
      "Explain to a JavaScript developer what TypeScript actually buys them, then walk through how you would type an API response that is either a success carrying data or a failure carrying an error message.",
    lookFor: [
      "Says the checking happens at compile time only and disappears at runtime",
      "Models the response as a union of two object types, ideally discriminated by a literal tag such as ok: true | false",
      "Shows narrowing: checking the tag inside an if so the compiler knows which fields exist in that branch",
      "Gives a concrete payoff: autocomplete, catching typos and missing fields at build time, safer refactors",
    ],
    followUp: "If the server sends back a shape your type doesn't describe, what happens at runtime?",
    minWords: 60,
  },
  {
    id: "typescript-int-2",
    kind: "technical",
    skillId: "typescript",
    depth: 3,
    context:
      "A code review flags this helper:\n\nexport async function getJson(url: string): Promise<any> {\n  const res = await fetch(url);\n  return res.json();\n}\n\nThe author replies: \"It's fine, it compiles and every caller works.\"",
    prompt:
      "Explain what that any is really costing, and argue for a specific alternative including its downside.",
    lookFor: [
      "Explains any switches off checking and spreads silently into every caller's variables and property accesses",
      "Proposes unknown or a generic type parameter, and admits the cost: callers must narrow or assert",
      "Points out a type annotation does not validate the real response, so a runtime check or schema parse is what makes it true",
      "Notes the compiler will not catch a renamed or missing field, so the bug surfaces in production instead",
    ],
    followUp: "Where would you still allow any and sleep fine that night?",
    minWords: 80,
  },

  // ── Working with Web APIs ──────────────────────────────────────
  {
    id: "web-apis-int-1",
    kind: "technical",
    skillId: "web-apis",
    depth: 2,
    prompt:
      "Walk me through everything you would handle when loading a list of products from an API into a page, beyond just getting the data on screen.",
    lookFor: [
      "Names the UI states explicitly: loading, error, loaded, and the empty-list case",
      "Knows fetch does not reject on 404 or 500, so response.ok or the status must be checked",
      "Catches network failures and shows a message or retry rather than a blank page",
      "Says something concrete about the request itself: method and headers, parsing JSON, or cancelling on unmount",
    ],
    followUp: "What should the user see if the request succeeds but the list comes back empty?",
    minWords: 60,
  },
  {
    id: "web-apis-int-2",
    kind: "technical",
    skillId: "web-apis",
    depth: 3,
    context:
      "A request to https://api.partner.com/orders works when you paste the URL in the address bar and when you run it with curl, but from your app's JavaScript the console shows a CORS error and no data comes back.",
    prompt:
      "Explain what that difference tells you about where the problem lives, and describe the options you would consider.",
    lookFor: [
      "Explains CORS is enforced by the browser on cross-origin JavaScript requests, which is why curl and the address bar are unaffected",
      "Says the fix is a response header from the API server (Access-Control-Allow-Origin), not a change to the fetch call",
      "Names the workaround when you don't control that API: call it from your own server or a backend route",
      "Mentions the preflight OPTIONS request, or that credentials and custom headers widen what the server must allow",
    ],
    followUp: "Why is turning off CORS checks in your own browser a bad way to 'fix' this?",
    minWords: 80,
  },

  // ── Git & Version Control ──────────────────────────────────────
  {
    id: "git-int-1",
    kind: "technical",
    skillId: "git",
    depth: 2,
    prompt:
      "Explain to a teammate whose only backup habit is zipping folders what a branch is and why teams work this way, then walk through your workflow for a two-day feature.",
    lookFor: [
      "Describes a branch as a moving pointer to a line of commits, not a copy of the folder",
      "Walks a concrete sequence: branch off main, small commits, push, pull request, review, merge",
      "Gives a reason branches matter: main stays releasable, people work in parallel, changes are reviewed in isolation",
      "Says something about commit hygiene: small focused commits, messages that explain why rather than 'update'",
    ],
    followUp: "Main has moved on while you were working. What do you do before asking for a review?",
    minWords: 60,
  },
  {
    id: "git-int-2",
    kind: "technical",
    skillId: "git",
    depth: 3,
    context:
      "You pushed a commit to the shared main branch an hour ago that broke the build, and two teammates have already pulled it. You know git reset --hard, git revert and git push --force all exist.",
    prompt:
      "Explain which one you would reach for and why, and say what would go wrong with each of the others.",
    lookFor: [
      "Chooses git revert because the commit is already shared, and it adds a new commit rather than rewriting history",
      "Explains reset --hard plus a force-push rewrites shared history and breaks teammates' local branches on their next pull",
      "Marks out the safe case: rewriting history is fine on your own unpushed or unshared branch",
      "Mentions confirming what actually broke first, or that a revert is itself reversible and leaves an audit trail",
    ],
    followUp: "When would a force-push actually be the right call?",
    minWords: 80,
  },

  // ── Programming Fundamentals ───────────────────────────────────
  {
    id: "programming-fundamentals-int-1",
    kind: "technical",
    skillId: "programming-fundamentals",
    depth: 2,
    prompt:
      "Explain to a teammate what Big-O notation is for, and why an O(n log n) sort beats an O(n squared) one. Give concrete input sizes where the gap starts to matter.",
    lookFor: [
      "Describes Big-O as how the work grows with input size, not a measurement in seconds on one machine",
      "Uses concrete numbers, e.g. comparing n = 1,000 with n = 1,000,000, to show the gap widening",
      "Acknowledges constants and small inputs, so the slower-growing option is not always faster in practice",
      "Names a real O(n squared) pattern such as a nested loop over the same list, and the O(n) set or dictionary alternative",
    ],
    followUp: "Where does memory use fit into this? Give an example of trading space for time.",
    minWords: 60,
  },
  {
    id: "programming-fundamentals-int-2",
    kind: "technical",
    skillId: "programming-fundamentals",
    depth: 3,
    context:
      "A script checks 200,000 incoming email addresses against 50,000 already-registered ones and takes about 40 minutes:\n\nfor email in incoming:\n    if email in registered_list:   # registered_list is a list\n        flag(email)",
    prompt:
      "Explain where the time is going and what you would change, then say what your change costs you.",
    lookFor: [
      "Identifies that `in` on a list is a linear scan, so the work is roughly 200,000 x 50,000 comparisons",
      "Converts registered_list to a set or dict for average constant-time lookups",
      "States the cost honestly: extra memory for the set, and values must be hashable",
      "Raises normalising case or whitespace so equality actually matches, or notes the ordering is lost",
    ],
    followUp: "How would you confirm the faster version flags exactly the same emails as the old one?",
    minWords: 80,
  },

  // ── REST API Design ────────────────────────────────────────────
  {
    id: "api-design-int-1",
    kind: "technical",
    skillId: "api-design",
    depth: 2,
    prompt:
      "You are designing the endpoints for a simple to-do app. Walk me through the URLs and HTTP methods you would expose, and explain why you wouldn't just POST everything to /doAction.",
    lookFor: [
      "Uses noun-based plural resource paths: GET /tasks, GET /tasks/{id}, POST /tasks, PATCH /tasks/{id}, DELETE /tasks/{id}",
      "Matches methods to intent and notes GET is safe and read-only, so it can be cached, linked and retried",
      "Names at least two status codes correctly, e.g. 201 for created and 404 for a missing task",
      "Gives a reason conventions pay off: predictable for clients, works with tooling and caches, less documentation",
    ],
    followUp: "How would you model 'mark all tasks complete', which isn't obviously a single resource?",
    minWords: 60,
  },
  {
    id: "api-design-int-2",
    kind: "technical",
    skillId: "api-design",
    depth: 3,
    context:
      "An API returns this for every problem:\n\nHTTP 200 OK\n{ \"success\": false, \"message\": \"something went wrong\" }\n\nThe mobile team can't tell a wrong password from an expired session from a server outage, and their blanket retry logic makes outages worse.",
    prompt:
      "Explain the concrete problems this causes and what you would change, naming the status you'd use for each of those three cases.",
    lookFor: [
      "Says errors must use non-2xx statuses so clients, proxies and monitoring can react to them",
      "Distinguishes 401 (not authenticated, bad or expired credentials) from 403 (authenticated but not allowed)",
      "Uses a 5xx for the outage and explains only 5xx and 429 are sensibly retried, ideally with backoff",
      "Proposes a consistent error body with a stable machine-readable code alongside the human message",
    ],
    followUp: "Which of those three cases should the client retry automatically, and how?",
    minWords: 80,
  },

  // ── Authentication & Security Basics ───────────────────────────
  {
    id: "auth-security-int-1",
    kind: "technical",
    skillId: "auth-security",
    depth: 2,
    prompt:
      "Explain the difference between authentication and authorization to a new teammate, then walk through what should happen on the server when a user submits a login form.",
    lookFor: [
      "Defines authentication as proving who you are and authorization as what you're allowed to do",
      "Describes looking the user up and comparing hashes, never storing or comparing plaintext passwords",
      "Names a password hashing algorithm such as bcrypt, scrypt or Argon2, and mentions salting",
      "Says a session or token is issued on success, and the failure message shouldn't reveal whether the email exists",
    ],
    followUp: "Where does authorization get checked on later requests, and what breaks if you only check it in the UI?",
    minWords: 60,
  },
  {
    id: "auth-security-int-2",
    kind: "technical",
    skillId: "auth-security",
    depth: 3,
    context:
      "A student project stores the login JWT in localStorage and sends it as an Authorization header. The token has no expiry, and 'log out' just deletes it from localStorage. A reviewer comments: \"use an httpOnly cookie instead\".",
    prompt:
      "Explain the risks in the current design, then give your view on the reviewer's suggestion including what it does not solve.",
    lookFor: [
      "Explains localStorage is readable by any JavaScript on the page, so one XSS bug leaks the token",
      "Notes an httpOnly cookie isn't readable by JS but brings CSRF risk, handled with SameSite and/or a CSRF token",
      "Flags the missing expiry: the token is valid forever and deleting it client-side doesn't invalidate it server-side",
      "Names what makes logout real: short-lived tokens with refresh, a server-side session store, or a revocation list",
    ],
    followUp: "If you could only fix one of these this week, which would you pick and why?",
    minWords: 80,
  },

  // ── Automated Testing Basics ───────────────────────────────────
  {
    id: "testing-basics-int-1",
    kind: "technical",
    skillId: "testing-basics",
    depth: 2,
    prompt:
      "A function takes a list of order amounts and a discount code and returns the total. Walk me through the test cases you would write and how you'd structure each individual test.",
    lookFor: [
      "Uses an arrange-act-assert (or given/when/then) structure for each test",
      "Lists concrete edge cases: empty list, invalid or expired code, zero or negative amounts, rounding",
      "Says each test checks one behaviour and is named after that behaviour, not 'test1'",
      "Notes tests must be deterministic and independent of run order or today's date",
    ],
    followUp: "The function starts reading today's date to check whether the code expired. How does that change your tests?",
    minWords: 60,
  },
  {
    id: "testing-basics-int-2",
    kind: "technical",
    skillId: "testing-basics",
    depth: 3,
    context:
      "A service reports 96% line coverage. Every test mocks the database, the payment provider and the clock. Last week a release broke checkout because a database column was renamed, and the whole suite stayed green.",
    prompt:
      "Explain why the suite missed it, and describe what you would change, being specific about what you would and would not mock.",
    lookFor: [
      "Explains a mock freezes an assumption about a dependency, so a real change in it can't fail the test",
      "Says coverage measures lines executed, not behaviour verified, so a high number proves little here",
      "Proposes at least one integration test running against a real test database or a containerised one",
      "Draws a line: mock slow, external or nondeterministic things like the payment provider and clock; don't mock your own core logic",
    ],
    followUp: "Where in CI would you put a check so a schema change like that fails before release?",
    minWords: 80,
  },

  // ── System Design Basics ───────────────────────────────────────
  {
    id: "system-design-int-1",
    kind: "technical",
    skillId: "system-design",
    depth: 2,
    prompt:
      "A page takes three seconds to load because it queries the database on every request for data that only changes once a day. Walk me through how you would think about adding caching.",
    lookFor: [
      "Measures first: confirms the query is actually the slow part before caching anything",
      "Names a specific cache location (in-memory, Redis, CDN/HTTP, or a precomputed table) and justifies the pick",
      "Sets a TTL tied to how often the data changes, and states how stale is acceptable",
      "Raises invalidation, the cold first request, or the new failure mode a cache introduces",
    ],
    followUp: "What if a user must see their own change instantly, but everyone else can wait a day?",
    minWords: 60,
  },
  {
    id: "system-design-int-2",
    kind: "technical",
    skillId: "system-design",
    depth: 3,
    context:
      "Signing up currently sends a welcome email, generates a PDF certificate and calls a third-party analytics API, all inside the signup request handler. Signups now take six seconds, and users see an error whenever the email provider is down.",
    prompt:
      "Explain what you would restructure and why, and be honest about what your design makes harder.",
    lookFor: [
      "Separates the essential write (create the user) from the side effects and responds as soon as the user exists",
      "Names a queue, background worker or job runner as the mechanism for the side effects",
      "States a real downside: eventual consistency, more moving parts to run and monitor, harder local debugging",
      "Mentions retries with backoff, a dead-letter queue, or idempotency so a retried job doesn't send two emails",
    ],
    followUp: "How would a user or a support agent find out that their certificate failed to generate?",
    minWords: 80,
  },
];
