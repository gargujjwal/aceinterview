import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Video, Users, Brain, Award } from "lucide-react";
import type { Route } from "../+types/root";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AceInterview | Home" },
    {
      name: "description",
      content:
        "Get personalized feedback on your interview performance through advanced video analysis",
    },
  ];
}

export default function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Your Interview Skills with AI
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Get personalized feedback on your interview performance through
              advanced video analysis
            </p>
            <Link
              to="/analysis"
              className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors inline-block"
            >
              Start Analysis
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={ref} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <div className="text-center p-6">
              <Video className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Video Analysis</h3>
              <p className="text-gray-600">
                Upload your interview recordings for comprehensive analysis
              </p>
            </div>
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Posture Assessment</h3>
              <p className="text-gray-600">
                Get feedback on your body language and posture
              </p>
            </div>
            <div className="text-center p-6">
              <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Receive detailed insights powered by advanced AI
              </p>
            </div>
            <div className="text-center p-6">
              <Award className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Improvement Tips</h3>
              <p className="text-gray-600">
                Get actionable recommendations for improvement
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of candidates who have improved their interview
            skills with AceInterview
          </p>
          <Link
            to="/analysis"
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors inline-block"
          >
            Start Analysis
          </Link>
        </div>
      </section>
    </div>
  );
}
