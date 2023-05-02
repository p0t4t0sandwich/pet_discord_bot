import { SlashCommandBuilder } from 'discord.js';


import { db } from "../lib/mongo.js"
import { dbHandler } from '../lib/dbHander.js';


const pet = process.env.PET_NAME;
const dbh = new dbHandler(db, pet);

export const command = {
	data: new SlashCommandBuilder()
		.setName('changealias')
		.setDescription('Changes the alias of an image.')
		.addStringOption(option =>
			option.setName('oldalias')
				.setDescription('the old alias of the image.'))
		.addStringOption(option =>
			option.setName('newalias')
				.setDescription('the new alias of the image.')),
	async execute(interaction) {
        try {
            await interaction.deferReply();

            const oldalias = interaction.options.getString('oldalias');
            const newalias = interaction.options.getString('newalias');

            const succcess = await dbh.changeAlias(oldalias, newalias);

            const embed = { color: 0x877f23, description: "" };

            if (succcess) {
                embed.description = `${oldalias} now has the alias of ${newalias}!`;
            } else {
                embed.description = `Failed to set alias for ${oldalias}!`;
            }

            await interaction.followUp({ embeds: [embed] });

        } catch (err) {
            console.log(err);
        }
    },
};