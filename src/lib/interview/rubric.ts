/**
 * The shared rubric. One rubric for every interview, so results are comparable
 * across candidates and across AI and (later) human evaluation.
 */
export const RUBRIC_VERSION = "interview-rubric-v1";

export type RubricDimension = {
  id: string;
  label: string;
  question: string;
  /** What each score means. Index = score, 0-4. */
  anchors: [string, string, string, string, string];
};

export const RUBRIC: RubricDimension[] = [
  {
    id: "relevance",
    label: "Relevance",
    question: "Did the answer address the question that was asked?",
    anchors: [
      "Did not answer the question",
      "Touched the topic but drifted",
      "Answered the question broadly",
      "Answered directly and stayed on it",
      "Answered directly and anticipated the follow-up",
    ],
  },
  {
    id: "depth",
    label: "Technical depth",
    question: "Does the answer show real understanding, not recall?",
    anchors: [
      "No substance or factually wrong",
      "Definitions only",
      "Correct with some reasoning",
      "Explains why, not just what",
      "Explains trade-offs and when it breaks down",
    ],
  },
  {
    id: "evidence",
    label: "Concrete evidence",
    question: "Is it grounded in something they actually did?",
    anchors: [
      "Entirely abstract",
      "Vague reference to experience",
      "One concrete example",
      "Specific example with detail",
      "Specific example with a measurable outcome",
    ],
  },
  {
    id: "structure",
    label: "Structure",
    question: "Is it organised enough for an interviewer to follow?",
    anchors: [
      "Hard to follow",
      "Rambling but followable",
      "Reasonably ordered",
      "Clear beginning, middle, end",
      "Tight structure, e.g. situation → action → result",
    ],
  },
  {
    id: "communication",
    label: "Communication",
    question: "Is it clear, professional and appropriately concise?",
    anchors: [
      "Unclear or unprofessional",
      "Understandable with effort",
      "Clear",
      "Clear and well-pitched to the listener",
      "Clear, precise and persuasive",
    ],
  },
];

export const MAX_PER_DIMENSION = 4;

/** Dimensions that only apply when the prompt is technical. */
const TECHNICAL_ONLY = new Set(["depth"]);

export function dimensionsFor(kind: "behavioural" | "technical" | "situational"): RubricDimension[] {
  return kind === "technical" ? RUBRIC : RUBRIC.filter((d) => !TECHNICAL_ONLY.has(d.id));
}

/** Rubric scores (0-4 per dimension) → a 0-100 score. */
export function rubricToScore(rubric: Record<string, number>, kind: "behavioural" | "technical" | "situational"): number {
  const dims = dimensionsFor(kind);
  const total = dims.reduce((n, d) => n + Math.min(Math.max(rubric[d.id] ?? 0, 0), MAX_PER_DIMENSION), 0);
  return Math.round((total / (dims.length * MAX_PER_DIMENSION)) * 100);
}
