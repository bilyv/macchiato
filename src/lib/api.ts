// Re-export from the new modular API structure
// This file is kept for backward compatibility

import { api, API_BASE_URL, apiRequest } from './api/index';

export { API_BASE_URL, apiRequest };
export { api };
export default api;
