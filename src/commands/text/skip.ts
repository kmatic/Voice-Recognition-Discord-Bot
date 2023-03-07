import { Client, CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import getNextResource from "../../utils/getNextResource";
import { createPlayEmbed, createBasicEmbed } from "../../utils/embeds";

export default {
    data: new SlashCommandBuilder().setName("skip").setDescription("Skips a song"),

    async execute(interaction: CommandInteraction) {
        let embed;
        const client = interaction.client as Client;
        const member = interaction.member as GuildMember;
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

        const state = connection.state as VoiceConnectionReadyState;

        if (!state.subscription?.player.state.status) {
            embed = createBasicEmbed("**Bot is not currently playing anything!**");
            return await interaction.reply({ embeds: [embed] });
        }

        const queue = client.queueCollection.get(member.guild.id);

        if (!queue) {
            embed = createBasicEmbed(`**There are no songs to skip**`);
            return await interaction.reply({ embeds: [embed] });
        }

        queue.shift();
        const nextSong = queue[0];

        if (!nextSong) {
            console.log("queue is empty");
            state.subscription.player.stop();
            interaction.client.queueCollection.delete(member.guild.id);
            embed = createBasicEmbed("**Song queue is now empty**");
            return await interaction.reply({ embeds: [embed] });
        }

        const nextSongResource = await getNextResource(nextSong);
        state.subscription.player.play(nextSongResource);

        embed = createPlayEmbed(nextSong.info!, nextSong.url!, member.user.id);
        return await interaction.reply({ embeds: [embed] });
    },
};
