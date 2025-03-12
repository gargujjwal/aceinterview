import logging
import os
import traceback

from config import Config
from flask import Blueprint, jsonify, request, url_for
from services.analysis_service import PostureAnalysisService
from task_queue import TaskQueue
from werkzeug.utils import secure_filename

# Configure logging
logger = logging.getLogger(__name__)

# Create blueprint
posture_bp = Blueprint("posture", __name__, url_prefix="/api/posture")

# Initialize service
analysis_service = PostureAnalysisService()

# Initialize task queue
posture_task_queue = TaskQueue(
    results_dir=os.path.join(Config.TEMPORARY_ARTIFACTS_PATH, "posture_task_results"),
    num_workers=Config.TASK_QUEUE_WORKERS,
    processor_type="posture",
)


@posture_bp.route("/analyze", methods=["POST"])
def analyze_posture():
    """
    Endpoint to analyze posture from a video file.
    Expects a video file in the request.
    Returns a task ID for asynchronous processing.
    """

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

    # Save the video file temporarily
    filename = secure_filename(video_file.filename)
    filepath = os.path.join(Config.TEMPORARY_ARTIFACTS_PATH, filename)

    try:
        # Ensure directory exists
        os.makedirs(Config.TEMPORARY_ARTIFACTS_PATH, exist_ok=True)

        # Save the file
        video_file.save(filepath)

        # Enqueue the task for asynchronous processing
        task_id = posture_task_queue.enqueue(filepath)

        # Return task ID and status URL
        status_url = url_for("posture.get_task_status", task_id=task_id, _external=True)

        return jsonify(
            {
                "status": "success",
                "message": "Posture analysis task has been queued",
                "task_id": task_id,
                "status_url": status_url,
            }
        )

    except Exception as e:
        logger.error(f"Error in analyze_posture: {e}")
        logger.error(traceback.format_exc())

        # Clean up if error occurs
        if "filepath" in locals() and os.path.exists(filepath):
            os.remove(filepath)

        return (
            jsonify({"status": "error", "message": f"An error occurred: {str(e)}"}),
            500,
        )


@posture_bp.route("/task/<task_id>", methods=["GET"])
def get_task_status(task_id):
    """
    Get the status of a posture analysis task by ID.
    """
    task_info = posture_task_queue.get_task_status(task_id)

    if not task_info:
        return jsonify({"status": "error", "message": "Task not found"}), 404

    response = {
        "status": "success",
        "task_id": task_id,
        "task_status": task_info["status"],
    }

    # Add additional information based on task status
    if task_info["status"] == "completed":
        response["result"] = task_info["result"]
        response["processing_time"] = (
            task_info["completed_at"] - task_info["started_at"]
        )
    elif task_info["status"] == "failed":
        response["error"] = task_info["error"]

    return jsonify(response)


@posture_bp.route("/health", methods=["GET"])
def health_check():
    """
    Endpoint to check if the service is running.
    """
    return jsonify(
        {
            "status": "ok",
            "service": "posture-analysis",
            "version": "1.0.0",
            "queue_size": posture_task_queue.queue.qsize(),
        }
    )
