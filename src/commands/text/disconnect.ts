import { SlashCommandBuilder, CommandInteraction, GuildMember, Client } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { NotUserChannel, NotBotChannel } from "../../utils/responses";

export default {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnects from voice channel"),

    async execute(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;
        const client = interaction.client as Client;

        const connection = getVoiceConnection(member.guild.id);

        if (!member.voice.channel) return await NotUserChannel(interaction);
        if (!connection || connection.joinConfig.channelId !== member.voice.channelId) {
            return await NotBotChannel(interaction);
        }

        connection.destroy(); // destroys voice connection
        client.queueCollection.delete(member.guild.id); // clears song queue for guildId

        return await interaction.reply(`Bot has disconnected from the channel`);
    },
};
