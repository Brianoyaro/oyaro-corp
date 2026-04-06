class Api {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    }

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json', //we should handle multipart/form-data for file uploads in the future
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}. Error stack: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }
    /*
    // Example API methods
    async login(credentials) {
        return this.request('/auth/login', 'POST', credentials);
    }*/
}

const api = new Api();
export default api;