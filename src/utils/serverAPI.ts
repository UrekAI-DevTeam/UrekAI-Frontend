const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

interface ServerApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<string, any>;
  headers?: Record<string, string>;
  cookies?: string; 
  credentials?: RequestCredentials; 
}

export async function serverApiRequest<T = any>(
  path: string,
  options: ServerApiOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    cookies,
    credentials = "include",
  } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  if (cookies) {
    finalHeaders["Cookie"] = cookies;
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: finalHeaders,
    credentials,
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text;
    try {
      const errorJson = JSON.parse(text);
      message = errorJson.detail || errorJson.message || text;
    } catch {
      // not JSON, ignore
    }
    throw new Error(`Request failed (${response.status}): ${message}`);
  }
  
  return response;
}
