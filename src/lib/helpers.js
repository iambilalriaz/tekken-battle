export const getAccessTokenFromHeaders = (req) => {
  const authHeader = req?.headers?.get('authorization') || '';
  const token = authHeader?.startsWith('Bearer ') ? authHeader?.slice(7) : null;
  return token;
};

export const saveAccessToken = (token) => {
  debugger;
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem('accessToken', btoa(token));
};
export const getAccessToken = () => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  const token = localStorage.getItem('accessToken');
  return token ? atob(token) : null;
};
export const deleteAccessToken = () => {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.removeItem('accessToken');
};
