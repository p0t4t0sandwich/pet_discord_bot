import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';


import { db } from "../lib/mongo.js"
import { Image, dbHandler } from '../lib/dbHander.js';


const pet = process.env.PET_NAME;
const dbh = new dbHandler(db, pet);


export const command = {
	data: new SlashCommandBuilder()
		.setName(pet)
		.setDescription('Presents you with a picture of her majesty.')
		.addStringOption(option =>
			option.setName('alias')
				.setDescription('image alias of choice.')),
	async execute(interaction) {
		try {
			await interaction.deferReply();

			const alias = interaction.options.getString('alias');

			const image: Image = alias ?
				await dbh.downloadFromDB(alias) :
				await dbh.downloadRandomFromDB();

			const file = new AttachmentBuilder(image.file, { name: 'image.png' });
			const embed = {
				color: 0x877f23,
				description: "",
				image: {
					url: 'attachment://image.png',
				},
			};
			embed.description = image.alias != '' ? image.alias : image.md5;

			await interaction.followUp({ embeds: [embed], files: [file] });
		} catch (err) {
			console.log(err);
		}
	},
};
