import traceback

from flask import Blueprint, jsonify, request
from services.analysis_service import PostureAnalysisService

# Create blueprint
posture_bp = Blueprint("posture", __name__, url_prefix="/api/posture")

# Initialize service
analysis_service = PostureAnalysisService()


@posture_bp.route("/analyze", methods=["POST"])
def analyze_posture():
    """
    Endpoint to analyze posture from a video file.
    Expects a video file in the request.
    """
    try:
        # Check if file exists in request
        if "video" not in request.files:
            return (
                jsonify({"status": "error", "message": "No video file provided"}),
                400,
            )

        video_file = request.files["video"]

        # Check if filename is empty
        if video_file.filename == "":
            return jsonify({"status": "error", "message": "Empty video filename"}), 400

        # Read video data
        video_data = video_file.read()

        # Analyze posture
        result = analysis_service.analyze_posture(video_data)

        # Return result
        return jsonify(result)

    except Exception as e:
        print(f"Error in analyze_posture: {e}")
        print(traceback.format_exc())
        return (
            jsonify({"status": "error", "message": f"An error occurred: {str(e)}"}),
            500,
        )


@posture_bp.route("/health", methods=["GET"])
def health_check():
    """
    Endpoint to check if the service is running.
    """
    return jsonify({"status": "ok", "service": "posture-analysis", "version": "1.0.0"})
