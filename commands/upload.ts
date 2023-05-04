import { SlashCommandBuilder } from 'discord.js';


import { db } from "../lib/mongo.js"
import { dbHandler } from '../lib/dbHander.js';


const pet: string = process.env.PET_NAME;
const uploadUsers: string[] = process.env.UPLOAD_USERS.split(",");
const dbh = new dbHandler(db, pet);


export const command = {
	data: new SlashCommandBuilder()
		.setName('upload')
		.setDescription(`Upload an image to the ${pet} database.`)
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('image to upload'))
		.addAttachmentOption(option =>
			option.setName('image2')
				.setDescription('image to upload'))
		.addAttachmentOption(option =>
			option.setName('image3')
				.setDescription('image to upload'))
		.addAttachmentOption(option =>
			option.setName('image4')
				.setDescription('image to upload'))
		.addAttachmentOption(option =>
			option.setName('image5')
				.setDescription('image to upload')),
	async execute(interaction) {
		try {
			await interaction.deferReply();

			const user = interaction.user.id
			const embed = { color: 0x877f23, description: "" };

			if (uploadUsers.includes(user)) {
				let counter = 0;
				const image = interaction.options.getAttachment("image");
				if (image && (await dbh.uploadToDB(image.url))) counter += 1;
				const image2 = interaction.options.getAttachment("image2");
				if (image2 && (await dbh.uploadToDB(image2.url))) counter += 1;
				const image3 = interaction.options.getAttachment("image3");
				if (image3 && (await dbh.uploadToDB(image3.url))) counter += 1;
				const image4 = interaction.options.getAttachment("image4");
				if (image4 && (await dbh.uploadToDB(image4.url))) counter += 1;
				const image5 = interaction.options.getAttachment("image5");
				if (image5 && (await dbh.uploadToDB(image5.url))) counter += 1;

				embed.description = `Uploaded ${counter} images!`;
			} else {
				embed.description = "No beans for you!";
			}
			await interaction.followUp({ embeds: [embed] });
		} catch (err) {
			console.log(err);
		}
	},
};
