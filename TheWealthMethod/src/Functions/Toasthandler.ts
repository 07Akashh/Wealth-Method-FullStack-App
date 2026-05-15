import { toast } from "@backpackapp-io/react-native-toast";

export type ToastStatus = "warn" | "dan" | "sus" | "info" | "default";

/**
 * Toast Handler wrapper for React Native (using backpackapp-io/react-native-toast)
 */
export default function toastHandler() {
  const lastMsg: string[] = [];

  return (status: ToastStatus, msg: string, options: any = {}) => {
    const msgStr = JSON.stringify(msg);
    const indexAt = lastMsg.indexOf(msgStr);

    const clearMsg = () => {
      const idx = lastMsg.indexOf(msgStr);
      if (idx !== -1) {
        lastMsg.splice(idx, 1);
      }
    };

    const opt = {
      duration: 4000,
      onDismiss: clearMsg,
      ...options,
    };

    if (indexAt === -1) {
      if (msg) lastMsg.push(msgStr);
      
      // Auto-clear from our tracking after duration
      setTimeout(clearMsg, opt.duration + 500);

      switch (status) {
        case "sus":
          return toast.success(msg, opt);
        case "dan":
          return toast.error(msg, opt);
        case "warn":
          // backpacktoast doesn't have warning by default, we use style or error
          return toast.error(msg, { ...opt, style: { backgroundColor: "#FF9100" } });
        case "info":
          return toast(msg, { ...opt });
        default:
          return toast(msg, opt);
      }
    }
  };
}
