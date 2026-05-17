const TOKEN_KEY = 'ohc_admin_token';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const BRANCH_KEY = 'ohc_branch_id';

export const getBranchId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(BRANCH_KEY);
};

export const setBranchId = (branchId: string | null) => {
  if (typeof window === 'undefined') return;
  if (branchId) localStorage.setItem(BRANCH_KEY, branchId);
  else localStorage.removeItem(BRANCH_KEY);
};
