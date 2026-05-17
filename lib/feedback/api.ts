import { ApiError } from "@/lib/api/errors";
import { fetchWithAuth, readErrorMessage } from "@/lib/auth/auth-api";

export type SubmitFeedbackInput = {
  message: string;
  name?: string;
  email?: string;
};

export async function submitFeedback(
  input: SubmitFeedbackInput,
): Promise<{ id: string; message: string }> {
  const res = await fetchWithAuth("/feedback", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<{ id: string; message: string }>;
}
