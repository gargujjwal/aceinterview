import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const interviewFacts = [
  "93% of hiring managers cite nonverbal communication as a crucial factor in their decision-making process.",
  "Maintaining eye contact for 60-70% of the interview time is considered optimal.",
  "It takes only 7 seconds to make a first impression in an interview.",
  "Mirroring the interviewer's body language can increase rapport by up to 67%.",
  "Candidates who use hand gestures are perceived as more engaging and confident.",
  "Speaking at a rate of 125-150 words per minute is considered ideal for interviews.",
  "Smiling increases your chances of getting called back by 50%.",
  "Power posing for 2 minutes before an interview can boost confidence levels.",
];

const LoadingFacts = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % interviewFacts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      <div className="mb-8">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <div className="h-24 relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentFactIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-gray-700 absolute inset-0"
          >
            {interviewFacts[currentFactIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoadingFacts;
