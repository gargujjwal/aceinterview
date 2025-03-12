const {
  VITE_INTERVIEW_ANALYSIS_MICROSVC_BASE_URL,
  VITE_POSTURE_ANALYSIS_MICROSVC_BASE_URL,
  ...otherViteConfig
} = import.meta.env;

export const env = {
  INTERVIEW_ANALYSIS_MICROSVC_BASE_URL:
    VITE_INTERVIEW_ANALYSIS_MICROSVC_BASE_URL as string,
  POSTURE_ANALYSIS_MICROSVC_BASE_URL:
    VITE_POSTURE_ANALYSIS_MICROSVC_BASE_URL as string,
  __vite__: otherViteConfig,
};

// This is one of the few places where I recommend adding a `console.log` statement
// To make it easy to figure out the frontend environment config at any moment
if (env.__vite__.MODE === "development") {
  console.dir(env);
}
