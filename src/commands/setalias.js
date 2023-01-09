import { SlashCommandBuilder } from 'discord.js';
import { supabase } from "../lib/db.js";

const pet = process.env.PET_NAME

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

			const { data, error } = await supabase
				.from(pet)
				.update({
					alias: alias
				})
				.eq("md5", hash);

			if (error) {
				console.log(error);
				return
			}
			
			const embed = {
				color: 0x877f23,
				description: `${hash} now has the alias of ${alias}!`
			};
			await interaction.followUp({ embeds: [embed] });
		} catch (err) {
			console.log(err);
		}
	},
};
