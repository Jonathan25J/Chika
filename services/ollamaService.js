const NetworkManager = require('./networkManager');
require('dotenv').config();

class OllamaService {
    constructor() {
        this.networkManager = new NetworkManager(`http://ollama:${process.env.OLLAMA_PORT}`);
    }

    async generateResponse(promptMessage) {
        const ollamaModel = process.env.OLLAMA_MODEL;

        try {
            const response = await this.networkManager.request('/api/generate', 'POST', {
                model: ollamaModel,
                prompt: promptMessage,
                stream: false
            });

            const rawMessage = response.response;
            const message = rawMessage.replace(/[`\s]*[\[\<]think[\>\]](.*?)[\[\<]\/think[\>\]][`\s]*|^[`\s]*([\[\<]thinking[\>\]][`\s]*.*)$/ims, '');

            return message;
        } catch (error) {
            return null
        }
    }
}

const ollamaService = new OllamaService();
module.exports = ollamaService;