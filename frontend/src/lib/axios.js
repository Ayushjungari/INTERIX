import axios from "axios";

/**
 * API base URL resolution.
 *
 * - Local dev: VITE_API_URL is defined in frontend/.env (http://localhost:8000/api)
 *   and is inlined by Vite at build time.
 * - Production (Railway): the backend serves the built frontend from the SAME
 *   origin, so "/api" is always correct. This fallback guarantees requests hit
 *   /api/sessions even if VITE_API_URL is missing during the production build.
 *
 * Trailing slashes are stripped so we never generate /api//sessions.
 */
const rawBaseUrl = import.meta.env.VITE_API_URL || "/api";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach the Clerk session token when available (harmless in dev, and keeps
// auth working in production where third-party/cookie handling can be stricter).
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await window?.Clerk?.session?.getToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore - cookie-based auth still applies
  }
  return config;
});

export default axiosInstance;
