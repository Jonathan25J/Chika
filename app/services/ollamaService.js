const NetworkManager = require('./networkManager');
require('dotenv').config();

class OllamaService {
    constructor() {
        this.networkManager = new NetworkManager(`http://ollama:${process.env.OLLAMA_PORT}`);
        this.model = process.env.OLLAMA_MODEL;
        this.maxInputTokenLength = parseInt(process.env.OLLAMA_MODEL_MAX_INPUT_TOKEN_LENGTH, 10);
        this.maxOutputTokenLength = parseInt(process.env.OLLAMA_MODEL_MAX_OUTPUT_TOKEN_LENGTH, 10);
        this.defaultPrompt = process.env.OLLAMA_MODEL_DEFAULT_PROMPT;
        this.temperature = parseFloat(process.env.OLLAMA_MODEL_TEMPERATURE);
    }

    async prompt(prompt) {
        try {
            const response = await this.networkManager.request('/api/generate', 'POST', {
                model: this.model,
                prompt: prompt,
                stream: false,
                options: { "temperature": this.temperature, "top_p": 1.0, "num_ctx": this.maxInputTokenLength, "num_predict": this.maxOutputTokenLength, "stop": ["<think></think>"] }
            });

            const message = replaceThinkTags(response.response);

            return message;
        } catch (error) {
            return null
        }
    }

    async chat(messageHistory) {
        let messages = createRoleMessages(messageHistory);
        messages = createSystemMessage(messages, this.defaultPrompt);

        try {
            const response = await this.networkManager.request('/api/chat', 'POST', {
                model: this.model,
                messages: messages,
                stream: false,
                options: { "temperature": this.temperature, "top_p": 1.0, "num_ctx": this.maxInputTokenLength, "num_predict": this.maxOutputTokenLength, "stop": ["<think></think>"] }
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

function replaceThinkTags(message) {/<think.*?>.*?<\/think.*?>/gs
    return message.replace(/.*<\/(think|thinking)>/is, '');
}

function createRoleMessages(messages) {
    return messages.map(m => {
        if (m.author.bot) {
            return { 'role': 'assistant', 'content': `${m.embeds[0].description}` };
        } else {
            return { 'role': 'user', 'content': `${m.content}` };
        }

    }).reverse();
}

function createSystemMessage(messages, message) {
    messages.unshift({ 'role': 'system', 'content': message });
    return messages;
}