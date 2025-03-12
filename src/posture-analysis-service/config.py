import os


class Config:
    """Base configuration."""

    # Flask settings
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-key-for-development-only")
    DEBUG = False
    TESTING = False

    # Paths
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    TEMPORARY_ARTIFACTS_PATH = os.environ.get(
        "TEMPORARY_ARTIFACTS_PATH", os.path.join(BASE_DIR, "tmp")
    )

    # Service settings
    UPLOAD_FOLDER = os.environ.get(
        "UPLOAD_FOLDER", os.path.join(TEMPORARY_ARTIFACTS_PATH, "uploads")
    )
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024  # 16 MB maximum file size

    # Task queue configuration
    TASK_QUEUE_WORKERS = int(os.getenv("TASK_QUEUE_WORKERS", "2"))
    TASK_QUEUE_RESULTS_TTL = int(
        os.getenv("TASK_QUEUE_RESULTS_TTL", "86400")
    )  # 24 hours in seconds


class DevelopmentConfig(Config):
    """Development configuration."""

    DEBUG = True


class TestingConfig(Config):
    """Testing configuration."""

    TESTING = True
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration."""

    # In production, SECRET_KEY should be set in environment variables
    DEBUG = False


# Configuration dictionary
config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}


def get_config():
    """Get the appropriate configuration based on environment."""
    env = os.environ.get("FLASK_ENV", "default")
    return config.get(env, config["default"])
