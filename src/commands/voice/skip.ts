import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { Client, CommandInteraction, GuildMember } from "discord.js";
import { createPlayEmbed } from "../../utils/embeds";
import getNextResource from "../../utils/getNextResource";

export default {
    data: {
        name: "skip",
        description: "Pause bot audio",
    },

    async execute(interaction: CommandInteraction, search: string) {
        const member = interaction.member as GuildMember;
        const client = interaction.client as Client;
        const connection = getVoiceConnection(member.guild.id);
        const state = connection!.state as VoiceConnectionReadyState;

        if (!state.subscription?.player.state.status) {
            return await interaction.channel!.send(`**Bot is not currently playing anything!**`);
        }

        const queue = client.queueCollection.get(member.guild.id);

        if (!queue) return await interaction.channel!.send(`**There are no songs to skip**`);

        queue.shift();
        const nextSong = queue[0];

        if (!nextSong) {
            console.log("queue is empty");
            state.subscription.player.stop();
            interaction.client.queueCollection.delete(member.guild.id);
            return await interaction.channel!.send(`**Song queue is now empty**`);
        }

        const nextSongResource = await getNextResource(nextSong);
        state.subscription.player.play(nextSongResource);

        const embed = createPlayEmbed(nextSong.info!, nextSong.url!, member.user.id);
        return await interaction.channel!.send({ embeds: [embed] });
    },
};
