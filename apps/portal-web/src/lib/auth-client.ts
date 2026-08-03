let inMemoryAccessToken: string | null = null;

export interface AuthApiError extends Error {
  status?: number;
}

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => {
  return inMemoryAccessToken;
};

// Gateway-ээс шалгагдах токенийг урсгал хүсэлтэд автоматаар нэмэх axios эсвэл fetch helper
export const authFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Credentials: 'include' ашиглаж, Cookie дамжуулна
  const finalOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  return fetch(url, finalOptions);
};

export async function loginWithPassword(email: string, password: string) {
  return requestJson<{
    accessToken: string;
    user: {
      id: string;
      email: string;
      status: string;
      roles?: string[];
    };
  }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerAccount(email: string, password: string) {
  return requestJson<{
    id: string;
    email: string;
    status: string;
    emailVerificationRequired: boolean;
  }>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyEmailToken(token: string) {
  return requestJson<{ success: boolean }>("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function resendVerificationEmail(email: string) {
  return requestJson<{ success: boolean }>(
    "/api/v1/auth/resend-verification",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );
}

async function requestJson<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(payload.message || "Request failed") as AuthApiError;
    error.status = res.status;
    throw error;
  }

  return payload as T;
}
