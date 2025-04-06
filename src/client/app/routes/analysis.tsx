import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Upload,
  XCircle,
} from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import AnimatedSection from "~/components/animated-section";
import LoadingFacts from "~/components/loading-facts";
import useInterviewAnalysisTask from "~/hooks/use-interview-analysis-task";
import usePostureAnalysisTask from "~/hooks/use-posture-analysis-task";
import { generateRandomId } from "~/utils";

interface LabelTips {
  [label: string]: string[];
}

const ALL_TIPS: LabelTips = {
  Engaged: [
    "Maintain eye contact with the camera to convey attentiveness and interest.",
    "Use positive body language to express enthusiasm and engagement.",
    "Ask thoughtful questions and actively listen to the interviewer's prompts.",
  ],
  EyeContact: [
    "Focus on looking directly into the camera for a virtual interview.",
    "Avoid excessive staring at notes or distractions in the room.",
    "Practice a balance between maintaining eye contact and natural blinking.",
  ],
  Smiled: [
    "Smile naturally and periodically throughout the interview.",
    "Practice a friendly and approachable facial expression.",
    "Be mindful of not appearing overly serious or expressionless.",
  ],
  Excited: [
    "Express genuine enthusiasm and excitement about the opportunity.",
    "Use positive and energetic language to convey your interest in the role.",
    "Share specific reasons why you are excited about the prospect of joining the company.",
  ],
  SpeakingRate: [
    "Speak at a moderate pace to ensure clarity and comprehension.",
    "Practice using pauses strategically to emphasize key points.",
    "Avoid speaking too rapidly, which can be challenging for the interviewer to follow.",
  ],
  NoFillers: [
    "Minimize the use of filler words such as 'um,' 'uh,' or 'like.'",
    "Practice pausing instead of using fillers to gather thoughts.",
    "Consciously focus on speaking with clarity and precision.",
  ],
  Friendly: [
    "Project a warm and approachable tone throughout the conversation.",
    "Use positive language and expressions to convey friendliness.",
    "Express genuine interest in the role and the company.",
  ],
  Paused: [
    "Use strategic pauses to allow the interviewer to process information.",
    "Avoid rushing through responses; take your time to formulate answers.",
    "Pausing can convey thoughtfulness and professionalism.",
  ],
  EngagingTone: [
    "Vary your tone to add emphasis and interest to your responses.",
    "Avoid a monotonous voice by incorporating changes in pitch and intonation.",
    "Practice conveying enthusiasm and passion through your tone.",
  ],
  StructuredAnswers: [
    "Organize your responses with a clear introduction, body, and conclusion.",
    "Use examples and anecdotes to illustrate your points.",
    "Practice concise and focused answers to showcase your communication skills.",
  ],
  Calm: [
    "Practice mindfulness techniques to stay calm and composed.",
    "Breathe deeply to manage nervousness and stress.",
    "Remember that it's okay to take a moment to collect your thoughts.",
  ],
  NotStressed: [
    "Prioritize self-care before the interview to reduce stress levels.",
    "Prepare thoroughly to build confidence in your knowledge and abilities.",
    "Focus on the present moment and the opportunity to showcase your skills.",
  ],
  Focused: [
    "Demonstrate active listening by fully engaging with the interviewer's questions.",
    "Maintain a clear and concise focus on relevant details in your responses.",
    "Avoid distractions and stay present throughout the interview.",
  ],
  NotAwkward: [
    "Practice common interview scenarios to build confidence.",
    "Maintain professional and confident body language.",
    "Remember that it's okay to acknowledge nerves and redirect them into positive energy.",
  ],
};

export default function Analysis() {
  // Setup hooks for both analysis types
  const postureAnalysis = usePostureAnalysisTask();
  const interviewAnalysis = useInterviewAnalysisTask();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Reset both analyses
      postureAnalysis.reset();
      interviewAnalysis.reset();

      // Start both analyses simultaneously
      postureAnalysis.startAnalysis(file);
      interviewAnalysis.startAnalysis(file);
    },
    [postureAnalysis, interviewAnalysis]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi"],
    },
    maxFiles: 1,
  });

  const areAllAnalysesComplete =
    postureAnalysis.state === "complete" &&
    interviewAnalysis.state === "complete";

  const hasAnyError =
    postureAnalysis.state === "error" || interviewAnalysis.state === "error";

  const resetAll = () => {
    postureAnalysis.reset();
    interviewAnalysis.reset();
  };

  const renderUploadSection = () => {
    if (
      postureAnalysis.state !== "idle" &&
      interviewAnalysis.state !== "idle" &&
      !hasAnyError
    ) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            Drag & drop your interview video here, or click to select
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: MP4, MOV, AVI
          </p>
          <p className="text-xs text-gray-400 mt-4">
            We'll analyze both your posture and interview performance
          </p>
        </div>
      </motion.div>
    );
  };

  const renderAnalysisState = (
    title: string,
    state: string,
    uploadProgress: number,
    error: string | null
  ) => {
    switch (state) {
      case "uploading":
        return (
          <AnimatedSection title={title} icon={Upload}>
            <div className="text-center">
              <p className="text-gray-600 mb-4">Uploading video...</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <motion.div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>
              <p className="text-sm text-gray-500">
                {uploadProgress}% complete
              </p>
            </div>
          </AnimatedSection>
        );

      case "analyzing":
        return (
          <AnimatedSection title={title} icon={TrendingUp}>
            <div className="text-center">
              <p className="text-gray-600 mb-4">Analyzing your video...</p>
              <LoadingFacts />
            </div>
          </AnimatedSection>
        );

      case "error":
        return (
          <AnimatedSection title={title} icon={AlertTriangle}>
            <div className="text-center text-red-600">
              <XCircle className="w-12 h-12 mx-auto mb-4" />
              <p>{error ?? "An error occurred during analysis"}</p>
            </div>
          </AnimatedSection>
        );

      default:
        return null;
    }
  };

  // Function to display posture analysis results
  const renderPostureResults = () => {
    if (postureAnalysis.state !== "complete" || !postureAnalysis.result) {
      return null;
    }

    const result = postureAnalysis.result;

    return (
      <AnimatedSection title="Posture Analysis Results" icon={CheckCircle}>
        {result.status === "success" ? (
          <div className="space-y-8">
            {/* Average Angles Section */}
            <div>
              <h4 className="text-lg font-medium mb-4">Average Angles</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(result.average_angles).map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-indigo-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-gray-700">{key}</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {value.toFixed(1)}°
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Posture Feedback Section */}
            <div>
              <h4 className="text-lg font-medium mb-4">Posture Feedback</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.feedback).map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
                  >
                    {value === "✅" ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{key}</p>
                      <p className="text-gray-600">{value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Inferences Section - New */}
            {result.inferences && result.inferences.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-4">Posture Inferences</h4>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-indigo-100 rounded-lg p-5 shadow-sm"
                >
                  <ul className="list-disc pl-5 space-y-3 text-gray-700">
                    {result.inferences.map((inference, index) => (
                      <motion.li
                        key={generateRandomId()}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {inference}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            )}

            {/* Tips Section - New */}
            {result.tips && result.tips.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-4">Improvement Tips</h4>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-indigo-100 shadow-sm">
                  <div className="grid grid-cols-1 gap-4">
                    {result.tips.map((tip, index) => (
                      <motion.div
                        key={generateRandomId()}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.15 }}
                        className="flex items-start space-x-3"
                      >
                        <Info className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700">{tip}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stats Footer */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
              <p>
                Analyzed {result.stats.processed_frames} frames from your video
                (
                {Math.round(
                  (result.stats.processed_frames / result.stats.total_frames) *
                    100
                )}
                % of total frames)
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600">
            <XCircle className="w-12 h-12 mx-auto mb-4" />
            <p>{result.message || "An error occurred during analysis"}</p>
          </div>
        )}
      </AnimatedSection>
    );
  };

  // Function to display interview analysis results
  const renderInterviewResults = () => {
    if (interviewAnalysis.state !== "complete" || !interviewAnalysis.result) {
      return null;
    }

    const result = interviewAnalysis.result;

    return (
      <AnimatedSection
        title="Interview Performance Analysis"
        icon={CheckCircle}
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-4">Communication Style</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(result.classifications).map(([key, value]) => {
                // Convert value to percentage
                const percentage = Math.round(value * 100);

                // Style descriptions mapping
                const styleDescriptions = {
                  Excited:
                    "You show enthusiasm and energy that engages interviewers - higher score indicates excellent passion in your delivery",
                  Paused:
                    "You incorporate thoughtful pauses that show reflection - higher score indicates well-timed, strategic pauses",
                  EngagingTone:
                    "You speak with a dynamic and captivating tone - higher score indicates excellent vocal variety and engagement",
                  Calm: "You maintain composure and poise throughout - higher score indicates excellent stress management",
                  NoFillers:
                    "You speak without unnecessary filler words - higher score indicates clearer, more polished communication",
                  // Fallback for any undefined styles
                  default:
                    "Communication strength identified in your interview responses",
                };

                // Get description or use default if not found
                const description =
                  // @ts-expect-error
                  styleDescriptions[key] || styleDescriptions.default;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-indigo-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-gray-700">{key}</p>
                    <p className="text-xs text-gray-600 mt-1 mb-2 italic">
                      {description}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <motion.div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5 }}
                        ></motion.div>
                      </div>
                      <span className="text-indigo-700 font-medium">
                        {percentage}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Inferences</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {result.inferences.map((inference, index) => (
                <motion.li
                  key={generateRandomId()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {inference}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-4">Areas of Excellence</h4>
              <div className="space-y-4">
                {result.good_performance.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white border border-green-100 rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="bg-green-50 p-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-800 font-medium">{item}</span>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-green-800 mb-2">
                        Tips to maintain this strength:
                      </h5>
                      {ALL_TIPS[item] ? (
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                          {ALL_TIPS[item].map((tip, i) => (
                            <li key={generateRandomId()}>{tip}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600 italic">
                          Continue practicing this skill to maintain your strong
                          performance.
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">
                Areas for Improvement
              </h4>
              <div className="space-y-4">
                {result.improvement_opportunity.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white border border-yellow-100 rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="bg-yellow-50 p-3 flex items-center">
                      <TrendingUp className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800 font-medium">
                        {item}
                      </span>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-yellow-800 mb-2">
                        Improvement tips:
                      </h5>
                      {ALL_TIPS[item] ? (
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                          {ALL_TIPS[item].map((tip, i) => (
                            <li key={generateRandomId()}>{tip}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600 italic">
                          Focus on developing this skill to enhance your
                          interview performance.
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-4 text-indigo-900"
        >
          Interview Analysis
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 mb-8"
        >
          Upload your interview video to get feedback on both posture and
          interview skills
        </motion.p>

        {renderUploadSection()}

        {/* Show progress or analysis state for each analysis type */}
        {renderAnalysisState(
          "Posture Analysis",
          postureAnalysis.state,
          postureAnalysis.uploadProgress,
          postureAnalysis.error
        )}

        {renderAnalysisState(
          "Interview Analysis",
          interviewAnalysis.state,
          interviewAnalysis.uploadProgress,
          interviewAnalysis.error
        )}

        {/* Render results when they're available */}
        {renderPostureResults()}
        {renderInterviewResults()}

        {/* Retry button if there are errors */}
        {hasAnyError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <button
              onClick={resetAll}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Show a new upload button after analyses are complete */}
        {areAllAnalysesComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <button
              onClick={resetAll}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              Analyze Another Video
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
