import math


def angle_between_points(p1, p2):
    """
    Calculate the angle between two points in 3D space.

    Args:
        p1 (Point): First point, with attributes x, y, and z representing its coordinates.
        p2 (Point): Second point, with attributes x, y, and z representing its coordinates.

    Returns:
        float: Angle between the two points in degrees.

    Notes:
        - Requires the 'math' module.
        - The function uses the dot product of the vectors formed by the two points
          to calculate the angle between them.
    """
    x1, y1, z1 = p1.x, p1.y, p1.z
    x2, y2, z2 = p2.x, p2.y, p2.z

    # Calculate the dot product of the two vectors
    dot_product = x1 * x2 + y1 * y2 + z1 * z2

    # Calculate the magnitude of each vector
    magnitude1 = math.sqrt(x1**2 + y1**2 + z1**2)
    magnitude2 = math.sqrt(x2**2 + y2**2 + z2**2)

    # Calculate the cosine of the angle between the vectors
    cosine_angle = dot_product / (magnitude1 * magnitude2)

    # Ensure the value is in valid range for arccos
    cosine_angle = max(min(cosine_angle, 1.0), -1.0)

    # Use arccos to get the angle in radians
    angle_rad = math.acos(cosine_angle)

    # Convert radians to degrees
    angle_deg = math.degrees(angle_rad)

    return angle_deg


def calculate_average_angles(angles_data):
    """
    Calculate the average of each set of angles.

    Args:
        angles_data (dict): Dictionary containing lists of different angle measurements

    Returns:
        dict: Dictionary with the average value for each angle type
    """
    avg_angles = {}

    for angle_name, angle_list in angles_data.items():
        if angle_list:  # Check if the list is not empty
            avg_angles[angle_name] = sum(angle_list) / len(angle_list)
        else:
            avg_angles[angle_name] = 0

    return avg_angles


def generate_posture_feedback(avg_angles):
    """
    Generate feedback based on average angles.

    Args:
        avg_angles (dict): Dictionary with average angles

    Returns:
        dict: Feedback for each posture aspect
    """
    feedback_dict = {
        "Shoulder alignment": "",
        "Hand gestures": "",
        "Left Shoulder-Elbow": "",
        "Right Shoulder-Elbow": "",
    }

    if (
        avg_angles.get("Shoulders angle", 0) > 0
        and avg_angles.get("Shoulders angle", 0) < 16
    ):
        feedback_dict["Shoulder alignment"] = "✅"
    else:
        feedback_dict["Shoulder alignment"] = "❌"

    if (
        avg_angles.get("Left elbow-wrist angle", 0) != 0
        and avg_angles.get("Right elbow-wrist angle", 0) != 0
    ):
        feedback_dict["Hand gestures"] = "✅"
    else:
        feedback_dict["Hand gestures"] = "❌"

    if (
        avg_angles.get("Left shoulder-elbow angle", 0) > 0
        and avg_angles.get("Left shoulder-elbow angle", 0) < 20
    ):
        feedback_dict["Left Shoulder-Elbow"] = "✅"
    else:
        feedback_dict["Left Shoulder-Elbow"] = "❌"

    if (
        avg_angles.get("Right shoulder-elbow angle", 0) > 0
        and avg_angles.get("Right shoulder-elbow angle", 0) < 20
    ):
        feedback_dict["Right Shoulder-Elbow"] = "✅"
    else:
        feedback_dict["Right Shoulder-Elbow"] = "❌"

    return feedback_dict
