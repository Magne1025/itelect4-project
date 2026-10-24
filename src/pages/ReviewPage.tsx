// src/pages/ReviewPage.tsx -- a NEW file
// ===== SESSION 11: a NEW file ========================================
// ===== no Session 10 version -- there was no AI to call ==============
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AiReview } from "../types/index";
import { askAi } from "../api/client";
import { reviewFormSchema } from "../schemas/reviewSchema";
import type { ReviewFormValues } from "../schemas/reviewSchema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Record from Session 2: one entry for every value readiness can
// have. Add a fourth value to AiReview and this object stops
// compiling until it has a colour for it.
const READINESS_STYLE: Record<AiReview["readiness"], string> = {
  "ready":   "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "almost":  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  "not-yet": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function ReviewPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    // No mode: "onBlur" here, unlike the Session 8 and 10 forms. The
    // button sits right under the error message, and checking on blur
    // makes the message appear or vanish in the moment between pressing
    // the button and letting go -- the button moves, and the click
    // misses. The default checks on submit, then again on every
    // keystroke, so the message is gone before the button is pressed.
    defaultValues: { prompt: "" },
  });

  // A mutation, not a query: it runs when the button is pressed, never
  // on page load, and asking twice is two requests -- two answers that
  // may differ, and two spent from the quota. Nothing to cache.
  const review = useMutation({
    mutationFn: askAi,
  });

  const onSubmit = (values: ReviewFormValues): void => {
    review.mutate(values.prompt);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">AI Review</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Describe your project and get feedback before you submit it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="prompt" className="text-foreground">
            Project description</Label>
          <textarea id="prompt" rows={6} {...register("prompt")}
            aria-invalid={errors.prompt ? true : undefined}
            placeholder="What it does, how it is built, where it runs..."
            className="w-full rounded-lg border border-input bg-background p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500" />
          {errors.prompt && (
            <p className="text-sm text-red-600">{errors.prompt.message}</p>
          )}
        </div>

        <Button type="submit" disabled={review.isPending}
          className="justify-self-start">
          {review.isPending ? "Reviewing..." : "Review my project"}
        </Button>
      </form>

      {/* The API's own sentence: the rate limit, the quota, or a
          refusal from the schema -- never Google's raw error text. */}
      {review.isError && (
        <p className="mt-4 text-sm text-red-700 dark:text-red-400">{review.error.message}</p>
      )}

      {review.data && (
        <div className="mt-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <span className={`justify-self-start rounded px-2 py-0.5 text-sm font-semibold ${READINESS_STYLE[review.data.readiness]}`}>
            {review.data.readiness}
          </span>
          <p className="text-gray-900 dark:text-white">
            {review.data.summary}</p>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Strengths</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
              {review.data.strengths.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Before you submit</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
              {review.data.improvements.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewPage;
