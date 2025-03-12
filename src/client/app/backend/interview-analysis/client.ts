import { env } from "~/env";
import type {
  AnalyzeInterviewResponse,
  HealthCheckResponse,
  LabelTipsResponse,
  TaskStatusResponse,
} from "./stubs";
import axios, { type AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: env.INTERVIEW_ANALYSIS_MICROSVC_BASE_URL,
  timeout: 60 * 1000, // 1 mins
});

export async function analyzeInterview(
  videoFile: File,
  config: AxiosRequestConfig<FormData> | undefined
) {
  const formData = new FormData();
  formData.append("video", videoFile);

  return await api.post<AnalyzeInterviewResponse>(
    "/api/v1/interview/analyze",
    formData,
    config
  );
}

export async function getTaskStatus(taskId: string) {
  return await api.get<TaskStatusResponse>(`/api/v1/interview/task/${taskId}`);
}

export async function getLabelTips(label: string) {
  return await api.get<LabelTipsResponse>(`/api/v1/interview/tips/${label}`);
}

export async function healthCheck() {
  return await api.get<HealthCheckResponse>(`/api/v1/interview/health`);
}
