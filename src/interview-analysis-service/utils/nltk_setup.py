import nltk
import os
import logging

logger = logging.getLogger(__name__)


def ensure_nltk_resources():
    """Ensure all required NLTK resources are downloaded"""
    try:
        nltk_data_path = os.getenv("NLTK_DATA", os.path.expanduser("~/nltk_data"))
        os.makedirs(nltk_data_path, exist_ok=True)

        # Set the download directory
        nltk.data.path.append(nltk_data_path)

        # Check if punkt is already downloaded
        try:
            nltk.data.find("tokenizers/punkt")
            logger.info("NLTK punkt resource already exists")
        except LookupError:
            logger.info("Downloading NLTK punkt resource")
            nltk.download("punkt", download_dir=nltk_data_path)

        # Add other NLTK resources that might be needed
        required_resources = ["punkt", "punkt_tab", "stopwords", "wordnet"]

        for resource in required_resources:
            try:
                nltk.data.find(
                    f"{'tokenizers/' if resource == 'punkt' else ''}{resource}"
                )
                logger.info(f"NLTK {resource} resource already exists")
            except LookupError:
                logger.info(f"Downloading NLTK {resource} resource")
                nltk.download(resource, download_dir=nltk_data_path)

        logger.info("All NLTK resources verified")
        return True
    except Exception as e:
        logger.error(f"Error ensuring NLTK resources: {str(e)}")
        return False
