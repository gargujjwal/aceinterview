import { useState, useCallback } from "react";
import { getLabelTips } from "~/backend/interview-analysis/client";

interface LabelTips {
  [label: string]: string[];
}

// Hook for fetching tips by label
export default function useLabelTips() {
  const [tips, setTips] = useState<LabelTips>({});
  const [loading, setLoading] = useState<{ [label: string]: boolean }>({});
  const [error, setError] = useState<{ [label: string]: string }>({});

  const fetchTips = useCallback(
    async (label: string) => {
      if (tips[label] || loading[label]) return;

      setLoading((prev) => ({ ...prev, [label]: true }));

      try {
        const { data } = await getLabelTips(label);

        if (data.success && data.tips) {
          setTips((prev) => ({ ...prev, [label]: data.tips }));
        } else {
          setError((prev) => ({
            ...prev,
            [label]: "Failed to fetch tips",
          }));
        }
      } catch (err) {
        setError((prev) => ({ ...prev, [label]: "Error fetching tips" }));
      } finally {
        setLoading((prev) => ({ ...prev, [label]: false }));
      }
    },
    [tips, loading]
  );

  return { tips, loading, error, fetchTips };
}
