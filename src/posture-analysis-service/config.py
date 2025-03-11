import os


class Config:
    """Base configuration."""

    # Flask settings
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-key-for-development-only")
    DEBUG = False
    TESTING = False

    # Service settings
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "/tmp/posture-analysis")
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024  # 16 MB maximum file size


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
