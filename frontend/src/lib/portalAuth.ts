const PORTAL_TOKEN_KEY = 'ohc_portal_token';

export const getPortalToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PORTAL_TOKEN_KEY);
};

export const setPortalToken = (token: string) => {
  localStorage.setItem(PORTAL_TOKEN_KEY, token);
};

export const removePortalToken = () => {
  localStorage.removeItem(PORTAL_TOKEN_KEY);
};
