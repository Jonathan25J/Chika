const { Events } = require('discord.js');
const { createEmbedMessage } = require('../utils');
const ollamaService = require('../services/ollamaService');
require('dotenv').config();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.guild || message.author.bot) return;

        const promptMessage = message.content;

        if (!promptMessage) return;

        const fetchMessageAmount = Math.abs(parseInt(process.env.OLLAMA_MODEL_FETCH_MESSAGE_AMOUNT, 10)) || 10;
        const fetchedMessages = await message.channel.messages.fetch({ limit: fetchMessageAmount });
        const messageHistory = Array.from(fetchedMessages.values());

        const lastMessage = messageHistory[1];

        if (lastMessage && lastMessage.author.id === message.author.id) return;

        const response = await ollamaService.chat(messageHistory);

        if (response) {
            await message.reply({ embeds: [createEmbedMessage(message.guild, response)] });
        } else {
            await message.reply({ embeds: [createEmbedMessage(message.guild, 'I\'m sorry, I couldn\'t generate a response')] });
        }
    },
};