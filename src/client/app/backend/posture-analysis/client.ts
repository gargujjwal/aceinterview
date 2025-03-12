import axios, { type AxiosRequestConfig } from "axios";
import { env } from "~/env";
import type {
  AnalyzePostureResponse,
  PostureHealthCheckResponse,
  PostureTaskStatusResponse,
} from "./stubs";

const api = axios.create({
  baseURL: env.POSTURE_ANALYSIS_MICROSVC_BASE_URL,
  timeout: 60 * 1000, // 1 mins
});

export async function analyzePosture(
  videoFile: File,
  config: AxiosRequestConfig<FormData> | undefined
) {
  const formData = new FormData();
  formData.append("video", videoFile);

  return await api.post<AnalyzePostureResponse>(
    "/api/posture/analyze",
    formData,
    config
  );
}

export async function getTaskStatus(taskId: string) {
  return await api.get<PostureTaskStatusResponse>(
    `/api/posture/task/${taskId}`
  );
}

export async function healthCheck() {
  return await api.get<PostureHealthCheckResponse>(`/api/posture/health`);
}
