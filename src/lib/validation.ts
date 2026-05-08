import { z } from "zod";
import { quizQuestions } from "./quiz-data";

// Build per-question answer schema. Multi-select → array; dynamic-options → string;
// fixed-options → enum.
const answerSchema = quizQuestions.reduce(
  (acc, q) => {
    if (q.type === "multi") {
      const allowedKeys = q.options.map((o) => o.key) as [string, ...string[]];
      acc[q.id] = z.array(z.enum(allowedKeys)).min(1, "მონიშნე მინიმუმ ერთი პასუხი");
    } else if (q.dynamicOptionsFrom || q.branchOnUnknown) {
      // Dynamic options — answer keys aren't fixed at schema build time.
      acc[q.id] = z.string().min(1, "აირჩიე პასუხი");
    } else {
      const allowedKeys = q.options.map((o) => o.key) as [string, ...string[]];
      acc[q.id] = z.enum(allowedKeys);
    }
    return acc;
  },
  {} as Record<string, z.ZodTypeAny>
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
