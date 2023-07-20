import axios from "axios";
import { errorToast } from "../toast/toast";

const axiosInstance = axios.create({
 baseURL: process.env.REACT_APP_IGRANT_BACKEND_BASEURL,
//  baseURL: "/api",
});

const requestHandler = (request) => {
  const token = localStorage.getItem("igrant_token");
  if (token) {
    request.headers = { Authorization: `Bearer ${token}` };
  }
  return request;
};

const errorHandler = (error) => {
  if (error.response.status === 504) {
    errorToast("Request Timed out", "OK");
  } else {
    errorToast(error.response.data.message, "OK");
  }
  return Promise.reject({ ...error });
};

const responseHandler = (response) => {
  if (response.data.error) {
    errorToast(response.data.message, "OK");
  }
  return response;
};

axiosInstance.interceptors.request.use((request) => requestHandler(request));
axiosInstance.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

export default axiosInstance;
