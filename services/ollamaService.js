const NetworkManager = require('./networkManager');
require('dotenv').config();

class OllamaService {
    constructor() {
        this.networkManager = new NetworkManager(`http://ollama:${process.env.OLLAMA_PORT}`);
        this.model = process.env.OLLAMA_MODEL;
    }

    async prompt(prompt) {
        try {
            const response = await this.networkManager.request('/api/generate', 'POST', {
                model: this.model,
                prompt: prompt,
                stream: false,
                options: { "temperature": 0.0, "top_p": 1.0, "num_ctx": 50, "stop": ["<think></think>"] }
            });

            const message = replaceThinkTags(response.response);

            return message;
        } catch (error) {
            return null
        }
    }

    async chat(messages) {
        try {
            const response = await this.networkManager.request('/api/chat', 'POST', {
                model: this.model,
                messages: messages,
                stream: false,
                options: { "temperature": 0.0, "top_p": 1.0, "num_ctx": 50, "stop": ["<think></think>"] }
            });

            const message = replaceThinkTags(response.message.content);

            return message;
        } catch (error) {
            return null
        }
    }
}

const ollamaService = new OllamaService();
module.exports = ollamaService;

function replaceThinkTags(message) {
    return message.replace(/[`\s]*[\[\<]think[\>\]](.*?)[\[\<]\/think[\>\]][`\s]*|^[`\s]*([\[\<]thinking[\>\]][`\s]*.*)$/ims, '');
}