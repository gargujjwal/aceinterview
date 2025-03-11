import logging
import os

from config import Config
from flask import Blueprint, jsonify, request
from services.prediction_service import PredictionService
from werkzeug.utils import secure_filename

# Configure logging
logger = logging.getLogger(__name__)

# Create Blueprint for interview analysis API
interview_api = Blueprint("interview_api", __name__)

# Initialize prediction service
prediction_service = PredictionService()


@interview_api.route("/analyze", methods=["POST"])
def analyze_interview():
    """
    Endpoint to analyze an interview video.

    Expects a video file in the request and returns analysis results.
    """
    if "video" not in request.files:
        logger.error("No video file in request")
        return jsonify({"success": False, "error": "No video file provided"}), 400

    video_file = request.files["video"]

    if video_file.filename == "":
        logger.error("Empty filename provided")
        return jsonify({"success": False, "error": "No file selected"}), 400

    # Check if the file is allowed
    allowed_extensions = {"mp4", "avi"}
    if (
        not "." in video_file.filename
        or video_file.filename.rsplit(".", 1)[1].lower() not in allowed_extensions
    ):
        logger.error(f"Invalid file format: {video_file.filename}")
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Invalid file format. Allowed formats: mp4, avi",
                }
            ),
            400,
        )

    try:
        # Secure the filename
        filename = secure_filename(video_file.filename)
        filepath = os.path.join(Config.TEMPORARY_ARTIFACTS_PATH, filename)

        # Ensure directory exists
        os.makedirs("temp_uploads", exist_ok=True)

        # Save the file temporarily
        video_file.save(filepath)

        # Process the video file
        logger.info(f"Processing video: {filename}")
        results = prediction_service.predict(filepath)

        # Remove the temporary file
        os.remove(filepath)

        # Return the analysis results
        return jsonify({"success": True, "results": results})

    except Exception as e:
        logger.exception(f"Error processing video: {str(e)}")
        # Clean up if error occurs
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"success": False, "error": f"Analysis failed: {str(e)}"}), 500


@interview_api.route("/tips/<label>", methods=["GET"])
def get_label_tips(label):
    """
    Endpoint to get tips for a specific label.

    Returns a list of tips for the given label.
    """
    try:
        tips = prediction_service.get_tips(label)
        if tips:
            return jsonify({"success": True, "label": label, "tips": tips})
        else:
            return (
                jsonify({"success": False, "error": f'Label "{label}" not found'}),
                404,
            )
    except Exception as e:
        logger.exception(f"Error getting tips for {label}: {str(e)}")
        return (
            jsonify({"success": False, "error": f"Failed to retrieve tips: {str(e)}"}),
            500,
        )


@interview_api.route("/health", methods=["GET"])
def health_check():
    """
    Health check endpoint for the API.
    """
    return jsonify({"status": "ok", "service": "interview-analysis"})
