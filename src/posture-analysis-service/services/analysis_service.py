from core.video_processor import VideoProcessor
from services.result_interpreter import ResultInterpreter
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
        self.result_interpreter = ResultInterpreter()

    def analyze_posture(self, video_data):
        """
        Analyze posture from video data.

        Args:
            video_data (bytes): Video file data in bytes

        Returns:
            dict: Analysis results including average angles, feedback, inferences and tips
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

        # Enhance the response with inferences and tips
        enhanced_response = self.result_interpreter.interpret_results(response)

        return enhanced_response
