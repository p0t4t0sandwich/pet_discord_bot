import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';

const token = process.env.DISCORD_TOKEN
const clientId = process.env.BOT_CLIENT_ID

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commands
const commands = [];
client.commands = new Collection();

import { command as main } from './commands/main.js';
client.commands.set(main.data.name, main);
commands.push(main.data.toJSON());

import { command as setalias } from './commands/setalias.js';
client.commands.set(setalias.data.name, setalias);
commands.push(setalias.data.toJSON());

import { command as upload } from './commands/upload.js';
client.commands.set(upload.data.name, upload);
commands.push(upload.data.toJSON());

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

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

	// Updating Slash Commands
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
	
			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);
	
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
});

client.login(token);