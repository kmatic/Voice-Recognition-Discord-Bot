import { Client, CommandInteraction, GuildMember } from "discord.js";
import playQueue from "../../utils/playQueue";
import { createQueueEmbed, createBasicEmbed } from "../../utils/embeds";
import getYoutubeInfo from "../../utils/getYoutubeInfo";

export default {
    data: {
        name: "play",
        description: "Play/queue a song",
    },

    async execute(interaction: CommandInteraction, search: string) {
        let embed;
        const member = interaction.member as GuildMember;
        const client = interaction.client as Client;

        if (search === "") {
            embed = createBasicEmbed(`Did not receive a song to search`);
            return await interaction.channel!.send({ embeds: [embed] });
        }

        const song = await getYoutubeInfo(search);

        if (!song.url) {
            embed = createBasicEmbed(`Did not receive a song to search`);
            return await interaction.channel!.send({ embeds: [embed] });
        }

        const queue = client.queueCollection.get(member.guild.id);

        if (!queue) {
            const queueInit = [song];
            client.queueCollection.set(member.guild.id, queueInit);
            interaction.channel!.send("Audio player firing up...");
            playQueue(interaction, member, queueInit);
        } else {
            queue.push(song);
            interaction.client.queueCollection.set(member.guild.id, queue);

            const position = queue.length - 1;
            const queueEmbed = createQueueEmbed(song.info!, song.url!, position);

            return await interaction.channel!.send({ embeds: [queueEmbed] });
        }
    },
};
