import { SlashCommandBuilder, CommandInteraction, GuildMember, Client } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { createBasicEmbed } from "../../utils/embeds";

export default {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnects from voice channel"),

    async execute(interaction: CommandInteraction) {
        let embed;
        const member = interaction.member as GuildMember;
        const client = interaction.client as Client;

        const connection = getVoiceConnection(member.guild.id);

        if (!member.voice.channel) {
            embed = createBasicEmbed(
                "**You must be connected to a voice channel to use this command**"
            );
            return await interaction.reply({ embeds: [embed] });
        }
        if (!connection || connection.joinConfig.channelId !== member.voice.channelId) {
            embed = createBasicEmbed("**Bot is not currently connected to this voice channel**");
            return await interaction.reply({ embeds: [embed] });
        }

        const porcupine = client.porcupineInstance.get(member.guild.id);
        const gcClient = client.gcSpeechInstance.get(member.guild.id);

        if (porcupine) porcupine.release();
        if (gcClient) gcClient.close();
        connection.destroy(); // destroys voice connection
        client.queueCollection.delete(member.guild.id); // clears song queue for guildId
        client.listenConnection.delete(member.guild.id); // clears any listening connections
        client.porcupineInstance.delete(member.guild.id); // clears porcupine instance after releasing resources
        client.gcSpeechInstance.delete(member.guild.id); // clears gcSpeech instance

        embed = createBasicEmbed(`**Bot has disconnected from the channel**`);
        return await interaction.reply({ embeds: [embed] });
    },
};
