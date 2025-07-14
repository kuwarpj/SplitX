import { HttpMethod } from "@/type";
import { storage } from "./storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchAPI<T = any>(
  endpoint: string,
  method: HttpMethod = "GET",
  body: Record<string, any> | null = null
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("This is centeral url", url);
  // Get the token from AsyncStorage
  const token = await storage.get("token");

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    if (response.status === 204) {
      return null as T;
    }

    const responseData = await response.json(); 

    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
