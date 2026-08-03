import axios from "axios";

let activeRequests = 0;

const showLoader = () => {
  activeRequests += 1;
  window.dispatchEvent(new CustomEvent("global-loading", { detail: true }));
};

const hideLoader = () => {
  activeRequests -= 1;

  if (activeRequests <= 0) {
    activeRequests = 0;
    window.dispatchEvent(new CustomEvent("global-loading", { detail: false }));
  }
};

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    showLoader();

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    hideLoader();
    return response;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

export default api;
