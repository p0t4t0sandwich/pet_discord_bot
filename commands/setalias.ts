import { SlashCommandBuilder } from 'discord.js';


import { db } from "../lib/mongo.js"
import { dbHandler } from '../lib/dbHander.js';


const pet: string = process.env.PET_NAME;
const dbh = new dbHandler(db, pet);


export const command = {
	data: new SlashCommandBuilder()
		.setName('setalias')
		.setDescription('Sets the alias of an image.')
		.addStringOption(option =>
			option.setName('hash')
				.setDescription('the hash at the top of the image.'))
		.addStringOption(option =>
			option.setName('alias')
				.setDescription('image alias of choice.')),
	async execute(interaction) {
		try {
			await interaction.deferReply();

			const alias = interaction.options.getString('alias');
			const hash = interaction.options.getString('hash');

			const succcess = await dbh.setAlias(hash, alias);

			const embed = { color: 0x877f23, description: "" };

			if (succcess) {
				embed.description = `${hash} now has the alias of ${alias}!`;
			} else {
				embed.description = `Failed to set alias for ${hash}!`;
			}

			await interaction.followUp({ embeds: [embed] });

		} catch (err) {
			console.log(err);
		}
	},
};
