// Base API configuration and utilities

// Get API base path from environment variable
export const getApiBasePath = (): string => {
  return import.meta.env.VITE_API_BASE_PATH || "";
};

// Base API fetch wrapper with common error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const basePath = getApiBasePath();
  const url = `${basePath}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};
