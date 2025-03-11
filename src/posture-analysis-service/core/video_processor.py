import os
import tempfile

import cv2

from core.pose_detector import PoseDetector


class VideoProcessor:
    """
    Process video files for posture analysis.
    """

    def __init__(self, skip_frames=5):
        """
        Initialize the video processor.

        Args:
            skip_frames (int): Number of frames to skip between processing
        """
        self.skip_frames = skip_frames
        self.pose_detector = PoseDetector()

    def process_video(self, video_data):
        """
        Process video data to extract posture angles.

        Args:
            video_data (bytes): Video file data in bytes

        Returns:
            dict: Dictionary with angle data and processed frames count
        """
        # Create temporary file to store video
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
            temp_file.write(video_data)
            temp_file_path = temp_file.name

        try:
            # Lists to store angle data
            angles_data = {
                "Shoulders angle": [],
                "Left shoulder-elbow angle": [],
                "Right shoulder-elbow angle": [],
                "Left elbow-wrist angle": [],
                "Right elbow-wrist angle": [],
            }

            # Open video file
            cap = cv2.VideoCapture(temp_file_path)

            if not cap.isOpened():
                raise ValueError("Failed to open video file")

            frame_count = 0
            processed_frames = 0

            # Process video frames
            while cap.isOpened():
                ret, frame = cap.read()

                if not ret:
                    break

                # Process only every skip_count frame
                if frame_count % self.skip_frames == 0:
                    _, landmarks = self.pose_detector.process_frame(frame)

                    if landmarks:
                        angles = self.pose_detector.extract_angles(landmarks)

                        if angles:
                            for angle_name, angle_value in angles.items():
                                angles_data[angle_name].append(angle_value)

                            processed_frames += 1

                frame_count += 1

            # Release resources
            cap.release()

            return {
                "angles_data": angles_data,
                "processed_frames": processed_frames,
                "total_frames": frame_count,
            }

        except Exception as e:
            raise RuntimeError(f"Error processing video: {e}")

        finally:
            # Clean up the temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
