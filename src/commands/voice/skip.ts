import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { Client, CommandInteraction, GuildMember } from "discord.js";
import { createPlayEmbed, createBasicEmbed } from "../../utils/embeds";
import getNextResource from "../../utils/getNextResource";

export default {
    data: {
        name: "skip",
        description: "Pause bot audio",
    },

    async execute(interaction: CommandInteraction, search: string) {
        let embed;
        const member = interaction.member as GuildMember;
        const client = interaction.client as Client;
        const connection = getVoiceConnection(member.guild.id);
        const state = connection!.state as VoiceConnectionReadyState;

        if (!state.subscription?.player.state.status) {
            embed = createBasicEmbed("Bot is not currently playing anything!");
            return await interaction.channel!.send({ embeds: [embed] });
        }

        const queue = client.queueCollection.get(member.guild.id);

        if (!queue) {
            embed = createBasicEmbed(`There are no songs to skip`);
            return await interaction.channel!.send({ embeds: [embed] });
        }

        queue.shift();
        const nextSong = queue[0];

        if (!nextSong) {
            console.log("queue is empty");
            state.subscription.player.stop();
            interaction.client.queueCollection.delete(member.guild.id);
            embed = createBasicEmbed("Song queue is now empty");
            return await interaction.channel!.send({ embeds: [embed] });
        }

        const nextSongResource = await getNextResource(nextSong);
        state.subscription.player.play(nextSongResource);

        embed = createPlayEmbed(nextSong.info!, nextSong.url!, member.user.id);
        return await interaction.channel!.send({ embeds: [embed] });
    },
};
