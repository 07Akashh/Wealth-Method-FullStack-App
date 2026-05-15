import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import toastHandler, { ToastStatus } from "./Toasthandler";
import allEnv from "../constants/index";
import { useAuthStore } from "../store/authStore";

const toast = toastHandler();

interface ApiResponseConfig extends AxiosRequestConfig {
  withoutToken?: boolean;
  noBase?: boolean;
  wantToast?: boolean;
  base_URL?: keyof typeof allEnv;
  accessName?: string;
  msg?: string;
  headers?: any;
  url?: string;
  method?: string;
}

interface CustomResponse {
  status: number;
  data?: any;
  msg?: string;
  error?: boolean;
  logout?: boolean;
  [key: string]: any;
}

export const ApiResponsehandler = async ({
  url,
  headers,
  base_URL,
  accessName,
  ...restConfig
}: ApiResponseConfig): Promise<CustomResponse | null> => {
  const accessToken = useAuthStore.getState().token;

  const allHeaders: Record<string, string> = {
    Authorization: "Basic QlJTUk1hc3RlcjpCUlNSTWFzdGVyQXV0aEAxMjM==",
    "Content-Type": "application/json",
  };

  if (!restConfig?.withoutToken && accessToken) {
    allHeaders[accessName || "accessToken"] = accessToken;
  }

  const baseUrl = (base_URL && typeof allEnv[base_URL] === 'string') 
    ? (allEnv[base_URL] as string) 
    : allEnv.BASE_URL;

  const config: AxiosRequestConfig = {
    url: restConfig?.noBase ? url : baseUrl + url,
    method: "GET",
    ...restConfig,
    headers: { ...allHeaders, ...headers },
  };

  try {
    const { data, status }: AxiosResponse = await axios(config);

    const response: CustomResponse = data?.res
      ? { ...data?.res, status: data?.status || status }
      : { data, status };

    if (response?.status === 200) {
      if (restConfig?.wantToast) {
        toast("sus", response?.msg || "Action successful!");
      }
      return response;
    } else if (response?.error || response?.status !== 200) {
      if (restConfig?.wantToast) {
        toast("warn", response?.msg || "Something went wrong!");
      }
      return null;
    }
    return response;
  } catch (error: any) {
    const err = error as AxiosError<any>;
    let res = err.response?.data || {};
    
    if (typeof res === "string") {
      try { res = JSON.parse(res); } catch (e) {}
    }

    const status = err.response?.status || (err as any).code || 500;
    const msg = res?.err?.msg || res?.msg || err.message || "Internal Server Error";

    if (status === 402 || status === 401) {
      return { logout: true, status };
    }

    if (restConfig?.wantToast) {
      toast("dan", msg);
    }

    return { msg, status, error: true };
  }
};
