export const storeTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const clearTokens = (): void => {
  localStorage.removeItem("accessToken");
};
