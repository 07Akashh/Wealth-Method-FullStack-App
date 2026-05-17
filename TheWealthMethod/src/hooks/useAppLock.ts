import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

type UseAppLockParams = {
  enabled: boolean;
  isLocked: boolean;
  setLocked: (locked: boolean) => void;
  delayMs?: number;
};

export const useAppLock = ({
  enabled,
  isLocked,
  setLocked,
  delayMs = 900,
}: UseAppLockParams) => {
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearLockTimer = () => {
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      clearLockTimer();

      if (nextAppState.match(/inactive|background/) && enabled && !isLocked) {
        lockTimerRef.current = setTimeout(() => {
          if (AppState.currentState !== "active") {
            setLocked(true);
          }
        }, delayMs);
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      clearLockTimer();
      subscription.remove();
    };
  }, [delayMs, enabled, isLocked, setLocked]);
};