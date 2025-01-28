const { REST, Routes, SlashCommandSubcommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const logger = require('./logger');
require('dotenv').config();

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		// Skip subcommands
		if (command.data instanceof SlashCommandSubcommandBuilder) continue;

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			logger.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(process.env.APP_TOKEN);

(async () => {
	try {
		logger.info(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.APP_CLIENT_ID),
			{ body: commands },
		);

		logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		logger.error(error);
	}
})();