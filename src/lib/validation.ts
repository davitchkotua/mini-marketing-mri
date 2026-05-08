import { z } from "zod";
import { quizQuestions } from "./quiz-data";

const answerSchema = quizQuestions.reduce(
  (acc, q) => {
    const allowedKeys = q.options.map((o) => o.key) as [string, ...string[]];
    acc[q.id] = z.enum(allowedKeys);
    return acc;
  },
  {} as Record<string, z.ZodEnum<[string, ...string[]]>>
);

export const submissionSchema = z.object({
  name: z.string().trim().min(1, "სახელი აუცილებელია"),
  email: z.string().trim().email("შეიყვანე ვალიდური ელფოსტა"),
  phone: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "თანხმობა აუცილებელია" }),
  }),
  answers: z.object(answerSchema),
  utm: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_content: z.string().optional(),
      utm_term: z.string().optional(),
    })
    .partial()
    .optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
