const { Events } = require('discord.js');
const { createEmbedMessage } = require('../utils');
const ollamaService = require('../services/ollamaService');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.guild || message.author.bot) return;

        const promptMessage = message.content;

        if (!promptMessage) return;

        const fetchedMessages = await message.channel.messages.fetch({ limit: 11 });
        const messageHistory = Array.from(fetchedMessages.values());

        const lastMessage = messageHistory[1];

        if (lastMessage && lastMessage.author.id === message.author.id) return;

        let messages = createRoleMessages(messageHistory);
        messages = createSystemMessage(messages, 'You are a helpful AI Assistant');

        const response = await ollamaService.chat(messages);

        if (response) {
            await message.reply({ embeds: [createEmbedMessage(message.guild, response)] });
        } else {
            await message.reply({ embeds: [createEmbedMessage(message.guild, 'I\'m sorry, I couldn\'t generate a response')] });
        }
    },
};

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