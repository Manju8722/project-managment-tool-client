import { useStore } from "@/store/store";
import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.request.use((config) => {
  const access_token = useStore.getState().access_token;
  if (access_token) {
    config.headers.Authorization = "Bearer " + access_token;
  }

  return config;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response;
    // if (data === "Unauthorized" && status === 401) {
    //   window.location.href = "/";
    // }
    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
