import { useEffect, useState } from "react";

export const useAppReady = () => {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prepare = async () => {
      // Direct API Ready state
      setProgress(1);
      await new Promise(resolve => setTimeout(resolve, 500));
      setReady(true);
    };

    prepare();
  }, []);

  return { ready, progress };
};
