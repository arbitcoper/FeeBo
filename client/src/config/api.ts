const rawUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const API_BASE_URL = rawUrl.replace(/\/+$/, '');
export const API_URL = API_BASE_URL.endsWith('/api/feedback')
  ? API_BASE_URL
  : `${API_BASE_URL}/api/feedback`;

