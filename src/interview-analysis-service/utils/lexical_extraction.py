import logging

from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

logger = logging.getLogger(__name__)


class LexicalFeatureExtractor:
    def __init__(self):
        """
        Initialize the lexical feature extractor with LIWC-like categories.
        """
        # Define LIWC-like categories for lexical feature extraction
        self.liwc_categories = {
            "posEmotion": [
                "hope",
                "improve",
                "kind",
                "love",
                "happy",
                "pretty",
                "good",
                "joy",
                "excited",
                "optimistic",
                "satisfied",
                "confident",
                "enthusiastic",
                "pleased",
                "grateful",
            ],
            "Cognitive": [
                "cause",
                "know",
                "ought",
                "learn",
                "make",
                "notice",
                "understand",
                "think",
                "reason",
                "realize",
                "analyze",
                "comprehend",
                "ponder",
                "contemplate",
                "reflect",
            ],
            "Work": [
                "project",
                "study",
                "thesis",
                "class",
                "work",
                "university",
                "job",
                "employment",
                "career",
                "task",
                "interview",
                "meeting",
                "resume",
                "deadline",
                "position",
            ],
            "Tentative_Language": [
                "maybe",
                "perhaps",
                "guess",
                "possibly",
                "potentially",
                "could",
                "might",
                "assuming",
                "probable",
                "likely",
                "feasible",
                "possible",
                "hypothetical",
                "uncertain",
                "tentative",
            ],
            "Filler_Words": [
                "ah",
                "Ah",
                "Ahh",
                "ahh",
                "uhm",
                "Uhm",
                "Uhmmm",
                "um",
                "Um",
                "uh",
                "Uhh",
                "Umm",
                "ummm",
                "Mmhmm",
                "Uhhhh",
                "Hmm",
                "uhhhh",
                "uhh",
                "umm",
                "Uh",
            ],
        }

        # Initialize Porter Stemmer
        self.stemmer = PorterStemmer()

        # Create stemmed category words for faster lookup
        self.stemmed_categories = {}
        for category, words in self.liwc_categories.items():
            self.stemmed_categories[category] = [
                self.stemmer.stem(word.lower()) for word in words
            ]

    def extract_features(self, text):
        """
        Extract lexical features from text.

        Args:
            text (str): Input text to analyze

        Returns:
            dict: Dictionary of lexical feature counts by category
        """
        logger.info("Extracting lexical features from text")

        try:
            # Tokenize and stem the input text
            tokens = word_tokenize(text)
            stemmed_tokens = [self.stemmer.stem(word.lower()) for word in tokens]

            # Initialize category counts
            category_counts = {category: 0 for category in self.liwc_categories.keys()}

            # Count occurrences of stemmed words in LIWC categories
            for word in stemmed_tokens:
                for category, stemmed_words in self.stemmed_categories.items():
                    if word in stemmed_words:
                        category_counts[category] += 1

            return category_counts

        except Exception as e:
            logger.error(f"Error extracting lexical features: {str(e)}")
            raise
