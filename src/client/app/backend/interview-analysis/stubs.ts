/**
 * TypeScript interfaces for the Interview Analysis API
 */

// Task Status enum
export enum TaskStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export type AnalyzeInterviewResponse =
  | {
      success: true;
      message: true;
      task_id: string;
    }
  | {
      success: false;
      message: true;
      task_id: string;
      error: string;
    };

// Task Status Endpoint
export type InterviewAnalysisResult = {
  classifications: {
    Excited: number;
    Paused: number;
    EngagingTone: number;
    Calm: number;
    NoFillers: number;
  };
  good_performance: string[];
  improvement_opportunity: string[];
};
export type TaskStatusResponse =
  | {
      success: true;
      task_id: string;
      status: TaskStatus;
      results: InterviewAnalysisResult;
      processing_time: number;
    }
  | {
      success: false;
      task_id: string;
      status: TaskStatus;
      error: string;
      processing_time: number;
    };

// Label Tips Endpoint
export interface LabelTipsRequest {
  label: string;
}

export type LabelTipsResponse =
  | {
      success: true;
      label: string;
      tips: string[];
    }
  | { success: false; error: string; label: string };

// Health Check Endpoint
export interface HealthCheckResponse {
  status: string;
  service: string;
  queue_size: number;
}
