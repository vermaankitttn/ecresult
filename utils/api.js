export function buildApiUrl(path) {
  const configuredBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
  if (!configuredBaseUrl) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  const trimmedBase = configuredBaseUrl.replace(/\/+$/, '');
  const trimmedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';


