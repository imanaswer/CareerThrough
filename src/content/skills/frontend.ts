import type { Skill, Question, SkillPlan } from "../taxonomy";

export const skills: Skill[] = [
  {
    id: "html-css",
    name: "HTML & CSS",
    dimension: "technical",
    description:
      "Can build accessible, well-structured pages and style them into responsive layouts without relying on a framework.",
    topics: [
      { id: "html-css-semantic-html", name: "Semantic HTML & Accessibility" },
      { id: "html-css-box-model-cascade", name: "Box Model, Cascade & Specificity" },
      { id: "html-css-layout", name: "Layout with Flexbox & Grid" },
      { id: "html-css-responsive", name: "Responsive Design" },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    dimension: "technical",
    description:
      "Can read, write and debug modern JavaScript, including data transformation, closures and asynchronous code.",
    topics: [
      { id: "javascript-types-scope", name: "Types, Coercion & Scope" },
      { id: "javascript-functions-closures", name: "Functions & Closures" },
      { id: "javascript-arrays-objects", name: "Arrays & Objects" },
      { id: "javascript-async", name: "Asynchronous JavaScript" },
    ],
  },
  {
    id: "react",
    name: "React",
    dimension: "technical",
    description:
      "Can build interactive UIs from components, manage state and side effects correctly, and debug common rendering bugs.",
    topics: [
      { id: "react-components-props", name: "Components, JSX & Props" },
      { id: "react-state", name: "State & Re-rendering" },
      { id: "react-effects", name: "Effects & Lifecycle" },
      { id: "react-lists-forms", name: "Lists, Keys & Forms" },
    ],
  },
  {
    id: "typescript",
    name: "TypeScript",
    dimension: "technical",
    description:
      "Can add and read static types in a real codebase, interpret compiler errors and model data safely.",
    topics: [
      { id: "typescript-basic-types", name: "Basic Types & Inference" },
      { id: "typescript-object-types", name: "Interfaces & Object Types" },
      { id: "typescript-unions-narrowing", name: "Unions & Narrowing" },
      { id: "typescript-generics", name: "Generics & Utility Types" },
    ],
  },
  {
    id: "web-apis",
    name: "Working with Web APIs",
    dimension: "technical",
    description:
      "Can consume REST APIs from the browser, handle loading and failure states, and use core browser APIs.",
    topics: [
      { id: "web-apis-http-rest", name: "HTTP & REST Basics" },
      { id: "web-apis-fetch", name: "Making Requests with fetch" },
      { id: "web-apis-errors-states", name: "Error Handling & Loading States" },
      { id: "web-apis-browser-apis", name: "Browser APIs: Storage & Events" },
    ],
  },
  {
    id: "git",
    name: "Git & Version Control",
    dimension: "technical",
    description:
      "Can track work with commits and branches, collaborate through a shared remote, and safely recover from mistakes.",
    topics: [
      { id: "git-commits", name: "Staging & Committing" },
      { id: "git-branches", name: "Branching & Merging" },
      { id: "git-remotes", name: "Remotes & Collaboration" },
      { id: "git-undoing", name: "Undoing Changes" },
    ],
  },
];

export const questions: Question[] = [
  // ---------- HTML & CSS ----------
  {
    id: "html-css-q1",
    skillId: "html-css",
    topicId: "html-css-semantic-html",
    prompt:
      "You are marking up the main site menu (Home, Courses, Contact). Which element should wrap the list of links so assistive technology exposes it as a navigation landmark?",
    options: ["<div class='nav'>", "<nav>", "<section>", "<menu>"],
    answer: 1,
    explanation:
      "<nav> is the semantic element for major navigation blocks and is exposed to screen readers as a navigation landmark; a div with a class carries no meaning.",
  },
  {
    id: "html-css-q2",
    skillId: "html-css",
    topicId: "html-css-semantic-html",
    prompt:
      "A screen-reader user reports that this field is announced only as 'edit text':\n\n<span>Email</span>\n<input type='email' id='email'>\n\nWhich change fixes it?",
    options: [
      "Add name='email' to the input",
      "Add tabindex='0' to the input",
      "Make the span bold so it is clearly the field title",
      "Replace the span with <label for='email'>Email</label>",
    ],
    answer: 3,
    explanation:
      "A <label> whose for attribute matches the input's id programmatically associates the text with the field, giving it an accessible name. name and tabindex do not label the control.",
  },
  {
    id: "html-css-q3",
    skillId: "html-css",
    topicId: "html-css-box-model-cascade",
    prompt:
      "What is the total rendered width of this element?\n\n.box {\n  box-sizing: content-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n}",
    options: ["250px", "200px", "225px", "240px"],
    answer: 0,
    explanation:
      "With content-box, width applies to the content only, so padding (20 + 20) and border (5 + 5) are added: 200 + 40 + 10 = 250px.",
  },
  {
    id: "html-css-q4",
    skillId: "html-css",
    topicId: "html-css-box-model-cascade",
    prompt:
      "Given this markup and CSS, what colour is the paragraph text?\n\n<div id='main'><p class='text highlight'>Hi</p></div>\n\n.text.highlight { color: blue; }\n#main p { color: red; }\np.text { color: green; }",
    options: ["Blue, because it uses two classes", "Green, because it is declared last", "Red, because an ID selector outweighs any number of classes", "Black, because the rules conflict and cancel out"],
    answer: 2,
    explanation:
      "Specificity is compared ID-first: '#main p' (1,0,1) beats '.text.highlight' (0,2,0) and 'p.text' (0,1,1). Source order only matters when specificity ties.",
  },
  {
    id: "html-css-q5",
    skillId: "html-css",
    topicId: "html-css-layout",
    prompt:
      "You need to centre a single child both horizontally and vertically inside a full-height container. Which CSS on the container does this?",
    options: [
      "display: block; text-align: center; vertical-align: middle;",
      "display: flex; justify-content: center; align-items: center;",
      "display: flex; flex-direction: center;",
      "display: inline; margin: auto;",
    ],
    answer: 1,
    explanation:
      "In a flex container, justify-content centres along the main axis and align-items along the cross axis. vertical-align has no effect on block-level boxes and 'center' is not a flex-direction value.",
  },
  {
    id: "html-css-q6",
    skillId: "html-css",
    topicId: "html-css-layout",
    prompt:
      "A container has the CSS below and 7 child items. How many rows will the grid have?\n\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}",
    options: ["1", "2", "7", "3"],
    answer: 3,
    explanation:
      "Three equal columns are defined, and items auto-place left to right, creating implicit rows as needed: 3 + 3 + 1 items gives 3 rows.",
  },
  {
    id: "html-css-q7",
    skillId: "html-css",
    topicId: "html-css-responsive",
    prompt:
      "With this mobile-first CSS, how wide is .card on a 600px-wide viewport?\n\n.card { width: 100%; }\n@media (min-width: 768px) {\n  .card { width: 50%; }\n}",
    options: ["100% of its container", "50% of its container", "768px", "600px regardless of its container"],
    answer: 0,
    explanation:
      "The media query only applies at viewport widths of 768px and above. At 600px only the base rule matches, so the card is 100% of its container.",
  },
  {
    id: "html-css-q8",
    skillId: "html-css",
    topicId: "html-css-responsive",
    prompt:
      "Your media queries work when you resize a desktop browser, but on a real phone the page renders as a tiny zoomed-out desktop layout. What is most likely missing?",
    options: [
      "A CSS reset stylesheet",
      "max-width: 100% on the body element",
      "<meta name='viewport' content='width=device-width, initial-scale=1'> in the head",
      "The !important flag on the rules inside the media queries",
    ],
    answer: 2,
    explanation:
      "Without the viewport meta tag, mobile browsers lay the page out on a virtual viewport of roughly 980px and scale it down, so small-screen media queries never match.",
  },

  // ---------- JavaScript ----------
  {
    id: "javascript-q1",
    skillId: "javascript",
    topicId: "javascript-types-scope",
    prompt: "What does this log?\n\nconsole.log(1 + '2' - 1);",
    options: ["'121'", "2", "11", "NaN"],
    answer: 2,
    explanation:
      "+ with a string concatenates, so 1 + '2' is '12'. The - operator only works on numbers, so '12' is coerced to 12 and 12 - 1 is 11.",
  },
  {
    id: "javascript-q2",
    skillId: "javascript",
    topicId: "javascript-types-scope",
    prompt: "What happens when this script runs?\n\nconsole.log(a);\nconsole.log(b);\nvar a = 1;\nlet b = 2;",
    options: [
      "Logs undefined, then throws a ReferenceError",
      "Logs 1, then 2",
      "Logs undefined twice",
      "Throws a ReferenceError before logging anything",
    ],
    answer: 0,
    explanation:
      "var declarations are hoisted and initialised to undefined, so the first log prints undefined. let is hoisted but stays in the temporal dead zone until its declaration, so reading b throws a ReferenceError.",
  },
  {
    id: "javascript-q3",
    skillId: "javascript",
    topicId: "javascript-functions-closures",
    prompt:
      "What does this log?\n\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst a = makeCounter();\nconst b = makeCounter();\na();\na();\nconsole.log(b());",
    options: ["3", "1", "2", "0"],
    answer: 1,
    explanation:
      "Each call to makeCounter creates a new scope with its own count variable. b's closure has never been called before, so it increments its own count from 0 to 1.",
  },
  {
    id: "javascript-q4",
    skillId: "javascript",
    topicId: "javascript-functions-closures",
    prompt:
      "This code logs 3, 3, 3. Which single change makes it log 0, 1, 2?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}",
    options: [
      "Change the timeout delay from 0 to 100",
      "Replace the arrow function with a regular function expression",
      "Change i++ to ++i",
      "Change var to let",
    ],
    answer: 3,
    explanation:
      "var is function-scoped, so all three callbacks close over the same i, which is 3 by the time they run. let creates a fresh binding per loop iteration, so each callback sees its own value.",
  },
  {
    id: "javascript-q5",
    skillId: "javascript",
    topicId: "javascript-arrays-objects",
    prompt: "What does this log?\n\nconst result = [1, 2, 3, 4]\n  .filter(n => n % 2)\n  .map(n => n * 2);\nconsole.log(result);",
    options: ["[4, 8]", "[2, 4, 6, 8]", "[2, 6]", "[1, 3]"],
    answer: 2,
    explanation:
      "n % 2 is 1 (truthy) for odd numbers and 0 (falsy) for even ones, so filter keeps [1, 3]. map then doubles them to [2, 6].",
  },
  {
    id: "javascript-q6",
    skillId: "javascript",
    topicId: "javascript-arrays-objects",
    prompt:
      "What does this log?\n\nconst a = { user: { name: 'Al' } };\nconst b = { ...a };\nb.user.name = 'Bo';\nconsole.log(a.user.name);",
    options: ["'Bo'", "'Al'", "undefined", "It throws a TypeError because a is const"],
    answer: 0,
    explanation:
      "Object spread makes a shallow copy: b is a new object, but b.user still references the same nested object as a.user, so the mutation is visible through a.",
  },
  {
    id: "javascript-q7",
    skillId: "javascript",
    topicId: "javascript-async",
    prompt:
      "In what order are the letters logged?\n\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');",
    options: ["A, B, C, D", "A, D, C, B", "A, D, B, C", "A, C, D, B"],
    answer: 1,
    explanation:
      "Synchronous code runs first (A, D). Promise callbacks are microtasks and run as soon as the call stack empties, before the setTimeout callback, which is a macrotask.",
  },
  {
    id: "javascript-q8",
    skillId: "javascript",
    topicId: "javascript-async",
    prompt:
      "What does this log?\n\nasync function getUser() {\n  return { id: 1 };\n}\nconst user = getUser();\nconsole.log(user.id);",
    options: ["1", "{ id: 1 }", "It throws a TypeError", "undefined"],
    answer: 3,
    explanation:
      "An async function always returns a Promise. Without await (or .then), user is the Promise itself, which has no id property, so undefined is logged.",
  },

  // ---------- React ----------
  {
    id: "react-q1",
    skillId: "react",
    topicId: "react-components-props",
    prompt:
      "This component fails to compile. Which fix is correct?\n\nfunction Header() {\n  return (\n    <h1>Dashboard</h1>\n    <p>Welcome back</p>\n  );\n}",
    options: [
      "Rename the function to lowercase header",
      "Return the two elements as a comma-separated list without parentheses",
      "Wrap both elements in a fragment: <>...</>",
      "Add a key prop to each element",
    ],
    answer: 2,
    explanation:
      "A JSX expression must have a single root element. A fragment groups the siblings without adding an extra DOM node.",
  },
  {
    id: "react-q2",
    skillId: "react",
    topicId: "react-components-props",
    prompt:
      "A parent component owns a quantity state value and renders <QuantityPicker quantity={quantity} />. The picker's '+' button needs to increase the quantity. What is the correct approach?",
    options: [
      "Pass a callback such as onIncrease from the parent and call it in the child's click handler",
      "Reassign props.quantity inside the child's click handler",
      "Copy the prop into a global variable that both components read",
      "Call the parent component function directly from the child to re-render it",
    ],
    answer: 0,
    explanation:
      "Props are read-only and data flows down. The component that owns the state passes a function down, and the child calls it to request the change.",
  },
  {
    id: "react-q3",
    skillId: "react",
    topicId: "react-state",
    prompt:
      "count starts at 0. What is it after one click?\n\nconst [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}",
    options: ["3", "0", "It causes an infinite render loop", "1"],
    answer: 3,
    explanation:
      "count is a constant (0) for the whole render, so all three calls set the state to 1. To get 3 you would use the updater form: setCount(c => c + 1).",
  },
  {
    id: "react-q4",
    skillId: "react",
    topicId: "react-state",
    prompt:
      "Clicking 'Add' does not update the list on screen. What is the fix?\n\nconst [items, setItems] = useState([]);\nfunction add(item) {\n  items.push(item);\n  setItems(items);\n}",
    options: [
      "Call setItems twice so React notices the change",
      "Create a new array instead: setItems([...items, item])",
      "Declare items with let instead of const",
      "Wrap items.push in a useEffect",
    ],
    answer: 1,
    explanation:
      "React compares state by reference. Mutating the array and passing the same reference back means React sees no change and skips the re-render; a new array triggers one.",
  },
  {
    id: "react-q5",
    skillId: "react",
    topicId: "react-effects",
    prompt:
      "The network tab shows this component requesting /api/courses endlessly. Which fix is correct?\n\nuseEffect(() => {\n  fetch('/api/courses')\n    .then(r => r.json())\n    .then(setCourses);\n});",
    options: [
      "Pass an empty dependency array as the second argument: useEffect(..., [])",
      "Move the fetch call out of useEffect into the component body",
      "Replace useEffect with useMemo",
      "Pass [courses] as the dependency array",
    ],
    answer: 0,
    explanation:
      "With no dependency array the effect runs after every render; setCourses triggers a render, which runs the effect again. An empty array runs it only once after mount. Depending on courses would still loop, since each response is a new array.",
  },
  {
    id: "react-q6",
    skillId: "react",
    topicId: "react-effects",
    prompt:
      "After navigating away from this component, its timer keeps firing. What is missing?\n\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n}, []);",
    options: [
      "The effect should be marked async",
      "tick should be listed in the dependency array",
      "The effect should return a cleanup function: return () => clearInterval(id);",
      "setInterval should be replaced by setTimeout",
    ],
    answer: 2,
    explanation:
      "React runs the function returned from an effect when the component unmounts (and before the effect re-runs). Without it, subscriptions and timers leak.",
  },
  {
    id: "react-q7",
    skillId: "react",
    topicId: "react-lists-forms",
    prompt:
      "A sortable to-do list renders rows with todos.map((t, i) => <TodoRow key={i} todo={t} />). Each row has its own text input. After re-sorting, typed text appears in the wrong rows. What is the best fix?",
    options: [
      "Remove the key prop entirely",
      "Use key={Math.random()}",
      "Wrap TodoRow in React.memo",
      "Use a stable unique id from the data: key={t.id}",
    ],
    answer: 3,
    explanation:
      "Keys tell React which item each component instance belongs to. Index keys stay in the same positions after reordering, so local state sticks to the position, not the item. Random keys would remount every row on every render.",
  },
  {
    id: "react-q8",
    skillId: "react",
    topicId: "react-lists-forms",
    prompt:
      "Users cannot type into this field. Why?\n\nconst [name, setName] = useState('');\nreturn <input value={name} />;",
    options: [
      "useState('') makes the input permanently empty until a default is supplied",
      "The input is controlled by state but has no onChange handler to update that state",
      "Inputs must be wrapped in a <form> element to accept typing",
      "The value prop only works on <textarea> elements",
    ],
    answer: 1,
    explanation:
      "Setting value makes the input controlled: React forces it to show the state value. Without onChange={e => setName(e.target.value)} the state never changes, so the field appears frozen.",
  },

  // ---------- TypeScript ----------
  {
    id: "typescript-q1",
    skillId: "typescript",
    topicId: "typescript-basic-types",
    prompt: "What happens when this code is compiled?\n\nlet id = 5;\nid = '5';",
    options: [
      "It compiles, because id has no type annotation and is therefore any",
      "It compiles, and id becomes the union type number | string",
      "It compiles, but throws at runtime",
      "Compile error: type 'string' is not assignable to type 'number'",
    ],
    answer: 3,
    explanation:
      "TypeScript infers the type number from the initial value, so later assigning a string is a type error even without an explicit annotation.",
  },
  {
    id: "typescript-q2",
    skillId: "typescript",
    topicId: "typescript-basic-types",
    prompt:
      "This function does not compile. Which change makes it compile while keeping it type-safe?\n\nfunction shout(v: unknown) {\n  return v.toUpperCase();\n}",
    options: [
      "Guard first: if (typeof v === 'string') return v.toUpperCase();",
      "Change the parameter type to any",
      "Use optional chaining: v?.toUpperCase()",
      "Use a non-null assertion: v!.toUpperCase()",
    ],
    answer: 0,
    explanation:
      "unknown must be narrowed before use; a typeof check narrows v to string. any compiles but switches type checking off, and ?. or ! do not narrow unknown.",
  },
  {
    id: "typescript-q3",
    skillId: "typescript",
    topicId: "typescript-object-types",
    prompt:
      "With strict mode on, what does the compiler report?\n\ninterface User {\n  name: string;\n  email?: string;\n}\nfunction domain(u: User) {\n  return u.email.split('@')[1];\n}",
    options: [
      "Nothing; the code compiles",
      "Error: property 'email' does not exist on type 'User'",
      "Error: 'u.email' is possibly 'undefined'",
      "Error: interfaces cannot have optional properties",
    ],
    answer: 2,
    explanation:
      "An optional property has type string | undefined, so calling a method on it without a check is an error under strictNullChecks. Use u.email?.split(...) or guard first.",
  },
  {
    id: "typescript-q4",
    skillId: "typescript",
    topicId: "typescript-object-types",
    prompt:
      "What happens when this is compiled?\n\ninterface Course {\n  title: string;\n}\nconst c: Course = { title: 'Intro to CSS', price: 20 };",
    options: [
      "It compiles, because structural typing always allows extra properties",
      "Compile error: object literal may only specify known properties, and 'price' does not exist in type 'Course'",
      "It compiles, and price is silently removed from the object",
      "Compile error: 'title' must be declared readonly",
    ],
    answer: 1,
    explanation:
      "Object literals assigned directly to a typed target get excess property checking, which catches typos and stray fields. Extra properties are only tolerated when assigning an existing variable.",
  },
  {
    id: "typescript-q5",
    skillId: "typescript",
    topicId: "typescript-unions-narrowing",
    prompt:
      "Why is s.side allowed on the last line without an error?\n\ntype Shape =\n  | { kind: 'circle'; r: number }\n  | { kind: 'square'; side: number };\n\nfunction area(s: Shape) {\n  if (s.kind === 'circle') return Math.PI * s.r ** 2;\n  return s.side ** 2;\n}",
    options: [
      "TypeScript does not check property access on union types",
      "side exists on both members of the union",
      "The function's return type is inferred as any",
      "After the 'circle' branch returns, control flow narrows s to the 'square' member",
    ],
    answer: 3,
    explanation:
      "kind is a discriminant. Checking it narrows the union, and because the circle branch returns, the compiler knows s can only be the square variant afterwards.",
  },
  {
    id: "typescript-q6",
    skillId: "typescript",
    topicId: "typescript-unions-narrowing",
    prompt:
      "This does not compile. Which fix is correct?\n\nfunction format(id: string | number) {\n  return id.toFixed(2);\n}",
    options: [
      "Change the parameter to id: string & number",
      "Add a return type annotation of string",
      "Narrow first: return typeof id === 'number' ? id.toFixed(2) : id;",
      "Mark the parameter optional: id?: string | number",
    ],
    answer: 2,
    explanation:
      "Only members common to every type in a union are accessible. toFixed exists only on number, so you must narrow with typeof before calling it.",
  },
  {
    id: "typescript-q7",
    skillId: "typescript",
    topicId: "typescript-generics",
    prompt:
      "What is the inferred type of x?\n\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nconst x = first(['a', 'b']);",
    options: ["string | undefined", "any", "string[]", "T | undefined"],
    answer: 0,
    explanation:
      "T is inferred as string from the argument string[], so the return type T | undefined resolves to string | undefined at the call site.",
  },
  {
    id: "typescript-q8",
    skillId: "typescript",
    topicId: "typescript-generics",
    prompt:
      "You are writing updateUser(id: string, changes: ???), where changes may contain any subset of the fields of an existing User interface. Which type fits best?",
    options: ["Required<User>", "Partial<User>", "Readonly<User>", "Record<string, User>"],
    answer: 1,
    explanation:
      "Partial<T> makes every property of T optional, which models 'some subset of fields' while still rejecting unknown keys and wrong value types.",
  },

  // ---------- Web APIs ----------
  {
    id: "web-apis-q1",
    skillId: "web-apis",
    topicId: "web-apis-http-rest",
    prompt:
      "Your app sends POST /api/tasks and the server successfully creates a new task. Which status code is the most appropriate response?",
    options: ["204 No Content", "304 Not Modified", "201 Created", "302 Found"],
    answer: 2,
    explanation:
      "201 Created signals that the request succeeded and a new resource was created, usually returning the resource or its location.",
  },
  {
    id: "web-apis-q2",
    skillId: "web-apis",
    topicId: "web-apis-http-rest",
    prompt: "GET /api/orders returns 401 Unauthorized. What is the most likely cause?",
    options: [
      "The request is missing a valid authentication token",
      "The /api/orders endpoint does not exist",
      "You are logged in but your role is not permitted to view orders",
      "The server crashed while handling the request",
    ],
    answer: 0,
    explanation:
      "401 means the request lacks valid authentication credentials. A missing route is 404, an authenticated user without permission is 403, and a server crash is 500.",
  },
  {
    id: "web-apis-q3",
    skillId: "web-apis",
    topicId: "web-apis-fetch",
    prompt: "Which call correctly sends the object task as JSON to a REST API?",
    options: [
      "fetch('/api/tasks', { method: 'POST', body: task })",
      "fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(task) })",
      "fetch('/api/tasks', { method: 'GET', body: JSON.stringify(task) })",
      "fetch('/api/tasks', { method: 'POST', json: task })",
    ],
    answer: 1,
    explanation:
      "fetch does not serialise objects for you: the body must be a JSON string and the Content-Type header tells the server how to parse it. GET requests cannot have a body, and fetch has no json option.",
  },
  {
    id: "web-apis-q4",
    skillId: "web-apis",
    topicId: "web-apis-fetch",
    prompt:
      "A search box holds user input in q, for example 'c++ & java'. Which line builds the request URL safely?",
    options: [
      "const url = '/api/search?q=' + q;",
      "const url = '/api/search?q=' + JSON.stringify(q);",
      "const url = '/api/search?q=' + q.trim();",
      "const url = '/api/search?' + new URLSearchParams({ q });",
    ],
    answer: 3,
    explanation:
      "URLSearchParams percent-encodes special characters such as &, + and spaces. Concatenating raw input would let '&' split the value into a second parameter and '+' be read as a space.",
  },
  {
    id: "web-apis-q5",
    skillId: "web-apis",
    topicId: "web-apis-errors-states",
    prompt:
      "The server responds to this request with 404 and a JSON error body. What happens?\n\ntry {\n  const res = await fetch('/api/users/999');\n  const data = await res.json();\n  showUser(data);\n} catch (e) {\n  showError();\n}",
    options: [
      "showUser is called with the error body, because fetch only rejects on network failures",
      "showError is called, because fetch rejects on any 4xx or 5xx status",
      "Neither function is called; the promise stays pending",
      "res.json() throws because a 404 response cannot have a body",
    ],
    answer: 0,
    explanation:
      "fetch resolves for any HTTP response, including 404 and 500. You must check res.ok (or res.status) yourself and throw or branch before treating the body as success data.",
  },
  {
    id: "web-apis-q6",
    skillId: "web-apis",
    topicId: "web-apis-errors-states",
    prompt:
      "When the request fails, the spinner never disappears. Which fix is best?\n\nsetLoading(true);\ntry {\n  const data = await loadCourses();\n  setCourses(data);\n  setLoading(false);\n} catch (e) {\n  setError('Could not load courses');\n}",
    options: [
      "Remove the try/catch so the error surfaces",
      "Call setLoading(false) before awaiting loadCourses()",
      "Move setLoading(false) into a finally block",
      "Wrap loadCourses() in a setTimeout",
    ],
    answer: 2,
    explanation:
      "When loadCourses throws, execution jumps to catch and skips setLoading(false). A finally block runs on both success and failure, so the loading state is always cleared.",
  },
  {
    id: "web-apis-q7",
    skillId: "web-apis",
    topicId: "web-apis-browser-apis",
    prompt:
      "What does this log?\n\nlocalStorage.setItem('user', { name: 'Ana' });\nconsole.log(localStorage.getItem('user'));",
    options: ["{ name: 'Ana' }", "'[object Object]'", "null", "It throws a TypeError"],
    answer: 1,
    explanation:
      "localStorage stores only strings, so the object is converted with String(), producing '[object Object]'. Use JSON.stringify when saving and JSON.parse when reading.",
  },
  {
    id: "web-apis-q8",
    skillId: "web-apis",
    topicId: "web-apis-browser-apis",
    prompt:
      "Submitting this form reloads the page and the fetch request is cancelled. What is the fix?\n\nform.addEventListener('submit', async (e) => {\n  await fetch('/api/signup', { method: 'POST', body: new FormData(form) });\n});",
    options: [
      "Return false at the end of the async handler",
      "Listen for the 'click' event on the form instead of 'submit'",
      "Remove the await keyword",
      "Call e.preventDefault() at the start of the handler",
    ],
    answer: 3,
    explanation:
      "A form's default submit action navigates the page, which aborts in-flight requests. e.preventDefault() stops that so JavaScript can handle the submission. Returning false has no effect in addEventListener handlers.",
  },

  // ---------- Git ----------
  {
    id: "git-q1",
    skillId: "git",
    topicId: "git-commits",
    prompt:
      "You edit report.txt and notes.txt, then run:\n\ngit add report.txt\ngit commit -m 'Update report'\n\nWhat is the state of notes.txt afterwards?",
    options: [
      "It was included in the commit, because commit captures all modified files",
      "Its edits were discarded by the commit",
      "It is still modified in the working directory and is not part of the commit",
      "It is staged and will be included in the next push",
    ],
    answer: 2,
    explanation:
      "git commit records only what is in the staging area. notes.txt was never added, so its changes remain as unstaged modifications.",
  },
  {
    id: "git-q2",
    skillId: "git",
    topicId: "git-commits",
    prompt:
      "A file named secrets.env was committed earlier. You add secrets.env to .gitignore, but git status still reports changes to it. Why, and what fixes it?",
    options: [
      ".gitignore only affects untracked files; run git rm --cached secrets.env and commit",
      ".gitignore changes only take effect after the next git push",
      "The .gitignore file must be located inside the .git folder",
      "Ignore rules need a leading '!' to take effect; change the line to !secrets.env",
    ],
    answer: 0,
    explanation:
      "Once a file is tracked, ignore rules do not apply to it. git rm --cached removes it from the index while keeping it on disk, after which .gitignore takes effect.",
  },
  {
    id: "git-q3",
    skillId: "git",
    topicId: "git-branches",
    prompt: "Which single command creates a new branch called feature/login and switches to it?",
    options: [
      "git branch feature/login",
      "git merge feature/login",
      "git push origin feature/login",
      "git switch -c feature/login",
    ],
    answer: 3,
    explanation:
      "git switch -c (or the older git checkout -b) creates the branch and checks it out in one step. git branch alone creates it but leaves you on the current branch.",
  },
  {
    id: "git-q4",
    skillId: "git",
    topicId: "git-branches",
    prompt:
      "git merge feature stops with 'CONFLICT (content): Merge conflict in plan.md'. What is the correct way to finish the merge?",
    options: [
      "Run git merge feature again until it succeeds",
      "Edit plan.md to resolve the conflict markers, git add plan.md, then git commit",
      "Delete plan.md and run git push",
      "Run git branch -D feature and then git commit",
    ],
    answer: 1,
    explanation:
      "Git pauses the merge so you can choose the final content. After editing the file, staging it marks the conflict as resolved, and committing completes the merge.",
  },
  {
    id: "git-q5",
    skillId: "git",
    topicId: "git-remotes",
    prompt:
      "git push to a shared branch is rejected with 'Updates were rejected because the remote contains work that you do not have locally'. What is the appropriate next step?",
    options: [
      "Run git pull (or git pull --rebase) to integrate the remote commits, then push again",
      "Run git push --force to overwrite the remote branch",
      "Delete the local repository and clone it again, discarding your commits",
      "Run git commit --amend and push again",
    ],
    answer: 0,
    explanation:
      "The remote branch has commits you do not have. Integrating them first keeps everyone's work; force-pushing a shared branch would erase your teammates' commits.",
  },
  {
    id: "git-q6",
    skillId: "git",
    topicId: "git-remotes",
    prompt:
      "You want to see what teammates have pushed to origin/main without changing your current branch or working files. Which command do you run?",
    options: ["git pull origin main", "git merge origin/main", "git fetch origin", "git reset --hard origin/main"],
    answer: 2,
    explanation:
      "git fetch downloads new commits and updates remote-tracking branches such as origin/main only. git pull is fetch plus a merge into your current branch.",
  },
  {
    id: "git-q7",
    skillId: "git",
    topicId: "git-undoing",
    prompt:
      "A commit that breaks the build has already been pushed to the shared main branch, and teammates have pulled it. What is the safest way to undo it?",
    options: [
      "git reset --hard HEAD~1 followed by git push --force",
      "git revert <commit-sha> and push the new commit",
      "Delete the main branch on the remote and re-create it",
      "git commit --amend and push",
    ],
    answer: 1,
    explanation:
      "git revert adds a new commit that reverses the bad one, leaving shared history intact. Resetting or amending rewrites history others already have and requires a force push.",
  },
  {
    id: "git-q8",
    skillId: "git",
    topicId: "git-undoing",
    prompt:
      "You just committed locally (nothing pushed yet) and realise you forgot to include config.json. What is the cleanest fix?",
    options: [
      "git revert HEAD, then commit everything again",
      "git stash, then git push",
      "git reset --hard HEAD~1, then redo all of the work",
      "git add config.json, then git commit --amend",
    ],
    answer: 3,
    explanation:
      "--amend replaces the most recent commit with one that also contains the newly staged file. It is safe here because the commit has not been shared yet.",
  },
];

export const plans: SkillPlan[] = [
  {
    skillId: "html-css",
    days: [
      {
        topicId: "html-css-semantic-html",
        title: "Structure pages with semantic HTML",
        minutes: 60,
        summary: "Learn to choose elements by meaning so pages are accessible and easy to style.",
        learn: [
          "Landmark elements: header, nav, main, section, article, aside, footer",
          "Heading hierarchy (h1-h6) and why skipping levels hurts navigation",
          "Labelling form controls with label/for, and when to use button versus a link",
          "Alt text for images and the basics of keyboard focus order",
        ],
        practice:
          "Mark up a course landing page (header with nav, hero, three feature articles, signup form, footer) using no div where a semantic element fits, then tab through it with the keyboard only.",
      },
      {
        topicId: "html-css-box-model-cascade",
        title: "Master the box model and the cascade",
        minutes: 75,
        summary: "Understand how element sizes are computed and which CSS rule wins when several match.",
        learn: [
          "Content, padding, border and margin, and content-box versus border-box",
          "Specificity scoring for element, class and ID selectors, plus source order",
          "Inheritance and which properties inherit by default",
          "Margin collapsing and inspecting computed styles in browser DevTools",
        ],
        practice:
          "Style a pricing card, then write three conflicting colour rules for its title and predict the winner before checking it in the DevTools Styles panel.",
      },
      {
        topicId: "html-css-layout",
        title: "Build layouts with Flexbox and Grid",
        minutes: 90,
        summary: "Use Flexbox for one-dimensional alignment and Grid for two-dimensional page structure.",
        learn: [
          "Flex container properties: flex-direction, justify-content, align-items, gap, flex-wrap",
          "Flex item sizing with flex-grow, flex-shrink and flex-basis",
          "Grid tracks with grid-template-columns, fr units, repeat() and implicit rows",
          "Choosing between Flexbox and Grid for a given layout problem",
        ],
        practice:
          "Build a navbar with logo left and links right using Flexbox, and a three-column card gallery with Grid, without using floats or fixed pixel positions.",
      },
      {
        topicId: "html-css-responsive",
        title: "Make layouts responsive",
        minutes: 75,
        summary: "Adapt a single codebase to phone, tablet and desktop screens using a mobile-first approach.",
        learn: [
          "The viewport meta tag and why mobile browsers need it",
          "Mobile-first media queries using min-width breakpoints",
          "Relative units (%, rem, vw) and fluid images with max-width: 100%",
          "Responsive grids with repeat(auto-fit, minmax())",
        ],
        practice:
          "Take yesterday's gallery and make it one column on phones, two on tablets and three on desktop, verifying each breakpoint in DevTools device mode.",
      },
      {
        topicId: null,
        title: "Challenge: responsive portfolio page",
        minutes: 120,
        summary: "Combine semantics, the cascade, layout and responsiveness in one complete page.",
        learn: [
          "Planning a page as landmarks first, then components",
          "Organising a stylesheet: base styles, layout, components, media queries",
          "Running an accessibility check with the Lighthouse panel in DevTools",
        ],
        practice:
          "Build a personal portfolio page from scratch with a nav, hero, project grid and labelled contact form that works from 360px to 1440px wide and scores at least 90 for accessibility in Lighthouse.",
      },
    ],
  },
  {
    skillId: "javascript",
    days: [
      {
        topicId: "javascript-types-scope",
        title: "Types, coercion and scope",
        minutes: 60,
        summary: "Understand how JavaScript values behave and where variables are visible.",
        learn: [
          "Primitive types versus objects, and what typeof returns for each",
          "Implicit coercion with +, - and ==, and why === is preferred",
          "var versus let versus const: function scope, block scope and hoisting",
          "The temporal dead zone and truthy/falsy values",
        ],
        practice:
          "Write ten short expressions mixing strings, numbers, null and undefined, predict each result on paper, then verify them in the browser console and note every surprise.",
      },
      {
        topicId: "javascript-functions-closures",
        title: "Functions and closures",
        minutes: 75,
        summary: "Learn how functions capture variables and why that powers callbacks and private state.",
        learn: [
          "Function declarations, expressions and arrow functions",
          "Lexical scope and how a closure keeps its outer variables alive",
          "The classic var-in-a-loop bug with setTimeout and how let fixes it",
          "Higher-order functions: passing and returning functions",
        ],
        practice:
          "Implement makeCounter() returning increment, decrement and reset functions that share a private count, and a once(fn) helper that lets fn run only the first time it is called.",
      },
      {
        topicId: "javascript-arrays-objects",
        title: "Transform data with arrays and objects",
        minutes: 90,
        summary: "Manipulate collections immutably using the methods you will use daily on the job.",
        learn: [
          "map, filter, find, some, every and reduce, and when to use each",
          "Destructuring, spread and rest syntax for arrays and objects",
          "Reference versus value: shallow copies and why nested objects are still shared",
          "Sorting with a compare function, and sort mutating the original array",
        ],
        practice:
          "Given an array of 20 order objects (id, customer, total, status), compute total revenue of paid orders, group orders by customer and list the top three customers, without using a for loop.",
      },
      {
        topicId: "javascript-async",
        title: "Asynchronous JavaScript",
        minutes: 90,
        summary: "Understand the event loop and write clear async code with promises and async/await.",
        learn: [
          "The call stack, macrotasks (setTimeout) and microtasks (promise callbacks)",
          "Creating and chaining promises with then, catch and finally",
          "async/await, and that async functions always return a promise",
          "Running tasks in parallel with Promise.all versus awaiting them in sequence",
        ],
        practice:
          "Write a delay(ms) promise helper, then a function that simulates loading three resources first sequentially and then in parallel, logging the total time taken by each approach.",
      },
      {
        topicId: null,
        title: "Challenge: interactive expense tracker",
        minutes: 120,
        summary: "Build a small vanilla JavaScript app that uses scope, closures, array methods and async code together.",
        learn: [
          "Separating state, rendering and event handling into small functions",
          "Re-rendering a list from a state array after each change",
          "Debugging with breakpoints and the console in DevTools",
        ],
        practice:
          "Build an expense tracker page where users add and delete expenses, filter by category, see a total computed with reduce, and where saving is simulated by an async function with a loading message.",
      },
    ],
  },
  {
    skillId: "react",
    days: [
      {
        topicId: "react-components-props",
        title: "Components, JSX and props",
        minutes: 60,
        summary: "Break a UI into reusable function components that receive data through props.",
        learn: [
          "JSX rules: a single root or fragment, className, and curly braces for expressions",
          "Function components and passing props, including children",
          "One-way data flow: props are read-only, and callbacks pass events up",
          "Conditional rendering with && and the ternary operator",
        ],
        practice:
          "Build a static profile page from Avatar, Badge and ProfileCard components, rendering three different people by changing only the props.",
      },
      {
        topicId: "react-state",
        title: "State and re-rendering",
        minutes: 90,
        summary: "Make components interactive with useState and understand when and why React re-renders.",
        learn: [
          "useState, and state as a snapshot fixed for each render",
          "Updater functions such as setCount(c => c + 1) for updates based on previous state",
          "Updating arrays and objects immutably with spread, map and filter",
          "Lifting state up to the closest common parent",
        ],
        practice:
          "Build a shopping cart where items can be added, have their quantity changed and be removed, with a total displayed in a sibling component that shares the lifted state.",
      },
      {
        topicId: "react-effects",
        title: "Effects and lifecycle",
        minutes: 90,
        summary: "Synchronise components with the outside world using useEffect without causing loops or leaks.",
        learn: [
          "When effects run: after render, controlled by the dependency array",
          "Missing, empty and populated dependency arrays, and how infinite loops happen",
          "Cleanup functions for timers, subscriptions and event listeners",
          "Fetching data in an effect with loading and error state",
        ],
        practice:
          "Build a stopwatch with start, stop and reset that cleans up its interval, plus a component that fetches a list from a public JSON API exactly once and shows loading and error states.",
      },
      {
        topicId: "react-lists-forms",
        title: "Lists, keys and forms",
        minutes: 75,
        summary: "Render dynamic collections correctly and handle user input with controlled components.",
        learn: [
          "Rendering arrays with map, and why keys must be stable and unique",
          "Bugs caused by using the array index as a key in reorderable lists",
          "Controlled inputs: value plus onChange, including checkboxes and selects",
          "Handling form submit, preventDefault and simple validation messages",
        ],
        practice:
          "Build a to-do app with an add form, inline editing, completion checkboxes, delete and a sort toggle, using item ids as keys, and confirm edits stay with the right item after sorting.",
      },
      {
        topicId: null,
        title: "Challenge: course browser app",
        minutes: 120,
        summary: "Combine components, state, effects and forms into one small but complete React app.",
        learn: [
          "Sketching a component tree and deciding where each piece of state lives",
          "Deriving filtered data during render instead of storing it in state",
          "Inspecting props and state with React Developer Tools",
        ],
        practice:
          "Build a course browser that fetches courses from a JSON file or public API, supports search and category filters through controlled inputs, shows loading, error and empty states, and lets users save favourites held in lifted state.",
      },
    ],
  },
  {
    skillId: "typescript",
    days: [
      {
        topicId: "typescript-basic-types",
        title: "Basic types and inference",
        minutes: 60,
        summary: "Learn what TypeScript checks for you and how to read its error messages.",
        learn: [
          "Primitive types, arrays, tuples, and annotating function parameters and returns",
          "Type inference: when annotations are needed and when they are just noise",
          "any versus unknown, and why unknown forces you to check before use",
          "Enabling strict mode and reading compiler errors from top to bottom",
        ],
        practice:
          "Convert a 40-line JavaScript utility file (string and number helpers) to TypeScript with strict mode on, fixing every error without using any.",
      },
      {
        topicId: "typescript-object-types",
        title: "Interfaces and object types",
        minutes: 75,
        summary: "Model the shape of real data with interfaces and type aliases.",
        learn: [
          "interface versus type alias, and when either is fine",
          "Optional and readonly properties, and handling possibly-undefined values",
          "Structural typing and excess property checks on object literals",
          "Typing arrays of objects and nested objects",
        ],
        practice:
          "Define User, Course and Enrollment types for a learning platform, create sample data for each, and write typed functions that look up a user's courses and safely read optional fields.",
      },
      {
        topicId: "typescript-unions-narrowing",
        title: "Unions and narrowing",
        minutes: 90,
        summary: "Represent values that can take several shapes and narrow them safely in code.",
        learn: [
          "Union types and string literal unions for states such as 'idle' | 'loading' | 'error'",
          "Narrowing with typeof, in, equality and truthiness checks",
          "Discriminated unions with a shared kind or status field",
          "Exhaustiveness checking in switch statements using never",
        ],
        practice:
          "Model a RequestState discriminated union (idle, loading, success with data, error with message) and write a render function using a switch that fails to compile if a new state is added but not handled.",
      },
      {
        topicId: "typescript-generics",
        title: "Generics and utility types",
        minutes: 90,
        summary: "Write reusable, type-safe helpers and reshape existing types instead of duplicating them.",
        learn: [
          "Generic functions and how type arguments are inferred from call sites",
          "Constraining generics with extends and keyof",
          "Built-in utility types: Partial, Required, Pick, Omit, Readonly and Record",
          "Typing a generic API response wrapper such as ApiResponse<T>",
        ],
        practice:
          "Write groupBy<T, K extends keyof T>(items, key), a typed fetchJson<T>(url) wrapper, and an updateUser function whose changes parameter is Partial<Omit<User, 'id'>>.",
      },
      {
        topicId: null,
        title: "Challenge: type a small data layer",
        minutes: 120,
        summary: "Apply every topic by building a fully typed in-memory data module with zero uses of any.",
        learn: [
          "Designing types first, then implementing functions against them",
          "Treating external data as unknown and narrowing it at the boundary",
          "Using compiler errors as a to-do list while refactoring",
        ],
        practice:
          "Build a typed task-manager module with a Task type that uses a status literal union, create, update, remove and filter functions, a generic Result<T> discriminated union for success or failure, and a parseTask(input: unknown) validator, all compiling under strict mode.",
      },
    ],
  },
  {
    skillId: "web-apis",
    days: [
      {
        topicId: "web-apis-http-rest",
        title: "HTTP and REST fundamentals",
        minutes: 60,
        summary: "Understand the request/response cycle and the conventions REST APIs follow.",
        learn: [
          "Anatomy of a request and a response: method, URL, headers, body and status",
          "GET, POST, PUT, PATCH and DELETE, and how they map to resource operations",
          "Status code families, and common codes: 200, 201, 204, 400, 401, 403, 404, 500",
          "Reading API documentation and inspecting traffic in the DevTools Network tab",
        ],
        practice:
          "Open the Network tab on any site you use, pick five API requests and write down the method, status, content type and purpose of each.",
      },
      {
        topicId: "web-apis-fetch",
        title: "Make requests with fetch",
        minutes: 75,
        summary: "Read and send JSON data from the browser using fetch and async/await.",
        learn: [
          "fetch returns a promise of a Response, and res.json() returns another promise",
          "Sending JSON: method, the Content-Type header and JSON.stringify for the body",
          "Building query strings safely with URLSearchParams",
          "Sending an Authorization header, and what CORS errors mean",
        ],
        practice:
          "Using a free public practice REST API, write functions to list, create, update and delete a post, logging the status code and parsed body for each call.",
      },
      {
        topicId: "web-apis-errors-states",
        title: "Handle errors and loading states",
        minutes: 90,
        summary: "Make data-driven UIs trustworthy by handling slow, failed and empty responses.",
        learn: [
          "fetch only rejects on network failure, so check res.ok for HTTP errors",
          "try/catch/finally with async/await, and always clearing the loading state",
          "The four UI states: loading, success, empty and error with a retry action",
          "Cancelling stale requests with AbortController",
        ],
        practice:
          "Build a user search page that shows a spinner, results, a 'no results' message or an error with a retry button, and test each state by requesting a bad URL and by going offline in DevTools.",
      },
      {
        topicId: "web-apis-browser-apis",
        title: "Browser APIs: storage and events",
        minutes: 75,
        summary: "Use built-in browser capabilities to persist data and respond to user actions.",
        learn: [
          "localStorage and sessionStorage: strings only, so use JSON.stringify and JSON.parse",
          "Event listeners, the event object, preventDefault and event delegation",
          "Reading form data with FormData",
          "Debouncing input events to avoid sending a request on every keystroke",
        ],
        practice:
          "Add debounced search-as-you-type to yesterday's page and persist the last five searches in localStorage so they survive a page refresh.",
      },
      {
        topicId: null,
        title: "Challenge: API-powered dashboard",
        minutes: 120,
        summary: "Build a small app that consumes a real public API end to end with solid state handling.",
        learn: [
          "Choosing a public API and reading its documentation for endpoints and limits",
          "Wrapping fetch in one reusable request helper that checks res.ok and parses JSON",
          "Deciding what to cache in localStorage and when to refresh it",
        ],
        practice:
          "Build a weather or country-information dashboard with a search form that uses preventDefault, a request helper with proper error handling, loading, empty and error states, and favourites saved in localStorage.",
      },
    ],
  },
  {
    skillId: "git",
    days: [
      {
        topicId: "git-commits",
        title: "Staging and committing",
        minutes: 45,
        summary: "Learn Git's three areas and record clean, meaningful snapshots of your work.",
        learn: [
          "Working directory, staging area and repository, and how git status describes them",
          "git add, git commit, git diff and git log",
          "Writing clear commit messages and keeping each commit focused on one change",
          ".gitignore, and why it does not affect files that are already tracked",
        ],
        practice:
          "Create a repository for a small project, make five focused commits with clear messages, add a .gitignore, and use git diff --staged to review each commit before making it.",
      },
      {
        topicId: "git-branches",
        title: "Branching and merging",
        minutes: 75,
        summary: "Work on changes in isolation and combine them, including resolving conflicts.",
        learn: [
          "What a branch is (a movable pointer to a commit) and what HEAD means",
          "Creating and switching branches with git switch -c and git switch",
          "Fast-forward merges versus merge commits",
          "Reading conflict markers and resolving a conflict with add and commit",
        ],
        practice:
          "Create two branches that edit the same line of a file, merge the first into main, then merge the second, resolve the conflict by hand and inspect the result with git log --graph --oneline.",
      },
      {
        topicId: "git-remotes",
        title: "Remotes and collaboration",
        minutes: 75,
        summary: "Share work through a hosted remote and follow a pull-request workflow.",
        learn: [
          "clone, remote, push, fetch and pull, and the difference between fetch and pull",
          "Remote-tracking branches such as origin/main",
          "Why pushes get rejected and how to integrate remote changes first",
          "The pull-request flow: branch, push, open a request, review, merge",
        ],
        practice:
          "Push your repository to a hosting service, create a feature branch, open a pull request, merge it, then update your local main with fetch and pull and delete the merged branch.",
      },
      {
        topicId: "git-undoing",
        title: "Undoing changes safely",
        minutes: 60,
        summary: "Recover from common mistakes without losing work or breaking shared history.",
        learn: [
          "Discarding and unstaging changes with git restore and git restore --staged",
          "Fixing the most recent local commit with git commit --amend",
          "git revert for commits already shared versus git reset for local-only commits",
          "Parking unfinished work with git stash, and finding lost commits with git reflog",
        ],
        practice:
          "In a practice repository, deliberately make and then fix each mistake: stage the wrong file, commit with a typo, commit a bad change and revert it, and recover a commit after a hard reset using reflog.",
      },
      {
        topicId: null,
        title: "Challenge: simulate a team workflow",
        minutes: 90,
        summary: "Run a full feature-branch workflow with conflicts, review and a rollback from start to finish.",
        learn: [
          "Keeping a feature branch up to date with main",
          "Writing a pull-request description that explains what changed and why",
          "Choosing the right undo tool for a given situation",
        ],
        practice:
          "Using two local clones of the same remote to act as two teammates, push conflicting changes from each, resolve the rejected push and the merge conflict, merge through a pull request, then revert one merged commit on main.",
      },
    ],
  },
];
