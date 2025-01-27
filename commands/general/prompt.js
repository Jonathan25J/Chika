const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const { createEmbedMessage, COLORS } = require('../../utils');
const ollamaService = require('../../services/ollamaService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Prompt the bot to say something.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('What do you want to ask?')
                .setRequired(true))
        .setContexts(InteractionContextType.Guild),

    async execute(interaction) {
        const promptMessage = interaction.options.getString('message');

        await interaction.deferReply();
        const response = await ollamaService.generateResponse(promptMessage)

        if (response) {
            await interaction.editReply({ embeds: [createEmbedMessage(interaction.guild, response)] });
        } else {
            await interaction.editReply({ embeds: [createEmbedMessage(interaction.guild, 'I\'m sorry, I couldn\'t generate a response')] });
        }

    },
};
