import { useState } from "react";
import { TaskStatus } from "~/backend/interview-analysis/stubs";
import {
  analyzePosture,
  getTaskStatus as getPostureAnalysisTaskStatus,
} from "~/backend/posture-analysis/client";
import type { PostureAnalysisResult } from "~/backend/posture-analysis/stubs";

type TTaskStatus = "idle" | "uploading" | "analyzing" | "complete" | "error";

export default function usePostureAnalysisTask() {
  const [state, setState] = useState<TTaskStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<PostureAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startAnalysis(file: File) {
    setState("uploading");
    setError(null);

    try {
      const { data: taskCreationRes } = await analyzePosture(file, {
        onUploadProgress: (progressEvent: any) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });
      setState("analyzing");

      if (taskCreationRes.status === "error") {
        setError(taskCreationRes.message || "Analysis failed");
        setState("error");
        return;
      }

      // poll for analysis results
      const pollInterval = setInterval(async () => {
        try {
          const { data: taskDetails } = await getPostureAnalysisTaskStatus(
            taskCreationRes.task_id
          );

          if (
            taskDetails.status === "success" &&
            taskDetails.task_status === TaskStatus.COMPLETED
          ) {
            setResult(taskDetails.result);
            setState("complete");
            clearInterval(pollInterval);
          } else if (
            taskDetails.status === "error" ||
            taskDetails.task_status === TaskStatus.FAILED
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
