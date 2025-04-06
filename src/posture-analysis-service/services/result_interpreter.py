class ResultInterpreter:
    """
    Interprets posture analysis results and provides detailed inferences and improvement tips.
    """

    def __init__(self):
        """
        Initialize the result interpreter.
        """
        pass

    def interpret_results(self, analysis_result):
        """
        Enhance analysis results with inferences and improvement tips.

        Args:
            analysis_result (dict): The original analysis results

        Returns:
            dict: Enhanced analysis results with inferences and tips
        """
        if analysis_result.get("status") != "success":
            return analysis_result

        avg_angles = analysis_result.get("average_angles", {})
        feedback = analysis_result.get("feedback", {})

        # Generate inferences and tips
        inferences = self._generate_inferences(avg_angles, feedback)
        tips = self._generate_tips(avg_angles, feedback)

        # Add new fields to the result
        enhanced_result = analysis_result.copy()
        enhanced_result["inferences"] = inferences
        enhanced_result["tips"] = tips

        return enhanced_result

    def _generate_inferences(self, avg_angles, feedback):
        """
        Generate natural language inferences based on angles and feedback.

        Args:
            avg_angles (dict): Dictionary of average angles
            feedback (dict): Dictionary of feedback assessments

        Returns:
            list: List of inference strings
        """
        inferences = []

        # Shoulder alignment inferences
        shoulder_angle = avg_angles.get("Shoulders angle", 0)
        if feedback.get("Shoulder alignment") == "❌":
            if shoulder_angle >= 16:
                inferences.append(
                    f"Your shoulders appear uneven with an angle of {shoulder_angle:.1f}° (ideal is below 16°), suggesting possible hunching or leaning to one side."
                )
            elif shoulder_angle == 0:
                inferences.append(
                    "Your shoulders weren't clearly visible or detected properly in the video."
                )
        else:
            inferences.append(
                "Your shoulder alignment is good, showing a balanced posture."
            )

        # Hand gesture inferences
        l_hand_angle = avg_angles.get("Left elbow-wrist angle", 0)
        r_hand_angle = avg_angles.get("Right elbow-wrist angle", 0)
        if feedback.get("Hand gestures") == "❌":
            inferences.append(
                "You appear to have limited hand movements or gestures, which can make your presentation less engaging."
            )
        else:
            inferences.append(
                "You're using appropriate hand gestures, which helps with engagement and emphasis."
            )

        # Shoulder-Elbow inferences
        l_shoulder_elbow = avg_angles.get("Left shoulder-elbow angle", 0)
        r_shoulder_elbow = avg_angles.get("Right shoulder-elbow angle", 0)

        if feedback.get("Left Shoulder-Elbow") == "❌":
            if l_shoulder_elbow >= 20:
                inferences.append(
                    f"Your left arm position appears stiff or raised (angle: {l_shoulder_elbow:.1f}°), which may indicate tension."
                )

        if feedback.get("Right Shoulder-Elbow") == "❌":
            if r_shoulder_elbow >= 20:
                inferences.append(
                    f"Your right arm position appears stiff or raised (angle: {r_shoulder_elbow:.1f}°), which may indicate tension."
                )

        if (
            feedback.get("Left Shoulder-Elbow") == "✅"
            and feedback.get("Right Shoulder-Elbow") == "✅"
        ):
            inferences.append(
                "Your arm positioning is relaxed and natural, which conveys confidence."
            )

        return inferences

    def _generate_tips(self, avg_angles, feedback):
        """
        Generate improvement tips based on angles and feedback.

        Args:
            avg_angles (dict): Dictionary of average angles
            feedback (dict): Dictionary of feedback assessments

        Returns:
            list: List of tip strings
        """
        tips = []

        # Shoulder alignment tips
        if feedback.get("Shoulder alignment") == "❌":
            tips.append(
                "Practice standing straight with shoulders back and aligned. Try exercises like wall angels to improve shoulder posture."
            )

        # Hand gesture tips
        if feedback.get("Hand gestures") == "❌":
            tips.append(
                "Incorporate more natural hand gestures to emphasize key points. Practice speaking with open palms and varied hand positions."
            )

        # Arm position tips
        if (
            feedback.get("Left Shoulder-Elbow") == "❌"
            or feedback.get("Right Shoulder-Elbow") == "❌"
        ):
            tips.append(
                "Try to keep your arms relaxed at your sides when not gesturing. Shake out tension in your arms before presenting."
            )

        # General tips
        if len(tips) > 0:
            tips.append(
                "Record yourself practicing and watch the recording to become more aware of your posture habits."
            )
            tips.append(
                "Take deep breaths before presenting to help reduce physical tension that affects posture."
            )
        else:
            tips.append(
                "Your posture is already good! Continue maintaining awareness of your body positioning during presentations."
            )

        return tips
