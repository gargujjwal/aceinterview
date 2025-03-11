from core.video_processor import VideoProcessor
from utils.angle_utils import calculate_average_angles, generate_posture_feedback


class PostureAnalysisService:
    """
    Service for posture analysis functionality.
    """

    def __init__(self):
        """
        Initialize the posture analysis service.
        """
        self.video_processor = VideoProcessor()

    def analyze_posture(self, video_data):
        """
        Analyze posture from video data.

        Args:
            video_data (bytes): Video file data in bytes

        Returns:
            dict: Analysis results including average angles and feedback
        """
        # Process the video to extract angles
        processing_result = self.video_processor.process_video(video_data)

        # If no frames were processed successfully, return error
        if processing_result["processed_frames"] == 0:
            return {
                "status": "error",
                "message": "No pose landmarks detected in the video",
            }

        # Calculate average angles
        avg_angles = calculate_average_angles(processing_result["angles_data"])

        # Generate feedback based on angles
        feedback = generate_posture_feedback(avg_angles)

        # Create response
        response = {
            "status": "success",
            "stats": {
                "processed_frames": processing_result["processed_frames"],
                "total_frames": processing_result["total_frames"],
            },
            "average_angles": {
                name: round(value, 2) for name, value in avg_angles.items()
            },
            "feedback": feedback,
        }

        return response
