import { Client, CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import getNextResource from "../../utils/getNextResource";
import { createPlayEmbed } from "../../utils/embeds";

export default {
    data: new SlashCommandBuilder().setName("skip").setDescription("Skips a song"),

    async execute(interaction: CommandInteraction) {
        const client = interaction.client as Client;
        const member = interaction.member as GuildMember;
        const connection = getVoiceConnection(member.guild.id);

        if (!member.voice.channel) {
            return await interaction.reply("You must be in a channel to use this command");
        }

        if (!connection || connection.joinConfig.channelId !== member.voice.channelId) {
            return await interaction.reply("The Bot is not connected to this voice channel");
        }

        const state = connection.state as VoiceConnectionReadyState;

        if (!state.subscription) {
            return await interaction.reply("The bot is not currently playing anything");
        }

        const queue = client.queueCollection.get(member.guild.id);
        queue.shift();
        const nextSong = queue[0];

        if (!nextSong) {
            console.log("queue is empty");
            state.subscription.player.stop();
            interaction.client.queueCollection.delete(member.guild.id);
            return await interaction.reply(`**Song queue is now empty**`);
        }

        const nextSongResource = await getNextResource(nextSong);
        state.subscription.player.play(nextSongResource);

        const embed = createPlayEmbed(nextSong.info!, nextSong.url!, member.user.id);
        return await interaction.reply({ embeds: [embed] });
    },
};
