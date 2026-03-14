import axios from "axios";

const base =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5001/api";

const client = axios.create({
  baseURL: base,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token from persisted store
client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const auth = localStorage.getItem("siyara-auth");
    if (auth) {
      try {
        const { state } = JSON.parse(auth);
        if (state?.userInfo?.token) {
          config.headers.Authorization = `Bearer ${state.userInfo.token}`;
        }
      } catch (_) {}
    }
  }
  return config;
});

export default client;