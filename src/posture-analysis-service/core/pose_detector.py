import cv2
import mediapipe as mp
from utils.angle_utils import angle_between_points


class PoseDetector:
    """
    Class for detecting poses in images/videos using MediaPipe.
    """

    def __init__(self, min_detection_confidence=0.8, min_tracking_confidence=0.8):
        """
        Initialize the PoseDetector with the given confidence thresholds.

        Args:
            min_detection_confidence (float): Minimum confidence for pose detection
            min_tracking_confidence (float): Minimum confidence for pose tracking
        """
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_pose = mp.solutions.pose
        self.min_detection_confidence = min_detection_confidence
        self.min_tracking_confidence = min_tracking_confidence

    def process_frame(self, frame):
        """
        Process a single frame to detect pose landmarks.

        Args:
            frame (numpy.ndarray): Image frame to process

        Returns:
            tuple: (processed_image, landmarks) or (image, None) if no landmarks detected
        """
        with self.mp_pose.Pose(
            min_detection_confidence=self.min_detection_confidence,
            min_tracking_confidence=self.min_tracking_confidence,
        ) as pose:
            # Convert frame to RGB (MediaPipe requires RGB input)
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Process the image
            results = pose.process(image)

            if not results.pose_landmarks:
                return image, None

            # Draw the pose landmarks on the image
            self.mp_drawing.draw_landmarks(
                image,
                results.pose_landmarks,
                self.mp_pose.POSE_CONNECTIONS,
                self.mp_drawing.DrawingSpec(
                    color=(245, 117, 66), thickness=4, circle_radius=3
                ),
                self.mp_drawing.DrawingSpec(
                    color=(245, 66, 230), thickness=4, circle_radius=3
                ),
            )

            return image, results.pose_landmarks.landmark

    def extract_angles(self, landmarks):
        """
        Extract angles from pose landmarks.

        Args:
            landmarks (list): List of pose landmarks

        Returns:
            dict: Dictionary containing angles between key points
        """
        if landmarks is None:
            return None

        try:
            # Extract key landmark points
            ls_cord = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value]
            rs_cord = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
            le_cord = landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value]
            re_cord = landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value]
            lw_cord = landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value]
            rw_cord = landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]

            # Calculate angles
            angles = {
                "Shoulders angle": angle_between_points(ls_cord, rs_cord),
                "Left shoulder-elbow angle": angle_between_points(ls_cord, le_cord),
                "Right shoulder-elbow angle": angle_between_points(rs_cord, re_cord),
                "Left elbow-wrist angle": angle_between_points(lw_cord, le_cord),
                "Right elbow-wrist angle": angle_between_points(rw_cord, re_cord),
            }

            return angles

        except Exception as e:
            print(f"Error extracting angles: {e}")
            return None
