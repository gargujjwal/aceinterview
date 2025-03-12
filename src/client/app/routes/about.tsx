import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Target, Users, Trophy, Lightbulb } from "lucide-react";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ title: "AceInterview | About us" }];
}

export default function AboutUs() {
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
              About AceInterview
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              We're revolutionizing interview preparation through AI-powered
              analysis and personalized feedback.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At AceInterview, we believe everyone deserves the opportunity to
                present their best self during interviews. Our mission is to
                democratize interview preparation by leveraging cutting-edge AI
                technology to provide personalized feedback and actionable
                insights.
              </p>
              <p className="text-lg text-gray-600">
                Through advanced video analysis and posture assessment, we help
                candidates identify areas for improvement and build confidence
                in their interview skills.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <Target className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Precision</h3>
                <p className="text-gray-600">
                  Advanced AI analysis for accurate feedback
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <Users className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Support</h3>
                <p className="text-gray-600">Dedicated to user success</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <Trophy className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600">Commitment to quality</p>
              </div>
              <div className="bg-pink-50 p-6 rounded-lg">
                <Lightbulb className="h-10 w-10 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">Cutting-edge technology</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-xl text-gray-600">
              Meet the expert behind AceInterview
            </p>
          </motion.div>
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
              <img
                src="https://avatars.githubusercontent.com/u/89966270?v=4"
                alt="Team Member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2 text-center">
                Ujjwal Garg
              </h3>
              <p className="text-gray-600 text-center">
                Creator of AceInterview
              </p>
              <p className="text-gray-600 text-center mt-4">
                An avid anime fan and a 10x programmer who has a passion for
                TypeScript. I believe code is like humor. When you have to
                explain it, it's bad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
