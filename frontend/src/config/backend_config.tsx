export interface BackendConfig {
  // Backend URL Configuration
  baseUrl: string;
  apiPrefix: string;
  
  // Environment Settings
  environment: 'development' | 'production' | 'staging';
  
  // Timeout Settings (in milliseconds)
  requestTimeout: number;
  
  // API Endpoints
  endpoints: {
    root: string;
    status: string;
    // Add more endpoints as needed
  };
  
  // Mobile App Settings (for Capacitor)
  mobile: {
    enablePrintAPI: boolean;
    offlineMode: boolean;
  };
}

// Backend Configuration
export const backendConfig: BackendConfig = {
  // 🔧 CHANGE THIS URL WHEN YOUR BACKEND IS DEPLOYED
  // For local development, use: 'http://localhost:8001'
  // For production, replace with your deployed URL: 'https://your-domain.com'
  baseUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001',
  
  apiPrefix: '/api',
  
  // Environment detection (auto-detects based on URL)
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  
  // Request timeout (30 seconds)
  requestTimeout: 30000,
  
  // API Endpoints - just add the path, baseUrl + apiPrefix will be added automatically
  endpoints: {
    root: '/',
    status: '/status',
    // Add more endpoints here as you build features
    // users: '/users',
    // auth: '/auth',
  },
  
  // Mobile-specific settings
  mobile: {
    enablePrintAPI: true,  // Enable Android print functionality
    offlineMode: false,    // Set to true if you want offline capabilities
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: keyof BackendConfig['endpoints']): string => {
  const { baseUrl, apiPrefix, endpoints } = backendConfig;
  return `${baseUrl}${apiPrefix}${endpoints[endpoint]}`;
};

// Helper function for making API calls
export const apiCall = async (
  endpoint: keyof BackendConfig['endpoints'],
  options: RequestInit = {}
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    signal: AbortSignal.timeout(backendConfig.requestTimeout),
  };
  
  return fetch(url, { ...defaultOptions, ...options });
};

// Example usage functions (you can use these in your components)
export const exampleApiCalls = {
  // Test backend connection
  testConnection: async () => {
    try {
      const response = await apiCall('root');
      return await response.json();
    } catch (error) {
      console.error('Backend connection failed:', error);
      throw error;
    }
  },
  
  // Create status check
  createStatus: async (clientName: string) => {
    try {
      const response = await apiCall('status', {
        method: 'POST',
        body: JSON.stringify({ client_name: clientName }),
      });
      return await response.json();
    } catch (error) {
      console.error('Status creation failed:', error);
      throw error;
    }
  },
  
  // Get status checks
  getStatuses: async () => {
    try {
      const response = await apiCall('status');
      return await response.json();
    } catch (error) {
      console.error('Status fetch failed:', error);
      throw error;
    }
  },
};