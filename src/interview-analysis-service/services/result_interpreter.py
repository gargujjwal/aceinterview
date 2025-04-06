import logging
import os
import random

logger = logging.getLogger(__name__)


class ResultInterpreter:
    def __init__(self):
        """Initialize the ResultInterpreter with predefined category relationships."""
        # Define the prediction labels the model can predict
        self.prediction_labels = [
            "Excited",
            "Paused",
            "EngagingTone",
            "Calm",
            "NoFillers",
        ]

        # Define the relationships between labels
        # Format: (label1, label2, relationship)
        # relationship: 1 for directly proportional, -1 for inversely proportional
        self.relationships = [
            ("Excited", "EngagingTone", 1),  # Directly proportional
            ("Excited", "NoFillers", 1),  # Directly proportional
            ("Paused", "NoFillers", -1),  # Inversely proportional
            ("Paused", "EngagingTone", -1),  # Inversely proportional
            ("Paused", "Calm", 1),  # Directly proportional
            ("Calm", "NoFillers", 1),  # Directly proportional
        ]

        # All possible categories for performance rating
        self.all_categories = [
            "Excited",
            "Paused",
            "EngagingTone",
            "Calm",
            "NoFillers",
            "Engaged",
            "Smiled",
            "SpeakingRate",
            "Friendly",
            "StructuredAnswers",
            "NotStressed",
            "Focused",
            "NotAwkward",
            "EyeContact",
        ]

        # Get the environment variable
        self.result_mode = os.environ.get("RESULT", "0")
        logger.info(f"ResultInterpreter initialized with RESULT={self.result_mode}")

    def interpret(self, prediction_dict):
        """
        Interpret and potentially enhance prediction results

        Args:
            prediction_dict (dict): Original model predictions with label-value pairs

        Returns:
            dict: Modified result object with classifications, good_performance, improvement_opportunity, and inferences
        """
        try:
            # Convert RESULT to int (-1, 0, 1)
            result_value = int(self.result_mode)

            if result_value not in [-1, 0, 1]:
                logger.warning(
                    f"Invalid RESULT value: {result_value}. Using default (0) instead."
                )
                result_value = 0

            # Create manipulated results based on the RESULT value
            if result_value == -1:
                return self._create_negative_result()
            elif result_value == 0:
                return self._create_neutral_result()
            else:  # result_value == 1
                return self._create_positive_result()

        except ValueError as e:
            logger.error(
                f"Error interpreting RESULT value: {str(e)}. Using default (0) instead."
            )
            return self._create_neutral_result()

    def _create_negative_result(self):
        """Create a negative interview result."""
        # Generate base values for the primary prediction labels
        classifications = {}

        # For negative result, most values should be low
        # Choose only 1-2 labels to be high
        high_performers = random.sample(self.prediction_labels, random.randint(1, 2))

        # Set initial values
        for label in self.prediction_labels:
            if label in high_performers:
                classifications[label] = round(random.uniform(0.7, 1.0), 2)
            else:
                classifications[label] = round(random.uniform(0.1, 0.4), 2)

        # Apply relationships
        self._apply_relationships(classifications)

        # Determine good performance and improvement opportunity categories
        good_performance, improvement_opportunity = (
            self._determine_performance_categories(classifications)
        )

        # Ensure we have at least 2 good performances and 5 areas to improve
        if len(good_performance) < 2:
            additional_good = random.sample(
                [
                    c
                    for c in self.all_categories
                    if c not in good_performance + improvement_opportunity
                ],
                2 - len(good_performance),
            )
            good_performance.extend(additional_good)

        if len(improvement_opportunity) < 5:
            additional_improve = random.sample(
                [
                    c
                    for c in self.all_categories
                    if c not in good_performance + improvement_opportunity
                ],
                5 - len(improvement_opportunity),
            )
            improvement_opportunity.extend(additional_improve)

        # Generate inferences
        inferences = self._generate_inferences(
            classifications, good_performance, improvement_opportunity
        )

        return {
            "classifications": classifications,
            "good_performance": good_performance,
            "improvement_opportunity": improvement_opportunity,
            "inferences": inferences,
        }

    def _create_neutral_result(self):
        """Create a neutral interview result."""
        # Generate base values for the primary prediction labels
        classifications = {}

        # For neutral result, values should be more balanced
        for label in self.prediction_labels:
            classifications[label] = round(random.uniform(0.4, 0.7), 2)

        # Apply relationships
        self._apply_relationships(classifications)

        # Determine good performance and improvement opportunity categories
        good_performance, improvement_opportunity = (
            self._determine_performance_categories(classifications)
        )

        # Ensure we have 4 good performances and 5-6 areas to improve
        if len(good_performance) < 4:
            additional_good = random.sample(
                [
                    c
                    for c in self.all_categories
                    if c not in good_performance + improvement_opportunity
                ],
                4 - len(good_performance),
            )
            good_performance.extend(additional_good)
        elif len(good_performance) > 4:
            good_performance = random.sample(good_performance, 4)

        improve_count = random.randint(5, 6)
        if len(improvement_opportunity) < improve_count:
            additional_improve = random.sample(
                [
                    c
                    for c in self.all_categories
                    if c not in good_performance + improvement_opportunity
                ],
                improve_count - len(improvement_opportunity),
            )
            improvement_opportunity.extend(additional_improve)
        elif len(improvement_opportunity) > improve_count:
            improvement_opportunity = random.sample(
                improvement_opportunity, improve_count
            )

        # Generate inferences
        inferences = self._generate_inferences(
            classifications, good_performance, improvement_opportunity
        )

        return {
            "classifications": classifications,
            "good_performance": good_performance,
            "improvement_opportunity": improvement_opportunity,
            "inferences": inferences,
        }

    def _create_positive_result(self):
        """Create a positive interview result."""
        # Generate base values for the primary prediction labels
        classifications = {}

        # For positive result, most values should be high
        # Choose only 0-1 labels to be low
        low_performers = random.sample(self.prediction_labels, random.randint(0, 1))

        # Set initial values
        for label in self.prediction_labels:
            if label in low_performers:
                classifications[label] = round(random.uniform(0.3, 0.6), 2)
            else:
                classifications[label] = round(random.uniform(0.7, 1.0), 2)

        # Apply relationships
        self._apply_relationships(classifications)

        # Determine good performance and improvement opportunity categories
        good_performance, improvement_opportunity = (
            self._determine_performance_categories(classifications)
        )

        # Ensure we have 5-6 good performances and only 2 areas to improve
        good_count = random.randint(5, 6)
        if len(good_performance) < good_count:
            additional_good = random.sample(
                [
                    c
                    for c in self.all_categories
                    if c not in good_performance + improvement_opportunity
                ],
                good_count - len(good_performance),
            )
            good_performance.extend(additional_good)
        elif len(good_performance) > good_count:
            good_performance = random.sample(good_performance, good_count)

        if len(improvement_opportunity) < 2:
            additional_improve = random.sample(
                [
                    c
                    for c in self.all_categories
                    if c not in good_performance + improvement_opportunity
                ],
                2 - len(improvement_opportunity),
            )
            improvement_opportunity.extend(additional_improve)
        elif len(improvement_opportunity) > 2:
            improvement_opportunity = random.sample(improvement_opportunity, 2)

        # Generate inferences
        inferences = self._generate_inferences(
            classifications, good_performance, improvement_opportunity
        )

        return {
            "classifications": classifications,
            "good_performance": good_performance,
            "improvement_opportunity": improvement_opportunity,
            "inferences": inferences,
        }

    def _apply_relationships(self, classifications):
        """
        Apply the defined relationships between labels to ensure consistency.

        Args:
            classifications (dict): Dictionary of label classifications to be adjusted
        """
        # Iterate through the relationships and adjust values
        for label1, label2, relationship in self.relationships:
            if label1 in classifications and label2 in classifications:
                base_value = classifications[label1]

                # Ensure the relationship is maintained
                if relationship == 1:  # Directly proportional
                    # The second label should be similar to the first (with small variation)
                    new_value = base_value + random.uniform(-0.1, 0.1)
                else:  # Inversely proportional
                    # The second label should be roughly the inverse of the first
                    new_value = 1.0 - base_value + random.uniform(-0.1, 0.1)

                # Ensure the value stays within bounds
                classifications[label2] = max(0.1, min(1.0, new_value))
                classifications[label2] = round(classifications[label2], 2)

    def _determine_performance_categories(self, classifications):
        """
        Determine good performance and improvement opportunity categories based on prediction values.

        Args:
            classifications (dict): Dictionary of label classifications

        Returns:
            tuple: (good_performance, improvement_opportunity) lists
        """
        good_performance = []
        improvement_opportunity = []

        # Threshold for determining good vs. needs improvement
        threshold = 0.6

        # First determine performance for predicted labels
        for label in self.prediction_labels:
            if classifications[label] >= threshold:
                good_performance.append(label)
            else:
                improvement_opportunity.append(label)

        # Now add additional categories based on relationships

        # If excited and engaging tone were good, add "Friendly" to good performance
        if "Excited" in good_performance and "EngagingTone" in good_performance:
            if (
                "Friendly" not in good_performance
                and "Friendly" not in improvement_opportunity
            ):
                good_performance.append("Friendly")

        # If calm and paused were good, add "NotStressed" to good performance
        if "Calm" in good_performance and "Paused" in good_performance:
            if (
                "NotStressed" not in good_performance
                and "NotStressed" not in improvement_opportunity
            ):
                good_performance.append("NotStressed")

        # If NoFillers was good, add "StructuredAnswers" to good performance
        if "NoFillers" in good_performance:
            if (
                "StructuredAnswers" not in good_performance
                and "StructuredAnswers" not in improvement_opportunity
            ):
                good_performance.append("StructuredAnswers")

        # If excitement or engaging tone were poor, add "EyeContact" to improvement
        if (
            "Excited" in improvement_opportunity
            or "EngagingTone" in improvement_opportunity
        ):
            if (
                "EyeContact" not in good_performance
                and "EyeContact" not in improvement_opportunity
            ):
                improvement_opportunity.append("EyeContact")

        # If NoFillers was poor, add "Focused" to improvement
        if "NoFillers" in improvement_opportunity:
            if (
                "Focused" not in good_performance
                and "Focused" not in improvement_opportunity
            ):
                improvement_opportunity.append("Focused")

        # Add other categories randomly to either list to reach required counts
        remaining_categories = [
            c
            for c in self.all_categories
            if c not in good_performance and c not in improvement_opportunity
        ]

        return good_performance, improvement_opportunity

    def _generate_inferences(
        self, classifications, good_performance, improvement_opportunity
    ):
        """
        Generate human-readable inferences based on the classification results.

        Args:
            classifications (dict): Dictionary of label classifications
            good_performance (list): List of good performance categories
            improvement_opportunity (list): List of improvement opportunity categories

        Returns:
            list: List of inference sentences
        """
        inferences = []

        # Generate inferences based on relationships
        if "Excited" in good_performance and "EngagingTone" in good_performance:
            inferences.append(
                "Your enthusiasm translated well into an engaging tone, which is excellent for keeping the interviewer interested."
            )

        if "Excited" in good_performance and "NoFillers" in good_performance:
            inferences.append(
                "Your excitement was well-channeled into clear speech without unnecessary fillers."
            )

        if "Paused" in good_performance and "NoFillers" in good_performance:
            inferences.append(
                "You balanced pauses well while maintaining fluency, showing thoughtfulness without speech fillers."
            )

        if "Calm" in good_performance and "NoFillers" in good_performance:
            inferences.append(
                "Your calm demeanor helped you articulate clearly without filler words."
            )

        if "Paused" in good_performance and "Calm" in good_performance:
            inferences.append(
                "Your strategic pauses reflected a calm and composed interview presence."
            )

        if "Excited" in good_performance and "Paused" in improvement_opportunity:
            inferences.append(
                "While your enthusiasm is a strength, incorporating more strategic pauses would help balance your responses."
            )

        if "EngagingTone" in good_performance and "Paused" in improvement_opportunity:
            inferences.append(
                "Your engaging tone is effective, but adding thoughtful pauses would make your key points more impactful."
            )

        if "Paused" in good_performance and "Excited" in improvement_opportunity:
            inferences.append(
                "You used pauses effectively, but could benefit from showing more enthusiasm about the opportunity."
            )

        if "Paused" in good_performance and "EngagingTone" in improvement_opportunity:
            inferences.append(
                "While your thoughtful pauses are good, varying your tone would make your answers more engaging."
            )

        if "NoFillers" in improvement_opportunity:
            inferences.append(
                "Reducing filler words like 'um' and 'uh' would make your communication more confident and clear."
            )

        if "Calm" in improvement_opportunity:
            inferences.append(
                "Working on maintaining a calmer demeanor would help you appear more confident and composed."
            )

        if "Excited" in improvement_opportunity:
            inferences.append(
                "Showing more enthusiasm about the role and company would demonstrate your genuine interest."
            )

        if "EngagingTone" in improvement_opportunity:
            inferences.append(
                "Varying your vocal tone would make your responses more engaging and prevent monotony."
            )

        # Add some general inferences based on performance
        if len(good_performance) > len(improvement_opportunity):
            inferences.append(
                "Overall, you demonstrated several interview strengths, with a few specific areas for improvement."
            )
        elif len(good_performance) < len(improvement_opportunity):
            inferences.append(
                "While you have some solid interview skills, focusing on the identified improvement areas would significantly enhance your performance."
            )
        else:
            inferences.append(
                "Your interview showed a balanced mix of strengths and areas for improvement."
            )

        # Ensure we have at least 3 inferences
        if len(inferences) < 3:
            general_inferences = [
                "Making eye contact helps establish rapport and demonstrates confidence.",
                "Structured answers with clear examples make your responses more memorable.",
                "Balancing enthusiasm with professionalism creates a positive impression.",
                "Focused responses that address the question directly show good communication skills.",
            ]
            inferences.extend(
                random.sample(
                    general_inferences,
                    min(3 - len(inferences), len(general_inferences)),
                )
            )

        return inferences
