import json
import logging
import os
import time
import uuid
from dataclasses import asdict, dataclass
from enum import Enum
from queue import Queue
from threading import Thread
from typing import Any, Dict, Optional

# Configure logging
logger = logging.getLogger(__name__)


class TaskStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

    def __str__(self):
        return self.value


@dataclass
class Task:
    id: str
    filepath: str
    status: TaskStatus
    created_at: float
    started_at: Optional[float] = None
    completed_at: Optional[float] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

    def to_dict(self):
        """Convert task to dictionary with proper enum handling"""
        data = asdict(self)
        data["status"] = str(self.status)
        return data


class TaskQueue:
    def __init__(
        self, results_dir: str, num_workers: int = 2, processor_type: str = "posture"
    ):
        self.queue = Queue()
        self.tasks: Dict[str, Task] = {}
        self.results_dir = results_dir
        self.num_workers = num_workers
        self.processor_type = processor_type

        # Ensure results directory exists
        os.makedirs(results_dir, exist_ok=True)

        # Start worker threads
        self.workers = []
        for _ in range(num_workers):
            worker = Thread(target=self._process_queue, daemon=True)
            worker.start()
            self.workers.append(worker)

        logger.info(
            f"Task queue initialized with {num_workers} workers for {processor_type} processing"
        )

    def enqueue(self, filepath: str) -> str:
        """Add a task to the queue and return its ID"""
        task_id = str(uuid.uuid4())
        task = Task(
            id=task_id,
            filepath=filepath,
            status=TaskStatus.PENDING,
            created_at=time.time(),
        )

        self.tasks[task_id] = task
        self.queue.put(task_id)

        # Save task metadata
        self._save_task_metadata(task)

        logger.info(f"Task {task_id} enqueued for file {filepath}")
        return task_id

    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get the current status of a task"""
        if task_id in self.tasks:
            return self.tasks[task_id].to_dict()

        # Check if task exists in the results directory
        metadata_path = os.path.join(self.results_dir, f"{task_id}.json")
        if os.path.exists(metadata_path):
            with open(metadata_path, "r") as f:
                return json.load(f)

        return None

    def _process_queue(self):
        """Worker thread function to process tasks from the queue"""
        # Initialize the appropriate service based on processor type
        if self.processor_type == "posture":
            from services.analysis_service import PostureAnalysisService

            service = PostureAnalysisService()
            process_func = self._process_posture_task
        else:
            raise ValueError("Invalid processor type")

        while True:
            task_id = self.queue.get()

            if task_id not in self.tasks:
                logger.error(f"Task {task_id} not found in tasks dictionary")
                self.queue.task_done()
                continue

            task = self.tasks[task_id]

            try:
                # Update task status
                task.status = TaskStatus.PROCESSING
                task.started_at = time.time()
                self._save_task_metadata(task)

                logger.info(f"Processing task {task_id}")

                # Process the task with the appropriate function
                process_func(task, service)

            except Exception as e:
                logger.exception(f"Error processing task {task_id}: {str(e)}")
                task.status = TaskStatus.FAILED
                task.error = str(e)
                task.completed_at = time.time()

            finally:
                # Cleanup the temporary file
                if os.path.exists(task.filepath):
                    try:
                        os.remove(task.filepath)
                    except Exception as e:
                        logger.error(
                            f"Failed to remove temporary file {task.filepath}: {str(e)}"
                        )

                # Save final task metadata
                self._save_task_metadata(task)
                self.queue.task_done()

    def _process_posture_task(self, task, service):
        """Process a posture analysis task"""
        # Read video data from file
        with open(task.filepath, "rb") as f:
            video_data = f.read()

        # Analyze posture
        results = service.analyze_posture(video_data)

        task.result = results
        task.status = TaskStatus.COMPLETED
        task.completed_at = time.time()

    def _save_task_metadata(self, task: Task):
        """Save task metadata to a file"""
        metadata_path = os.path.join(self.results_dir, f"{task.id}.json")
        with open(metadata_path, "w") as f:
            json.dump(task.to_dict(), f)
