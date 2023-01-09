import fs from 'node:fs';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';

const token = process.env.DISCORD_TOKEN // JSON.parse(await fs.promises.readFile('./config.json', 'UTF-8')).token;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commands
client.commands = new Collection();

import { command as main } from './commands/main.js';
client.commands.set(main.data.name, main);

import { command as setalias } from './commands/setalias.js';
client.commands.set(setalias.data.name, setalias);

import { command as upload } from './commands/upload.js';
client.commands.set(upload.data.name, upload);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);