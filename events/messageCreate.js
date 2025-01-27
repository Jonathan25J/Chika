const { Events} = require('discord.js');
const { createEmbedMessage } = require('../utils');
const ollamaService = require('../services/ollamaService');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.guild || message.author.bot) return;

        const promptMessage = message.content;

        if (!promptMessage) return;

        const response = await ollamaService.generateResponse(promptMessage)

        if (response) {
            await message.reply({ embeds: [createEmbedMessage(message.guild, response)] });
        } else {
            await message.reply({ embeds: [createEmbedMessage(message.guild, 'I\'m sorry, I couldn\'t generate a response')] });
        }
        
    },
};

