import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { supabase } from "../lib/db.js";

const pet = process.env.PET_NAME

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
			let { data: hash, error } = alias ?
				await supabase
					.from(pet)
					.select('md5')
					.eq("alias", alias)
					.limit(1)
					.single() :
				await supabase
					.from(`random_${pet}_image`)
					.select('md5')
					.limit(1)
					.single();
				if (error) {
					console.log(error);
					return
				}
			
			let { data: image, error2 } = await supabase
				.from(pet)
				.select('*')
				.eq("md5", hash.md5)
				.limit(1)
				.single();
			if (error2) {
				console.log(error2);
				return
			}

			const buffer = Buffer.from(image.image, "base64");

			const file = new AttachmentBuilder(buffer, { name: 'image.png' });
			const embed = {
				color: 0x877f23,
				image: {
					url: 'attachment://image.png',
				},
			};
			embed.description = image.alias != '' ? image.alias : hash.md5;

			await interaction.followUp({ embeds: [embed], files: [file] });
		} catch (err) {
			console.log(err);
		}
	},
};
