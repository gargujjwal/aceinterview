import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Database,
  Server,
  Cpu,
  Video,
  MessageSquare,
  BarChart,
} from "lucide-react";

import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ title: "AceInterview | About us" }];
}

export default function Architecture() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              System Architecture
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Discover how our advanced AI system analyzes and processes
              interview recordings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center">
              System Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <Video className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Video Processing</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• High-definition video support</li>
                  <li>• Quality validation</li>
                  <li>• Frame extraction</li>
                  <li>• Preprocessing pipeline</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <Cpu className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Posture detection</li>
                  <li>• Facial expression analysis</li>
                  <li>• Gesture recognition</li>
                  <li>• Behavioral assessment</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Audio Processing</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Speech-to-text conversion</li>
                  <li>• Tone analysis</li>
                  <li>• Pace measurement</li>
                  <li>• Vocal clarity assessment</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Flow */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Technical Flow
          </h2>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-between">
              <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                <Video className="h-8 w-8 text-indigo-600 mb-2" />
                <span className="text-sm font-medium">Input</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                <Server className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Processing</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                <Database className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                <BarChart className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Technical Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Video Processing</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Support for 4K resolution</li>
                <li>• Frame rate analysis</li>
                <li>• Lighting condition detection</li>
                <li>• Face visibility validation</li>
                <li>• Body positioning checks</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">AI Components</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• MediaPipe for pose estimation</li>
                <li>• CNN for emotion detection</li>
                <li>• PRAAT for audio analysis</li>
                <li>• Custom ML models for behavior</li>
                <li>• Real-time processing capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
