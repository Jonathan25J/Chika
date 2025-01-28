const { SlashCommandBuilder } = require('discord.js');
const { createEmbedMessage } = require('../../utils');
const ollamaService = require('../../services/ollamaService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Prompt the bot to say something.')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('What do you want to ask?')
                .setRequired(true)),

    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');

        await interaction.deferReply();

        const response = await ollamaService.prompt(prompt)

        if (response) {
            await interaction.editReply({ embeds: [createEmbedMessage(interaction.guild, response)] });
        } else {
            await interaction.editReply({ embeds: [createEmbedMessage(interaction.guild, 'I\'m sorry, I couldn\'t generate a response')] });
        }

    },
};
