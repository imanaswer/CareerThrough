import type { Skill, Question, SkillPlan } from "../taxonomy";

export const skills: Skill[] = [
  {
    id: "programming-fundamentals",
    name: "Programming Fundamentals",
    dimension: "technical",
    description:
      "Can read, trace, and write correct small programs, choosing sensible data structures, reasoning about efficiency, and debugging methodically.",
    topics: [
      { id: "programming-fundamentals-control-flow", name: "Control Flow & Recursion" },
      { id: "programming-fundamentals-data-structures", name: "Core Data Structures" },
      { id: "programming-fundamentals-complexity", name: "Time & Space Complexity" },
      { id: "programming-fundamentals-debugging", name: "Debugging & Code Reading" },
    ],
  },
  {
    id: "api-design",
    name: "REST API Design",
    dimension: "technical",
    description:
      "Can design and implement predictable, resource-oriented HTTP APIs with correct methods, status codes, pagination, and safe evolution.",
    topics: [
      { id: "api-design-resources-methods", name: "Resources & HTTP Methods" },
      { id: "api-design-status-codes", name: "Status Codes & Error Responses" },
      { id: "api-design-pagination-filtering", name: "Pagination, Filtering & Sorting" },
      { id: "api-design-versioning-reliability", name: "Versioning & Idempotency" },
    ],
  },
  {
    id: "auth-security",
    name: "Authentication & Security Basics",
    dimension: "technical",
    description:
      "Can build login and access-control flows that store credentials safely, handle sessions and tokens correctly, and avoid common web vulnerabilities.",
    topics: [
      { id: "auth-security-authn-authz", name: "Authentication vs Authorization" },
      { id: "auth-security-password-storage", name: "Password Storage & Hashing" },
      { id: "auth-security-sessions-tokens", name: "Sessions, Cookies & JWTs" },
      { id: "auth-security-common-vulnerabilities", name: "Common Web Vulnerabilities" },
    ],
  },
  {
    id: "testing-basics",
    name: "Automated Testing Basics",
    dimension: "technical",
    description:
      "Can write reliable unit and integration tests, design meaningful test cases, and use test doubles to isolate the code under test.",
    topics: [
      { id: "testing-basics-unit-tests", name: "Unit Test Anatomy" },
      { id: "testing-basics-test-design", name: "Test Case Design & Edge Cases" },
      { id: "testing-basics-mocking", name: "Test Doubles & Mocking" },
      { id: "testing-basics-integration-ci", name: "Integration Tests & CI" },
    ],
  },
  {
    id: "system-design",
    name: "System Design Basics",
    dimension: "technical",
    description:
      "Can reason about how a backend handles growth by choosing appropriate databases, caching, horizontal scaling, and asynchronous processing.",
    topics: [
      { id: "system-design-databases", name: "Database Choice & Indexing" },
      { id: "system-design-caching", name: "Caching Strategies" },
      { id: "system-design-scaling", name: "Scaling & Load Balancing" },
      { id: "system-design-queues", name: "Queues & Async Processing" },
    ],
  },
];

export const questions: Question[] = [
  // ---------- programming-fundamentals ----------
  {
    id: "programming-fundamentals-q1",
    skillId: "programming-fundamentals",
    topicId: "programming-fundamentals-control-flow",
    prompt:
      "What is the value of total after this JavaScript runs?\n\nlet total = 0;\nfor (let i = 1; i <= 10; i++) {\n  if (i % 2 === 0) continue;\n  if (i > 7) break;\n  total += i;\n}",
    options: ["9", "16", "25", "55"],
    answer: 1,
    explanation:
      "Even numbers are skipped and the loop breaks when i reaches 9, so only 1 + 3 + 5 + 7 = 16 is added.",
  },
  {
    id: "programming-fundamentals-q2",
    skillId: "programming-fundamentals",
    topicId: "programming-fundamentals-control-flow",
    prompt:
      "What does f(6) return?\n\nfunction f(n) {\n  if (n <= 1) return 1;\n  return n * f(n - 2);\n}",
    options: ["720", "24", "48", "12"],
    answer: 2,
    explanation:
      "The recursion steps down by 2: 6 * f(4) = 6 * 4 * f(2) = 6 * 4 * 2 * f(0), and f(0) hits the base case and returns 1, giving 48.",
  },
  {
    id: "programming-fundamentals-q3",
    skillId: "programming-fundamentals",
    topicId: "programming-fundamentals-data-structures",
    prompt:
      "A signup service must check, thousands of times per second, whether a username already exists among 1 million in-memory usernames. Which data structure gives the fastest average lookup?",
    options: [
      "A hash set of usernames",
      "An unsorted array of usernames",
      "A linked list of usernames",
      "A queue of usernames",
    ],
    answer: 0,
    explanation:
      "A hash set offers average O(1) membership checks, while arrays, linked lists, and queues require an O(n) scan.",
  },
  {
    id: "programming-fundamentals-q4",
    skillId: "programming-fundamentals",
    topicId: "programming-fundamentals-data-structures",
    prompt:
      "You are implementing a text editor's Undo feature: the most recent edit must be reverted first. Which data structure models this most naturally?",
    options: ["A queue (FIFO)", "A hash map", "A binary search tree", "A stack (LIFO)"],
    answer: 3,
    explanation:
      "Undo reverses actions in last-in, first-out order, which is exactly the push/pop behaviour of a stack.",
  },
  {
    id: "programming-fundamentals-q5",
    skillId: "programming-fundamentals",
    topicId: "programming-fundamentals-complexity",
    prompt:
      "What is the worst-case time complexity of this duplicate check on a list a of length n?\n\nfor i in range(n):\n    for j in range(i + 1, n):\n        if a[i] == a[j]:\n            return True\nreturn False",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    answer: 2,
    explanation:
      "With no duplicates the nested loops compare every pair, about n(n-1)/2 comparisons, which grows as O(n^2).",
  },
  {
    id: "programming-fundamentals-q6",
    skillId: "programming-fundamentals",
    topicId: "programming-fundamentals-complexity",
    prompt:
      "You run binary search on a sorted array of 1,000,000 numbers. Roughly how many comparisons are needed in the worst case?",
    options: ["About 20", "About 1,000", "About 500,000", "About 1,000,000"],
    answer: 0,
    explanation:
      "Binary search halves the search space each step, so it needs about log2(1,000,000), which is roughly 20 comparisons.",
  },
  {
    id: "programming-fundamentals-q7",
    skillId: "programming-fundamentals",
    topicId: "programming-fundamentals-debugging",
    prompt:
      "average([2, 4, 6]) returns NaN instead of 4. What is the bug?\n\nfunction average(nums) {\n  let sum = 0;\n  for (let i = 0; i <= nums.length; i++) sum += nums[i];\n  return sum / nums.length;\n}",
    options: [
      "sum should be initialised to 1 instead of 0",
      "Division always returns NaN for integers in JavaScript",
      "The loop should start at i = 1",
      "The loop condition should be i < nums.length; the last iteration adds undefined",
    ],
    answer: 3,
    explanation:
      "Using <= reads nums[3], which is undefined, and adding undefined to a number produces NaN. This is a classic off-by-one error.",
  },
  {
    id: "programming-fundamentals-q8",
    skillId: "programming-fundamentals",
    topicId: "programming-fundamentals-debugging",
    prompt:
      "Your service logs this error:\n\nTypeError: Cannot read properties of undefined (reading 'name')\n    at getUserName (user.js:12)\n\nLine 12 is: return user.profile.name;\nWhat is the most likely cause?",
    options: [
      "user is undefined",
      "user.profile is undefined",
      "user.profile.name is undefined",
      "The file user.js failed to load",
    ],
    answer: 1,
    explanation:
      "The error says 'name' was read from undefined, so the object before .name, user.profile, is undefined. If user were undefined the error would mention reading 'profile'.",
  },

  // ---------- api-design ----------
  {
    id: "api-design-q1",
    skillId: "api-design",
    topicId: "api-design-resources-methods",
    prompt:
      "You need an endpoint that returns all orders belonging to customer 42. Which design best follows REST conventions?",
    options: [
      "POST /getCustomerOrders with body { \"id\": 42 }",
      "GET /orders/customer/get?id=42&action=list",
      "GET /customers/42/orders",
      "GET /customers/orders/fetchAll/42",
    ],
    answer: 2,
    explanation:
      "REST URLs name resources with nouns and use the HTTP method as the verb; nesting orders under the customer expresses the relationship clearly.",
  },
  {
    id: "api-design-q2",
    skillId: "api-design",
    topicId: "api-design-resources-methods",
    prompt:
      "A mobile client wants to change only the email of user 7, leaving all other fields untouched. Which request is the most appropriate?",
    options: [
      "PATCH /users/7 with body { \"email\": \"new@example.com\" }",
      "PUT /users/7 with body { \"email\": \"new@example.com\" }",
      "POST /users with body { \"id\": 7, \"email\": \"new@example.com\" }",
      "GET /users/7?email=new@example.com",
    ],
    answer: 0,
    explanation:
      "PATCH applies a partial update. PUT replaces the entire resource, so sending only the email would imply the other fields are removed or reset.",
  },
  {
    id: "api-design-q3",
    skillId: "api-design",
    topicId: "api-design-status-codes",
    prompt:
      "POST /articles successfully creates a new article with id 91. Which response is most appropriate?",
    options: [
      "200 OK with an empty body",
      "204 No Content",
      "202 Accepted",
      "201 Created with a Location: /articles/91 header",
    ],
    answer: 3,
    explanation:
      "201 Created signals that a new resource now exists, and the Location header tells the client where to find it.",
  },
  {
    id: "api-design-q4",
    skillId: "api-design",
    topicId: "api-design-status-codes",
    prompt:
      "A user sends a valid access token and calls DELETE /projects/15, but they are only a viewer on that project and deleting requires the owner role. The API does not try to hide that the project exists. Which status code should it return?",
    options: ["401 Unauthorized", "403 Forbidden", "400 Bad Request", "500 Internal Server Error"],
    answer: 1,
    explanation:
      "The user is authenticated but lacks permission, which is 403 Forbidden. 401 is for missing or invalid credentials.",
  },
  {
    id: "api-design-q5",
    skillId: "api-design",
    topicId: "api-design-pagination-filtering",
    prompt:
      "Clients page through a busy feed using GET /posts?page=2&limit=20. They report seeing the same posts again on the next page whenever new posts are published. What is the best fix?",
    options: [
      "Increase the limit to 100 so fewer pages are needed",
      "Return all posts in a single response",
      "Switch to cursor-based pagination, e.g. GET /posts?after=<lastPostId>&limit=20",
      "Cache page 2 on the server for one hour",
    ],
    answer: 2,
    explanation:
      "Offset/page pagination shifts when new rows are inserted, causing duplicates. A cursor anchors the next page to the last item seen, so results stay stable.",
  },
  {
    id: "api-design-q6",
    skillId: "api-design",
    topicId: "api-design-pagination-filtering",
    prompt:
      "Clients need to list products in the 'books' category, most expensive first. Which design is the most conventional for a REST API?",
    options: [
      "GET /products?category=books&sort=-price",
      "POST /products/search-books-by-price-desc",
      "GET /products/books/price/desc/all",
      "GET /products with the filter and sort rules sent in the request body",
    ],
    answer: 0,
    explanation:
      "Filtering and sorting a collection are expressed as query parameters on the collection resource; GET bodies are unreliable and verb-style paths are not RESTful.",
  },
  {
    id: "api-design-q7",
    skillId: "api-design",
    topicId: "api-design-versioning-reliability",
    prompt:
      "A client calls POST /payments, the network times out, and the client retries. Some customers get charged twice. Which API design change best prevents this?",
    options: [
      "Tell clients never to retry failed requests",
      "Change the endpoint to GET /payments so it becomes safe",
      "Return 500 on every timeout so the client knows it failed",
      "Require a unique Idempotency-Key header and return the original result for repeated keys",
    ],
    answer: 3,
    explanation:
      "POST is not idempotent by default. An idempotency key lets the server recognise a retry of the same operation and return the stored result instead of charging again.",
  },
  {
    id: "api-design-q8",
    skillId: "api-design",
    topicId: "api-design-versioning-reliability",
    prompt:
      "Your public API returns { \"name\": \"Asha Rao\" }. The team wants to replace it with separate firstName and lastName fields. Many third-party apps depend on the current response. What is the best approach?",
    options: [
      "Remove name immediately and announce it in the changelog",
      "Release the change under a new version (e.g. /v2) while keeping /v1 working through a deprecation period",
      "Change the field on alternate days so clients notice gradually",
      "Keep the same URL but return different fields depending on server load",
    ],
    answer: 1,
    explanation:
      "Removing a field is a breaking change. Versioning lets existing clients keep working while they migrate on a published deprecation timeline.",
  },

  // ---------- auth-security ----------
  {
    id: "auth-security-q1",
    skillId: "auth-security",
    topicId: "auth-security-authn-authz",
    prompt:
      "A logged-in customer changes the URL from /invoices/1001 to /invoices/1002 and sees another customer's invoice. Which control failed?",
    options: [
      "Authentication: the system did not verify who the user is",
      "Authorization: the server did not check that this user may access that invoice",
      "Encryption: the invoice was not sent over HTTPS",
      "Hashing: the invoice id was not hashed",
    ],
    answer: 1,
    explanation:
      "The user was correctly identified (authenticated) but the server never checked ownership of the requested resource, which is an authorization failure (broken access control).",
  },
  {
    id: "auth-security-q2",
    skillId: "auth-security",
    topicId: "auth-security-authn-authz",
    prompt:
      "An admin-only 'Delete user' button is hidden in the frontend for non-admins. Where must the admin role check also be enforced for the feature to be secure?",
    options: [
      "In the CSS, so the button cannot be un-hidden",
      "In the browser's localStorage",
      "Only in the mobile app, since the web UI already hides it",
      "On the server, for every request to the delete endpoint",
    ],
    answer: 3,
    explanation:
      "Anything in the client can be bypassed by calling the API directly, so the server must verify the caller's role on every request.",
  },
  {
    id: "auth-security-q3",
    skillId: "auth-security",
    topicId: "auth-security-password-storage",
    prompt: "You are building a signup flow. How should user passwords be stored in the database?",
    options: [
      "Hashed with a slow, salted password-hashing algorithm such as bcrypt or Argon2",
      "Encrypted with AES using a key stored in the same database",
      "Hashed once with plain MD5 or SHA-1 for speed",
      "Base64-encoded so they are not human readable",
    ],
    answer: 0,
    explanation:
      "Password hashes should be one-way, salted, and deliberately slow to resist brute force. Fast hashes, reversible encryption, and Base64 encoding all make stolen passwords easy to recover.",
  },
  {
    id: "auth-security-q4",
    skillId: "auth-security",
    topicId: "auth-security-password-storage",
    prompt:
      "Two users both choose the password 'Summer2024!'. Why should the application add a unique random salt for each user before hashing?",
    options: [
      "So the password can be decrypted later if the user forgets it",
      "So the hash is shorter and uses less storage",
      "So identical passwords produce different hashes, defeating precomputed (rainbow table) attacks",
      "So the login request is faster",
    ],
    answer: 2,
    explanation:
      "A per-user salt makes each hash unique even for identical passwords, so attackers cannot use precomputed tables or crack many accounts at once.",
  },
  {
    id: "auth-security-q5",
    skillId: "auth-security",
    topicId: "auth-security-sessions-tokens",
    prompt:
      "A teammate proposes putting the user's national ID number in the JWT payload 'because the token is signed'. What is the problem with this?",
    options: [
      "Signed JWTs cannot contain numbers",
      "The signature makes the token too long for an HTTP header",
      "The payload is only Base64URL-encoded, so anyone holding the token can read it",
      "JWT payloads are deleted by the browser after one request",
    ],
    answer: 2,
    explanation:
      "A signature protects a JWT from tampering, not from being read. The payload of a standard signed JWT is readable by anyone, so it must not hold sensitive data.",
  },
  {
    id: "auth-security-q6",
    skillId: "auth-security",
    topicId: "auth-security-sessions-tokens",
    prompt:
      "You set a session cookie after login. Which attributes stop JavaScript from reading the cookie and ensure it is only sent over HTTPS?",
    options: [
      "HttpOnly and Secure",
      "Path and Domain",
      "Max-Age and Expires",
      "SameSite=None and Path",
    ],
    answer: 0,
    explanation:
      "HttpOnly hides the cookie from document.cookie (limiting theft via XSS) and Secure restricts it to HTTPS connections.",
  },
  {
    id: "auth-security-q7",
    skillId: "auth-security",
    topicId: "auth-security-common-vulnerabilities",
    prompt:
      "A login handler builds its query like this:\n\nconst sql = \"SELECT * FROM users WHERE email = '\" + email + \"'\";\n\nWhat is the correct fix?",
    options: [
      "Reject any email longer than 30 characters",
      "Hide database error messages from the user",
      "Convert the email to lowercase before concatenating",
      "Use a parameterized query (prepared statement) so the email is passed as data, not SQL",
    ],
    answer: 3,
    explanation:
      "String concatenation allows SQL injection. Parameterized queries keep user input separate from the SQL code so it can never be executed as part of the statement.",
  },
  {
    id: "auth-security-q8",
    skillId: "auth-security",
    topicId: "auth-security-common-vulnerabilities",
    prompt:
      "A blog saves comments and renders them as raw HTML. A comment containing <script>...</script> now runs in every visitor's browser. What is the vulnerability and the primary fix?",
    options: [
      "CSRF; add an anti-CSRF token to the comment form",
      "Stored XSS; escape or sanitise user content when rendering it",
      "SQL injection; use parameterized queries when saving comments",
      "Brute force; add rate limiting to the comments endpoint",
    ],
    answer: 1,
    explanation:
      "Attacker-supplied script stored on the server and executed in other users' browsers is stored cross-site scripting; the core defence is output encoding or sanitisation.",
  },

  // ---------- testing-basics ----------
  {
    id: "testing-basics-q1",
    skillId: "testing-basics",
    topicId: "testing-basics-unit-tests",
    prompt:
      "A unit test for isWeekendDiscountActive() passes on Saturdays but fails on weekdays because the function reads the current system date. What is the best fix?",
    options: [
      "Only run the test suite on weekends",
      "Add a retry so the test runs until it passes",
      "Pass the date (or a clock) into the function so the test can supply fixed dates",
      "Delete the test because date logic cannot be tested",
    ],
    answer: 2,
    explanation:
      "Unit tests must be deterministic. Injecting the date lets the test control time and check both weekend and weekday behaviour on any day.",
  },
  {
    id: "testing-basics-q2",
    skillId: "testing-basics",
    topicId: "testing-basics-unit-tests",
    prompt:
      "In the Arrange-Act-Assert pattern, which line is the 'Act' step?\n\ntest('applies 10% discount', () => {\n  const cart = new Cart([{ price: 100 }]);   // line A\n  cart.applyDiscount(0.1);                   // line B\n  expect(cart.total()).toBe(90);             // line C\n});",
    options: ["Line A", "Line B", "Line C", "The test name string"],
    answer: 1,
    explanation:
      "Line A arranges the starting state, line B performs the behaviour under test (Act), and line C asserts the outcome.",
  },
  {
    id: "testing-basics-q3",
    skillId: "testing-basics",
    topicId: "testing-basics-test-design",
    prompt:
      "isEligible(age) should return true for ages 18 to 60 inclusive. Which set of inputs best tests the boundaries?",
    options: ["17, 18, 60, 61", "20, 30, 40, 50", "0, 100, 1000, -1", "18, 25, 35, 60"],
    answer: 0,
    explanation:
      "Boundary value analysis tests values on and just outside each edge, where off-by-one mistakes such as < versus <= show up.",
  },
  {
    id: "testing-basics-q4",
    skillId: "testing-basics",
    topicId: "testing-basics-test-design",
    prompt:
      "A production bug shows parseDate(\"\") throws an exception instead of returning null. What is the best way to handle the fix?",
    options: [
      "Fix the code and rely on manual checking before each release",
      "Wrap every call to parseDate in try/catch across the codebase",
      "Fix the code; the existing tests already pass so nothing else is needed",
      "First write a test that reproduces the failure, then fix the code and keep the test as a regression test",
    ],
    answer: 3,
    explanation:
      "A failing test proves the bug is reproduced, confirms the fix works when it turns green, and prevents the bug from silently returning.",
  },
  {
    id: "testing-basics-q5",
    skillId: "testing-basics",
    topicId: "testing-basics-mocking",
    prompt:
      "registerUser() saves a user and then sends a welcome email through a third-party email API. How should a unit test handle the email part?",
    options: [
      "Send a real email to a personal inbox and check it manually",
      "Comment out the email call while the tests run",
      "Replace the email client with a mock and assert it was called with the expected recipient",
      "Skip testing registerUser() because it has side effects",
    ],
    answer: 2,
    explanation:
      "A mock keeps the test fast and isolated from the network while still verifying that the code requested the right email.",
  },
  {
    id: "testing-basics-q6",
    skillId: "testing-basics",
    topicId: "testing-basics-mocking",
    prompt:
      "To test convertPrice(), you need getExchangeRate() to return 1.2 every time so you can check the maths. You do not care how or how often it is called. Which test double fits best?",
    options: [
      "A stub that returns the fixed value 1.2",
      "A real HTTP call to the live exchange-rate service",
      "A mock with strict expectations on call count and order",
      "A load-testing tool that simulates many requests",
    ],
    answer: 0,
    explanation:
      "A stub simply supplies canned answers so the code under test can run; strict mocks are for verifying interactions, which is not needed here.",
  },
  {
    id: "testing-basics-q7",
    skillId: "testing-basics",
    topicId: "testing-basics-integration-ci",
    prompt:
      "All unit tests for OrderRepository pass with a mocked database, yet the feature fails in staging. Which kind of defect would an integration test against a real test database most likely have caught?",
    options: [
      "A typo in a code comment",
      "An incorrect rounding rule inside a pure calculation function",
      "A confusing variable name",
      "A SQL query that references a column that does not exist in the schema",
    ],
    answer: 3,
    explanation:
      "Mocks never execute the real query, so mismatches between code and the actual database schema only surface when components are tested together.",
  },
  {
    id: "testing-basics-q8",
    skillId: "testing-basics",
    topicId: "testing-basics-integration-ci",
    prompt:
      "Your team is setting up a CI pipeline and deciding how to balance test types. Which mix follows the commonly recommended test pyramid?",
    options: [
      "Mostly end-to-end UI tests, with a few unit tests",
      "Many fast unit tests, fewer integration tests, and a small number of end-to-end tests",
      "Equal numbers of unit, integration, and end-to-end tests",
      "Only manual tests, run before each release",
    ],
    answer: 1,
    explanation:
      "Unit tests are fast and cheap so they form the wide base; slower, more brittle integration and end-to-end tests are used more sparingly.",
  },

  // ---------- system-design ----------
  {
    id: "system-design-q1",
    skillId: "system-design",
    topicId: "system-design-databases",
    prompt:
      "You are designing a wallet app where a transfer must debit one account and credit another, and both changes must succeed or fail together. Which storage choice fits best?",
    options: [
      "An in-memory cache with no persistence",
      "A relational database with ACID transactions",
      "Flat CSV files on the application server",
      "A search index such as a full-text search engine",
    ],
    answer: 1,
    explanation:
      "Money transfers need atomic, consistent multi-row updates, which ACID transactions in a relational database provide directly.",
  },
  {
    id: "system-design-q2",
    skillId: "system-design",
    topicId: "system-design-databases",
    prompt:
      "SELECT * FROM orders WHERE customer_id = 42 takes 6 seconds on a table with 50 million rows. The query plan shows a full table scan. What should you try first?",
    options: [
      "Move the table to a NoSQL database",
      "Add more application servers",
      "Rewrite the backend in a faster programming language",
      "Add an index on the customer_id column",
    ],
    answer: 3,
    explanation:
      "An index lets the database jump straight to matching rows instead of scanning all 50 million, and it is the cheapest, most targeted fix.",
  },
  {
    id: "system-design-q3",
    skillId: "system-design",
    topicId: "system-design-caching",
    prompt:
      "A product-details endpoint receives 10,000 reads per second, but product data changes about once a day. The database is struggling. What is the most effective first improvement?",
    options: [
      "Cache product responses in an in-memory store such as Redis with a sensible TTL",
      "Put incoming read requests onto a message queue",
      "Add a database index on every column",
      "Ask clients to call the endpoint less often",
    ],
    answer: 0,
    explanation:
      "Read-heavy, rarely changing data is the ideal caching case: most requests are served from memory and never reach the database.",
  },
  {
    id: "system-design-q4",
    skillId: "system-design",
    topicId: "system-design-caching",
    prompt:
      "After users update their display name, they keep seeing the old name for up to 10 minutes. Profiles are cached with a 10-minute TTL. What is the best fix?",
    options: [
      "Increase the TTL to one hour",
      "Restart the cache server every night",
      "Delete or update the cached profile entry whenever the profile is written",
      "Remove the database and serve everything from the cache",
    ],
    answer: 2,
    explanation:
      "The issue is stale cache data. Invalidating or refreshing the entry on write keeps the cache consistent without giving up its benefits.",
  },
  {
    id: "system-design-q5",
    skillId: "system-design",
    topicId: "system-design-scaling",
    prompt:
      "Your stateless API runs on one server that sits at 95% CPU during peak traffic. Which option is an example of horizontal scaling?",
    options: [
      "Upgrading the server from 4 to 32 CPU cores",
      "Adding more RAM to the existing server",
      "Running several identical servers behind a load balancer",
      "Moving the server to a faster SSD",
    ],
    answer: 2,
    explanation:
      "Horizontal scaling adds more machines to share the load; upgrading a single machine's CPU, RAM, or disk is vertical scaling.",
  },
  {
    id: "system-design-q6",
    skillId: "system-design",
    topicId: "system-design-scaling",
    prompt:
      "After moving from one server to three servers behind a round-robin load balancer, users are randomly logged out. Sessions are stored in each server's memory. What is the best fix?",
    options: [
      "Store sessions in a shared store such as Redis so any server can serve any user",
      "Go back to a single, larger server permanently",
      "Ask users to log in again whenever it happens",
      "Shorten the session timeout",
    ],
    answer: 0,
    explanation:
      "Each request can land on a server that has never seen the session. A shared session store (or stateless tokens) makes the servers interchangeable.",
  },
  {
    id: "system-design-q7",
    skillId: "system-design",
    topicId: "system-design-queues",
    prompt:
      "POST /signup takes 8 seconds because it creates the account, generates a PDF welcome pack, and sends an email before responding. What is the best redesign?",
    options: [
      "Increase the HTTP timeout on the client to 30 seconds",
      "Show a longer loading animation",
      "Run the PDF and email steps before creating the account",
      "Create the account, enqueue the PDF and email work for a background worker, and respond immediately",
    ],
    answer: 3,
    explanation:
      "Slow, non-critical work belongs off the request path. A queue lets workers process it asynchronously, with retries, while the user gets a fast response.",
  },
  {
    id: "system-design-q8",
    skillId: "system-design",
    topicId: "system-design-queues",
    prompt:
      "Your message queue guarantees at-least-once delivery, so a worker may occasionally receive the same 'send invoice' message twice. How should the worker be designed?",
    options: [
      "Assume duplicates never happen because the queue is reliable",
      "Make the handler idempotent, e.g. record processed message ids and skip ones already handled",
      "Process every message twice on purpose to stay consistent",
      "Turn off acknowledgements so messages are never redelivered",
    ],
    answer: 1,
    explanation:
      "At-least-once delivery means duplicates are expected, so consumers must produce the same result when a message is processed more than once.",
  },
];

export const plans: SkillPlan[] = [
  {
    skillId: "programming-fundamentals",
    days: [
      {
        topicId: "programming-fundamentals-control-flow",
        title: "Trace loops, branches, and recursion by hand",
        minutes: 60,
        summary: "Build the habit of predicting exactly what code does before running it.",
        learn: [
          "How for/while loops, break, and continue change the flow of execution",
          "Tracing variables line by line using a trace table",
          "Recursion: base case, recursive case, and how the call stack unwinds",
          "Common control-flow mistakes: off-by-one bounds and missing base cases",
        ],
        practice:
          "Write factorial and sum-of-digits both iteratively and recursively, and trace each by hand for one input before running it to confirm your prediction.",
      },
      {
        topicId: "programming-fundamentals-data-structures",
        title: "Pick the right data structure",
        minutes: 75,
        summary: "Learn what arrays, hash maps, sets, stacks, and queues are each good at.",
        learn: [
          "Arrays/lists vs linked lists: indexing, insertion, and deletion costs",
          "Hash maps and sets: key-based lookup and membership checks in average O(1)",
          "Stacks (LIFO) and queues (FIFO) and the problems they model",
          "Matching a requirement (lookup, ordering, uniqueness) to a structure",
        ],
        practice:
          "Implement a balanced-brackets checker using a stack and a word-frequency counter using a hash map, in JavaScript or Python.",
      },
      {
        topicId: "programming-fundamentals-complexity",
        title: "Reason about Big-O",
        minutes: 60,
        summary: "Estimate how running time and memory grow as input size grows.",
        learn: [
          "Big-O notation and the common classes: O(1), O(log n), O(n), O(n log n), O(n^2)",
          "Counting work in single loops, nested loops, and halving loops",
          "Why binary search is O(log n) and requires sorted input",
          "Trading space for time, e.g. using a set to avoid a nested loop",
        ],
        practice:
          "Write an O(n^2) 'has duplicates' function, rewrite it as O(n) using a set, and time both on lists of 1,000 and 50,000 items.",
      },
      {
        topicId: "programming-fundamentals-debugging",
        title: "Debug systematically",
        minutes: 60,
        summary: "Replace guesswork with a repeatable process for finding and fixing bugs.",
        learn: [
          "Reading error messages and stack traces from the top frame down",
          "Reproduce, isolate, hypothesise, verify: the debugging loop",
          "Using print/log statements and a debugger with breakpoints and watches",
          "Typical bug patterns: off-by-one, null/undefined access, wrong operator, mutated shared state",
        ],
        practice:
          "Take a small working program, have a friend (or yourself, a day earlier) introduce three bugs, then find each one using a debugger and write one line on the root cause.",
      },
      {
        topicId: null,
        title: "Challenge: build a log analyser",
        minutes: 120,
        summary: "Combine control flow, data structures, complexity thinking, and debugging in one small program.",
        learn: [
          "Breaking a problem into small functions with clear inputs and outputs",
          "Choosing structures up front: a map for counts, a list for ordered results",
          "Checking your solution's complexity before optimising",
        ],
        practice:
          "Write a program that reads a text log of 'timestamp user action' lines and reports the top 3 most active users and any user with more than 5 failed logins, handling empty and malformed lines, and state the time complexity of your solution.",
      },
    ],
  },
  {
    skillId: "api-design",
    days: [
      {
        topicId: "api-design-resources-methods",
        title: "Model resources and choose HTTP methods",
        minutes: 60,
        summary: "Design URLs around nouns and let HTTP methods carry the action.",
        learn: [
          "Resources, collections, and nested resources (e.g. /customers/{id}/orders)",
          "GET, POST, PUT, PATCH, DELETE and what each one means",
          "Safe and idempotent methods and why the distinction matters",
          "Naming conventions: plural nouns, no verbs in paths, consistent casing",
        ],
        practice:
          "Design the full endpoint list (method + path + one-line purpose) for a library system with books, members, and loans.",
      },
      {
        topicId: "api-design-status-codes",
        title: "Return the right status codes and errors",
        minutes: 60,
        summary: "Communicate outcomes clearly so clients can react without guessing.",
        learn: [
          "The 2xx family: 200, 201 with Location, 202, and 204",
          "Client errors: 400, 401 vs 403, 404, 409, and 422",
          "Server errors (5xx) and why clients treat them differently from 4xx",
          "A consistent JSON error body: code, message, and field-level details",
        ],
        practice:
          "For your library API, write a table of every endpoint's success code and at least two failure codes, plus one example JSON error body.",
      },
      {
        topicId: "api-design-pagination-filtering",
        title: "Paginate, filter, and sort collections",
        minutes: 75,
        summary: "Keep list endpoints fast and predictable as data grows.",
        learn: [
          "Offset/limit pagination and its drawbacks on changing data",
          "Cursor-based pagination and returning next-page information",
          "Filtering and sorting via query parameters",
          "Setting default and maximum page sizes to protect the server",
        ],
        practice:
          "Implement GET /books with limit, cursor, author filter, and sort parameters in any framework, backed by an in-memory array of 200 items.",
      },
      {
        topicId: "api-design-versioning-reliability",
        title: "Evolve APIs safely and handle retries",
        minutes: 75,
        summary: "Change an API without breaking clients and make writes safe to retry.",
        learn: [
          "Breaking vs non-breaking changes to requests and responses",
          "Versioning strategies: URL path, header, and deprecation periods",
          "Idempotency keys for POST requests that must not run twice",
          "Documenting an API contract so consumers know what to rely on",
        ],
        practice:
          "Add an Idempotency-Key header to a POST /loans endpoint so a repeated request returns the original response, and write a short note on how you would ship a breaking field rename as v2.",
      },
      {
        topicId: null,
        title: "Challenge: design and build a small REST API",
        minutes: 120,
        summary: "Apply resource modelling, status codes, pagination, and idempotency end to end.",
        learn: [
          "Writing a brief API spec before writing code",
          "Validating input at the boundary and returning consistent errors",
          "Testing endpoints with an HTTP client, including failure cases",
        ],
        practice:
          "Build a task-manager API (projects and tasks) with CRUD endpoints, correct status codes, cursor pagination on task lists, filtering by status, and an idempotent task-creation endpoint, then document it in a one-page endpoint reference.",
      },
    ],
  },
  {
    skillId: "auth-security",
    days: [
      {
        topicId: "auth-security-authn-authz",
        title: "Separate authentication from authorization",
        minutes: 60,
        summary: "Understand the difference between proving identity and checking permission.",
        learn: [
          "Authentication (who are you) vs authorization (what may you do)",
          "Role-based access control and resource ownership checks",
          "Why every check must be enforced on the server, not only in the UI",
          "Broken access control and insecure direct object references",
        ],
        practice:
          "Take a simple notes API and add a server-side check so users can only read, edit, or delete their own notes, then try to break it by changing ids in requests.",
      },
      {
        topicId: "auth-security-password-storage",
        title: "Store passwords safely",
        minutes: 60,
        summary: "Learn why passwords are hashed, salted, and deliberately slow to compute.",
        learn: [
          "Hashing vs encryption vs encoding",
          "Why fast hashes like MD5 and SHA-1 are unsuitable for passwords",
          "Salts, work factors, and algorithms such as bcrypt and Argon2",
          "Safe password reset flows using short-lived, single-use tokens",
        ],
        practice:
          "Implement register and login functions that hash passwords with bcrypt (or Argon2) and verify them, and confirm two users with the same password get different stored hashes.",
      },
      {
        topicId: "auth-security-sessions-tokens",
        title: "Manage sessions, cookies, and JWTs",
        minutes: 75,
        summary: "Keep users logged in without exposing their credentials or tokens.",
        learn: [
          "Server-side sessions vs stateless tokens and their trade-offs",
          "Cookie attributes: HttpOnly, Secure, and SameSite",
          "JWT structure: header, payload, signature, and why the payload is readable",
          "Token expiry, refresh, and logout/revocation",
        ],
        practice:
          "Add login to a small app that issues a short-lived JWT or session cookie with HttpOnly, Secure, and SameSite set, then decode the token to see exactly what it reveals.",
      },
      {
        topicId: "auth-security-common-vulnerabilities",
        title: "Defend against common web attacks",
        minutes: 90,
        summary: "Recognise and fix SQL injection, XSS, and CSRF in real code.",
        learn: [
          "SQL injection and parameterized queries",
          "Stored and reflected XSS, output encoding, and sanitisation",
          "CSRF and defences: SameSite cookies and anti-CSRF tokens",
          "Supporting practices: HTTPS everywhere, rate limiting logins, keeping secrets out of source code",
        ],
        practice:
          "Write a deliberately vulnerable search endpoint using string-concatenated SQL and a page that renders raw comments, exploit both locally, then fix them with parameterized queries and output escaping.",
      },
      {
        topicId: null,
        title: "Challenge: secure a small application",
        minutes: 120,
        summary: "Bring identity, password storage, sessions, and vulnerability fixes together.",
        learn: [
          "Reviewing an app with a simple security checklist",
          "Least privilege for users, tokens, and database accounts",
          "Logging security events without logging secrets",
        ],
        practice:
          "Build a notes app with registration, login, hashed passwords, secure session cookies, per-user authorization, parameterized queries, escaped output, and login rate limiting, then write a half-page security review of what you protected against.",
      },
    ],
  },
  {
    skillId: "testing-basics",
    days: [
      {
        topicId: "testing-basics-unit-tests",
        title: "Write your first solid unit tests",
        minutes: 60,
        summary: "Learn the structure and qualities of a good unit test.",
        learn: [
          "What a unit test is and what it should and should not cover",
          "Arrange-Act-Assert structure and descriptive test names",
          "Fast, isolated, deterministic tests and why flaky tests are harmful",
          "Running tests with a framework such as Jest, Vitest, or pytest",
        ],
        practice:
          "Write a small price calculator (subtotal, discount, tax) and cover it with at least six unit tests using Arrange-Act-Assert.",
      },
      {
        topicId: "testing-basics-test-design",
        title: "Design test cases that find bugs",
        minutes: 60,
        summary: "Choose inputs deliberately rather than testing only the happy path.",
        learn: [
          "Equivalence partitions and boundary value analysis",
          "Edge cases: empty input, null, zero, negative, very large, and malformed values",
          "Testing error paths and thrown exceptions",
          "Regression tests: reproducing a bug with a failing test before fixing it",
        ],
        practice:
          "For a function validating passwords (8-64 characters, at least one digit), list the partitions and boundaries, then write tests for each, including invalid types and empty strings.",
      },
      {
        topicId: "testing-basics-mocking",
        title: "Isolate code with test doubles",
        minutes: 75,
        summary: "Replace slow or external dependencies so unit tests stay fast and focused.",
        learn: [
          "Stubs, mocks, spies, and fakes and when to use each",
          "Dependency injection as the key to testable code",
          "Verifying interactions: was the dependency called with the right arguments",
          "The risks of over-mocking and testing implementation details",
        ],
        practice:
          "Write a function that fetches a user from an HTTP API and sends a notification, then unit-test it by stubbing the HTTP client and mocking the notifier, including the API-failure case.",
      },
      {
        topicId: "testing-basics-integration-ci",
        title: "Add integration tests and run them in CI",
        minutes: 90,
        summary: "Verify that components work together and keep the main branch green automatically.",
        learn: [
          "What integration tests catch that unit tests miss",
          "Testing against a real test database or an in-process HTTP server",
          "The test pyramid: many unit, fewer integration, few end-to-end tests",
          "Running tests automatically on every push or pull request",
        ],
        practice:
          "Write two integration tests for an API endpoint that reads and writes a real test database (for example SQLite), and add a CI workflow file that runs the whole suite on every push.",
      },
      {
        topicId: null,
        title: "Challenge: test a feature end to end",
        minutes: 120,
        summary: "Apply unit tests, test design, mocking, and integration tests to one realistic feature.",
        learn: [
          "Planning a test strategy before writing code",
          "Reading a coverage report and spotting untested branches",
          "Keeping tests readable so they double as documentation",
        ],
        practice:
          "Build a 'place order' feature (validate cart, calculate total, save order, send confirmation email) with unit tests for the logic, boundary tests for validation, a mocked email sender, and one integration test through the API to the database.",
      },
    ],
  },
  {
    skillId: "system-design",
    days: [
      {
        topicId: "system-design-databases",
        title: "Choose a database and index it",
        minutes: 75,
        summary: "Match storage to the data's shape and access patterns, and keep queries fast.",
        learn: [
          "Relational vs document and key-value stores and when each fits",
          "ACID transactions and why they matter for money and inventory",
          "How indexes speed up reads and what they cost on writes",
          "Reading a query plan to spot full table scans",
        ],
        practice:
          "Create a table with 500,000 rows in PostgreSQL or SQLite, time a filtered query, add an index, time it again, and compare the query plans.",
      },
      {
        topicId: "system-design-caching",
        title: "Speed up reads with caching",
        minutes: 60,
        summary: "Serve hot data from memory while keeping it acceptably fresh.",
        learn: [
          "The cache-aside pattern: check cache, fall back to the database, populate the cache",
          "TTLs and invalidating or updating entries on write",
          "What is worth caching: read-heavy, rarely changing, expensive to compute",
          "Cache layers: browser, CDN, application, and database",
        ],
        practice:
          "Add a cache-aside layer (Redis or an in-memory map with TTL) in front of a slow function, measure hit rate and latency, and invalidate the entry when the underlying data is updated.",
      },
      {
        topicId: "system-design-scaling",
        title: "Scale out with load balancing",
        minutes: 60,
        summary: "Understand how to handle more traffic by adding servers rather than only bigger ones.",
        learn: [
          "Vertical vs horizontal scaling and their limits",
          "Load balancers and strategies such as round robin and least connections",
          "Stateless services and moving session state to a shared store",
          "Database read replicas and single points of failure",
        ],
        practice:
          "Run two instances of a small API on different ports behind a local reverse proxy (such as Nginx), confirm requests alternate, and move any in-memory session state to a shared store so logins survive.",
      },
      {
        topicId: "system-design-queues",
        title: "Move slow work to queues",
        minutes: 75,
        summary: "Use asynchronous processing to keep requests fast and systems resilient.",
        learn: [
          "Producers, consumers, and message queues",
          "Which work belongs in the background: emails, reports, image processing",
          "At-least-once delivery, retries, and dead-letter queues",
          "Designing idempotent consumers so duplicates are harmless",
        ],
        practice:
          "Change an endpoint that sends an email synchronously so it enqueues a job instead, write a worker that processes the job idempotently, and simulate a duplicate message to prove it is handled once.",
      },
      {
        topicId: null,
        title: "Challenge: design a URL shortener",
        minutes: 120,
        summary: "Produce an entry-level system design that ties storage, caching, scaling, and queues together.",
        learn: [
          "Clarifying requirements and estimating reads, writes, and storage",
          "Drawing a simple architecture diagram with clear data flow",
          "Explaining trade-offs and identifying bottlenecks",
        ],
        practice:
          "Design a URL shortener for 10 million links and 1,000 redirects per second: choose and justify the database and schema, add caching for hot links, show how the API scales behind a load balancer, push click analytics through a queue, and present it as a one-page diagram with written trade-offs.",
      },
    ],
  },
];
