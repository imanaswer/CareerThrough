import { z } from "zod";

// Shared by the AI parser (structured output), the confirm form and the DB column.
const str = z.string().trim().max(400);

export const resumeSchema = z.object({
  name: str.default(""),
  headline: str.default(""),
  education: z
    .array(z.object({ institution: str, degree: str.default(""), year: str.default("") }))
    .max(10)
    .default([]),
  experience: z
    .array(z.object({ company: str, title: str.default(""), period: str.default(""), summary: z.string().trim().max(1200).default("") }))
    .max(15)
    .default([]),
  projects: z
    .array(z.object({ name: str, description: z.string().trim().max(1200).default(""), url: str.default("") }))
    .max(15)
    .default([]),
  skills: z.array(str).max(60).default([]),
  certifications: z.array(str).max(20).default([]),
  links: z.array(str).max(10).default([]),
});

export type ResumeData = z.infer<typeof resumeSchema>;

export const EMPTY_RESUME: ResumeData = resumeSchema.parse({});
