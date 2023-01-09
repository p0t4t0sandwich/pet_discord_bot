import { SlashCommandBuilder } from 'discord.js';
import request from "request-promise-native";
import CryptoJS  from "crypto-js";
import { supabase } from "../lib/db.js";

const pet = process.env.PET_NAME

async function uploadToDB(url) {
	return new Promise(async (resolve) => {
		try {
			await request({
				url: url,
				method: 'GET',
				encoding: null
			}).then(async (result) => {
				const base64 = Buffer.from(result).toString('base64');
				const hash = CryptoJS.MD5(base64).toString();

				let { data: likeness, error } = await supabase
					.from(pet)
					.select('*')
					.eq("md5", hash)
					.limit(1)
					.single();

				if (likeness !== null) {
					console.log(`Image already exists in table ${pet}`)
					resolve(false);
				}

				const { data, error2 } = await supabase
					.from(pet)
					.upsert({ md5: hash });

				if (error2) {
					console.log(`Something went wrong with upsert-ing: ${hash}`);
					resolve(false);
				}

				const { data2, error3 } = await supabase
					.from(pet)
					.update({
						image: base64
					})
					.eq("md5", hash);

				if (error3) {
					console.log(`Something went wrong with uploading base64: ${hash}`);
					resolve(false);
				}

				resolve(true);
			});
		} catch (err) {
			console.log(err);
			resolve(false);
		}
	});
}

export const command = {
	data: new SlashCommandBuilder()
		.setName('upload')
		.setDescription('Upload an image to the Maisy database.')
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

			const user = interaction.user.tag
			const embed = { color: 0x877f23 };

			if (user === "ThePotatoKing#3452" || (user === "sydthekid08#0008" && pet=="maisy") || (user === "Le CentryxX#0714" && pet=="xena") || (user === "TeaRose#4112" && pet=="lucky") ) {
				let counter = 0;
				const image = interaction.options.getAttachment("image");
				if (image && (await uploadToDB(image.url))) counter += 1;
				const image2 = interaction.options.getAttachment("image2");
				if (image2 && (await uploadToDB(image2.url))) counter += 1;
				const image3 = interaction.options.getAttachment("image3");
				if (image3 && (await uploadToDB(image3.url))) counter += 1;
				const image4 = interaction.options.getAttachment("image4");
				if (image4 && (await uploadToDB(image4.url))) counter += 1;
				const image5 = interaction.options.getAttachment("image5");
				if (image5 && (await uploadToDB(image5.url))) counter += 1;

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
