import { Suspense } from "react";
import { QuizClient } from "@/components/QuizClient";

export const metadata = { title: "Mini Marketing MRI Quiz" };

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-5 py-16">იტვირთება...</div>}>
      <QuizClient />
    </Suspense>
  );
}
