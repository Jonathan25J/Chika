const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));

class NetworkManager {
    constructor(host) {
        this.host = host;
    }

    async request(endpoint, method = 'GET', body = null, headers = {}) {
        const url = `${this.host}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : null
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            logger.error('Network request failed:', error);
            throw error;
        }
    }
}

module.exports = NetworkManager;