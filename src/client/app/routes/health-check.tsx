import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { healthCheck as interviewAnalysisMicroSvcHealthCheck } from "~/backend/interview-analysis/client";
import type { HealthCheckResponse } from "~/backend/interview-analysis/stubs";
import { healthCheck as postureAnalysisMicroSvcHealthCheck } from "~/backend/posture-analysis/client";
import type { PostureHealthCheckResponse } from "~/backend/posture-analysis/stubs";

interface ApiState {
  interview: {
    data: HealthCheckResponse | null;
    loading: boolean;
    error: string | null;
  };
  posture: {
    data: PostureHealthCheckResponse | null;
    loading: boolean;
    error: string | null;
  };
}

export default function HealthCheck() {
  const [apiState, setApiState] = useState<ApiState>({
    interview: {
      data: null,
      loading: true,
      error: null,
    },
    posture: {
      data: null,
      loading: true,
      error: null,
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const fetchHealthStatus = async () => {
    setRefreshing(true);

    // Reset loading states
    setApiState((prev) => ({
      interview: { ...prev.interview, loading: true, error: null },
      posture: { ...prev.posture, loading: true, error: null },
    }));

    // Fetch interview API health
    try {
      const interviewData = await interviewAnalysisMicroSvcHealthCheck();
      setApiState((prev) => ({
        ...prev,
        interview: {
          data: interviewData.data,
          loading: false,
          error: null,
        },
      }));
    } catch (error) {
      setApiState((prev) => ({
        ...prev,
        interview: {
          data: null,
          loading: false,
          error: "Failed to connect to Interview API",
        },
      }));
    }

    // Fetch posture API health
    try {
      const postureData = await postureAnalysisMicroSvcHealthCheck();
      setApiState((prev) => ({
        ...prev,
        posture: {
          data: postureData.data,
          loading: false,
          error: null,
        },
      }));
    } catch (error) {
      setApiState((prev) => ({
        ...prev,
        posture: {
          data: null,
          loading: false,
          error: "Failed to connect to Posture API",
        },
      }));
    }

    setRefreshing(false);
  };

  useEffect(() => {
    fetchHealthStatus();

    // Set up interval to refresh status every 30 seconds
    const intervalId = setInterval(fetchHealthStatus, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getStatusIcon = (service: "interview" | "posture") => {
    const { data, loading, error } = apiState[service];

    if (loading)
      return (
        <div className="w-8 h-8 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      );
    if (error) return <XCircle className="w-8 h-8 text-red-500" />;
    if (data?.status === "ok")
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
  };

  const getStatusClass = (service: "interview" | "posture") => {
    const { data, loading, error } = apiState[service];

    if (loading) return "bg-gray-100";
    if (error) return "bg-red-50 border-red-200";
    if (data?.status === "ok") return "bg-green-50 border-green-200";
    return "bg-yellow-50 border-yellow-200";
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              System Health Status
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Monitor the operational status of all AceInterview services
            </p>
          </motion.div>
        </div>
      </section>

      {/* Health Status Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-6">
            <button
              onClick={fetchHealthStatus}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              <RefreshCw
                className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interview API Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`border rounded-lg shadow-md overflow-hidden ${getStatusClass(
                "interview"
              )}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Interview Analysis API
                  </h2>
                  {getStatusIcon("interview")}
                </div>

                {apiState.interview.loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                ) : apiState.interview.error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{apiState.interview.error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-indigo-600" />
                      <span className="font-semibold text-gray-700">
                        Status:
                      </span>
                      <span className="text-green-600 font-medium">
                        {apiState.interview.data?.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        Service:
                      </span>
                      <span>{apiState.interview.data?.service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        Queue Size:
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {apiState.interview.data?.queue_size} tasks in queue
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Posture API Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`border rounded-lg shadow-md overflow-hidden ${getStatusClass(
                "posture"
              )}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Posture Analysis API
                  </h2>
                  {getStatusIcon("posture")}
                </div>

                {apiState.posture.loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                ) : apiState.posture.error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{apiState.posture.error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-indigo-600" />
                      <span className="font-semibold text-gray-700">
                        Status:
                      </span>
                      <span className="text-green-600 font-medium">
                        {apiState.posture.data?.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        Service:
                      </span>
                      <span>{apiState.posture.data?.service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        Version:
                      </span>
                      <span>{apiState.posture.data?.version}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        Queue Size:
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {apiState.posture.data?.queue_size} tasks in queue
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* System Status Summary */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              System Status Summary
            </h2>

            {/* Overall System Status */}
            {apiState.interview.loading || apiState.posture.loading ? (
              <p className="text-lg text-gray-600">Checking system status...</p>
            ) : apiState.interview.error || apiState.posture.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-red-800">
                  Some systems are experiencing issues
                </p>
                <p className="text-gray-600 mt-2">
                  Please check individual services for details
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-green-800">
                  All systems operational
                </p>
                <p className="text-gray-600 mt-2">
                  AceInterview services are running normally
                </p>
              </div>
            )}

            {/* Last Updated */}
            <p className="text-sm text-gray-500 mt-8">
              Auto-refreshes every 30 seconds. Last updated:{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
