import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export type AnimatedSectionProps = {
  title: string;
  children: React.ReactNode;
  icon: React.ComponentType<any>;
};

export default function AnimatedSection({
  title,
  children,
  icon: Icon,
}: AnimatedSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md mb-6 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-indigo-50 hover:bg-indigo-100 transition-colors"
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5 text-indigo-600 mr-2" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-indigo-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-indigo-600" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
