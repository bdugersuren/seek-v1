let inMemoryAccessToken: string | null = null;

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
