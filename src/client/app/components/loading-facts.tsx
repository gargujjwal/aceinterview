import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Define the type for our facts array
const interviewFacts: string[] = [
  "93% of hiring managers cite nonverbal communication as a crucial factor in their decision-making process.",
  "Maintaining eye contact for 60-70% of the interview time is considered optimal.",
  "It takes only 7 seconds to make a first impression in an interview.",
  "Mirroring the interviewer's body language can increase rapport by up to 67%.",
  "Candidates who use hand gestures are perceived as more engaging and confident.",
  "Speaking at a rate of 125-150 words per minute is considered ideal for interviews.",
  "Smiling increases your chances of getting called back by 50%.",
  "Power posing for 2 minutes before an interview can boost confidence levels.",
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: string[]): string[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const LoadingFacts: React.FC = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState<number>(0);
  const [shuffledFacts, setShuffledFacts] = useState<string[]>([]);

  // Shuffle facts
  useEffect(() => {
    setShuffledFacts(shuffleArray(interviewFacts));
  }, []);

  // Cycle through facts at interval
  useEffect(() => {
    if (shuffledFacts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % shuffledFacts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [shuffledFacts]);

  // Don't render anything until we have our shuffled facts
  if (shuffledFacts.length === 0) return null;

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
            {shuffledFacts[currentFactIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoadingFacts;
