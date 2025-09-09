// API service for connecting frontend with backend
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(username: string, password: string) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/api/auth/profile');
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  // Product Management
  async registerProduct(farmerDetails: any, productDetails: any) {
    return this.request('/api/products/register', {
      method: 'POST',
      body: JSON.stringify({ farmerDetails, productDetails }),
    });
  }

  async transferOwnership(productId: string, transferData: {
    newOwnerRole: string;
    newOwnerName: string;
    newOwnerLocation: string;
    handlingInfo?: string;
  }) {
    return this.request(`/api/products/${productId}/transfer`, {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
  }

  async getProductHistory(productId: string) {
    return this.request(`/api/products/${productId}/history`);
  }

  async getAllProducts() {
    return this.request('/api/products');
  }

  async completeProduct(productId: string, consumerInfo: string) {
    return this.request(`/api/products/${productId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ consumerInfo }),
    });
  }

  async finalizeProduct(productId: string, consumerInfo: string) {
    return this.request(`/api/products/${productId}/finalize`, {
      method: 'POST',
      body: JSON.stringify({ consumerInfo }),
    });
  }

  // QR Code Management
  async generateQRCode(productId: string) {
    return this.request(`/api/qr/data/${productId}`);
  }

  async saveQRCode(productId: string) {
    return this.request(`/api/qr/save/${productId}`, {
      method: 'POST',
    });
  }

  async generateBatchQRCodes(productIds: string[]) {
    return this.request('/api/qr/batch', {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    });
  }

  // QR Verification (Public)
  async verifyProduct(productId: string) {
    return this.request(`/api/qr-verify/${productId}`);
  }

  // Analytics
  async getAnalytics(period = 'week', productType?: string, region?: string) {
    const params = new URLSearchParams({ period });
    if (productType) params.append('productType', productType);
    if (region) params.append('region', region);
    
    return this.request(`/api/analytics/dashboard?${params}`);
  }

  // System Status
  async getSystemStatus() {
    return this.request('/api/status');
  }

  // Demo credentials
  async getDemoCredentials() {
    return this.request('/api/auth/demo-credentials');
  }
}

export const apiService = new ApiService();
export default apiService;
