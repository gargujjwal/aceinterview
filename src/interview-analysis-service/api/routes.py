import logging
import os

from config import Config
from flask import Blueprint, jsonify, request, url_for
from services.prediction_service import PredictionService
from task_queue import TaskQueue
from werkzeug.utils import secure_filename

# Configure logging
logger = logging.getLogger(__name__)

# Create Blueprint for interview analysis API
interview_api = Blueprint("interview_api", __name__)

# Initialize prediction service
prediction_service = PredictionService()

# Initialize task queue
task_queue = TaskQueue(
    results_dir=os.path.join(Config.TEMPORARY_ARTIFACTS_PATH, "task_results"),
    num_workers=Config.TASK_QUEUE_WORKERS,
)


@interview_api.route("/analyze", methods=["POST"])
def analyze_interview():
    """
    Endpoint to analyze an interview video.
    Accepts a video file and returns a task ID for status tracking.
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

    # Secure the filename
    filename = secure_filename(video_file.filename)
    filepath = os.path.join(Config.TEMPORARY_ARTIFACTS_PATH, filename)
    try:
        # Ensure directory exists
        os.makedirs(Config.TEMPORARY_ARTIFACTS_PATH, exist_ok=True)

        # Save the file temporarily
        video_file.save(filepath)

        # Enqueue the task instead of processing immediately
        task_id = task_queue.enqueue(filepath)

        # Return task ID and status URL
        status_url = url_for(
            "interview_api.get_task_status", task_id=task_id, _external=True
        )

        return jsonify(
            {
                "success": True,
                "message": "Video analysis task has been queued",
                "task_id": task_id,
                "status_url": status_url,
            }
        )

    except Exception as e:
        logger.exception(f"Error queueing video analysis task: {str(e)}")
        # Clean up if error occurs
        if "filepath" in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return (
            jsonify(
                {"success": False, "error": f"Failed to queue analysis task: {str(e)}"}
            ),
            500,
        )


@interview_api.route("/task/<task_id>", methods=["GET"])
def get_task_status(task_id):
    """
    Get the status of a task by ID.
    """
    task_info = task_queue.get_task_status(task_id)

    if not task_info:
        return jsonify({"success": False, "error": "Task not found"}), 404

    response = {"success": True, "task_id": task_id, "status": task_info["status"]}

    # Add additional information based on task status
    if task_info["status"] == "completed":
        response["results"] = task_info["result"]
        response["processing_time"] = (
            task_info["completed_at"] - task_info["started_at"]
        )
    elif task_info["status"] == "failed":
        response["error"] = task_info["error"]

    return jsonify(response)


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
    return jsonify(
        {
            "status": "ok",
            "service": "interview-analysis",
            "queue_size": task_queue.queue.qsize(),
        }
    )
