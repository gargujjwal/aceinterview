import os


class Config:
    """Base configuration class."""

    # Flask settings
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-key-for-interview-analysis")
    DEBUG = os.environ.get("DEBUG", "False").lower() == "true"
    TESTING = os.environ.get("TESTING", "False").lower() == "true"

    # Logging settings
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

    # API settings
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024  # 500MB max upload size

    # Paths
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    MODEL_PATH = os.environ.get("MODEL_PATH", os.path.join(BASE_DIR, "models"))
    MEDIANS_PATH = os.environ.get(
        "MEDIANS_PATH", os.path.join(BASE_DIR, "pp_data", "medians.csv")
    )
    TEMPORARY_ARTIFACTS_PATH = os.environ.get(
        "TEMPORARY_ARTIFACTS_PATH", os.path.join(BASE_DIR, "tmp")
    )

    # AssemblyAI API key (should be set as environment variable in production)
    ASSEMBLYAI_API_KEY = os.environ.get("ASSEMBLYAI_API_KEY", "")

    # Task queue configuration
    TASK_QUEUE_WORKERS = int(os.getenv("TASK_QUEUE_WORKERS", "4"))
    TASK_QUEUE_RESULTS_TTL = int(
        os.getenv("TASK_QUEUE_RESULTS_TTL", "86400")
    )  # 24 hours in seconds


class DevelopmentConfig(Config):
    """Development configuration."""

    DEBUG = True
    LOG_LEVEL = "DEBUG"


class TestingConfig(Config):
    """Testing configuration."""

    TESTING = True
    DEBUG = True
    LOG_LEVEL = "DEBUG"


class ProductionConfig(Config):
    """Production configuration."""

    DEBUG = False
    LOG_LEVEL = "INFO"

    # In production, ensure these are set via environment variables
    SECRET_KEY = os.environ.get("SECRET_KEY")
    ASSEMBLYAI_API_KEY = os.environ.get("ASSEMBLYAI_API_KEY")


# Configuration dictionary
config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}

# Export configured paths for use in other modules
MODEL_PATH = Config.MODEL_PATH
MEDIANS_PATH = Config.MEDIANS_PATH
