import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),

    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply("Pong!");
        const message = await interaction.fetchReply();
        console.log(message);
    },
};
