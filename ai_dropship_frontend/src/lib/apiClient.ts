// src/lib/apiClient.ts
import axios from "axios";

// Get the backend API base URL from environment variables
// Fallback to localhost for local development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// You can add interceptors here for handling errors, adding auth tokens, etc.
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle errors globally
//     console.error("API call error:", error);
//     return Promise.reject(error);
//   }
// );

export default apiClient;

