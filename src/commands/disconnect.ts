import { SlashCommandBuilder, CommandInteraction, GuildMember } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

export default {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnects from voice channel"),

    async execute(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;

        const connection = getVoiceConnection(member.guild.id);

        if (!connection) return await interaction.reply("Bot is not currently in a channel");

        // destroys voice connection
        connection.destroy();

        return await interaction.reply(`Bot has disconnected from the channel`);
    },
};
