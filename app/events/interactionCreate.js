const { Events, MessageFlags } = require('discord.js');
const path = require('node:path');
const logger = require(path.join(process.cwd(), 'logger'));
const { createEmbedMessage } = require('../utils.js')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			logger.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ embeds: [createEmbedMessage(interaction.guild, 'There was an error while executing this command!')], flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ embeds: [createEmbedMessage(interaction.guild, 'There was an error while executing this command!')], flags: MessageFlags.Ephemeral });
			}
		}
	},
};