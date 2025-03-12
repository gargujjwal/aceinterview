import { useState } from "react";
import {
  analyzeInterview,
  getTaskStatus as getInterviewAnalysisTaskStatus,
} from "~/backend/interview-analysis/client";
import {
  TaskStatus,
  type InterviewAnalysisResult,
} from "~/backend/interview-analysis/stubs";

type TTaskStatus = "idle" | "uploading" | "analyzing" | "complete" | "error";

export default function useInterviewAnalysisTask() {
  const [state, setState] = useState<TTaskStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<InterviewAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startAnalysis(file: File) {
    setState("uploading");
    setError(null);

    try {
      const { data: taskCreationRes } = await analyzeInterview(file, {
        onUploadProgress: (progressEvent: any) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });
      setState("analyzing");

      if (!taskCreationRes.success) {
        setError(taskCreationRes.error || "Analysis failed");
        setState("error");
        return;
      }

      // poll for analysis results
      const pollInterval = setInterval(async () => {
        try {
          const { data: taskDetails } = await getInterviewAnalysisTaskStatus(
            taskCreationRes.task_id
          );

          if (
            taskDetails.success &&
            taskDetails.status === TaskStatus.COMPLETED
          ) {
            setResult(taskDetails.results);
            setState("complete");
            clearInterval(pollInterval);
          } else if (
            !taskDetails.success ||
            taskDetails.status === TaskStatus.FAILED
          ) {
            setError("Analysis failed");
            setState("error");
            clearInterval(pollInterval);
          }
        } catch (err) {
          setError("Failed to fetch analysis status");
          setState("error");
          clearInterval(pollInterval);
        }
      }, 2000);
    } catch (err) {
      setError("Failed to upload video");
      setState("error");
    }
  }

  const reset = () => {
    setState("idle");
    setUploadProgress(0);
    setResult(null);
    setError(null);
  };

  return {
    state,
    uploadProgress,
    result,
    error,
    startAnalysis,
    reset,
  };
}
