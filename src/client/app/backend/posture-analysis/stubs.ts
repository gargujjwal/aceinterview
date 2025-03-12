/**
 * TypeScript interfaces for the Posture Analysis API
 */

// Task Status enum
export enum TaskStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export type AnalyzePostureResponse =
  | {
      status: "success";
      message: string;
      task_id: string;
      status_url: string;
    }
  | {
      status: "error";
      message: string;
    };

// Task Status Endpoint
export type PostureAnalysisResult =
  | {
      message: string;
      status: "success";
      stats: {
        processed_frames: number;
        total_frames: number;
      };
      average_angles: {
        "Shoulders angle": number;
        "Left shoulder-elbow angle": number;
        "Right shoulder-elbow angle": number;
        "Left elbow-wrist angle": number;
        "Right elbow-wrist angle": number;
        [key: string]: number; // For any additional angles that might be added
      };
      feedback: {
        "Shoulder alignment": string;
        "Hand gestures": string;
        "Left Shoulder-Elbow": string;
        "Right Shoulder-Elbow": string;
        [key: string]: string; // For any additional feedback that might be added
      };
    }
  | { message: string; status: "error" };

export type PostureTaskStatusResponse =
  | {
      status: "success";
      task_id: string;
      task_status: TaskStatus;
      message?: string;
      result: PostureAnalysisResult;
      processing_time?: number;
    }
  | {
      status: "error";
      task_id: string;
      task_status: TaskStatus;
      message?: string;
      error: string;
      processing_time: number;
    };

// Health Check Endpoint
export interface PostureHealthCheckResponse {
  status: string;
  service: string;
  version: string;
  queue_size: number;
}
