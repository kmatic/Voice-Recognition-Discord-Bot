import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Provides information about the user."),
    async execute(interaction: CommandInteraction): Promise<void> {
        // interaction.user is the object representing the User who ran the command
        await interaction.reply(`This command was run by ${interaction.user.username}`);
    },
};
