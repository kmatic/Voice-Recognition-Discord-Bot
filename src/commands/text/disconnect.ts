import { SlashCommandBuilder, CommandInteraction, GuildMember, Client } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

export default {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnects from voice channel"),

    async execute(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;
        const client = interaction.client as Client;

        const connection = getVoiceConnection(member.guild.id);

        if (!connection) return await interaction.reply("Bot is not currently in a channel");

        connection.destroy(); // destroys voice connection
        client.queueCollection.delete(member.guild.id); // clears song queue for guildId

        return await interaction.reply(`Bot has disconnected from the channel`);
    },
};
