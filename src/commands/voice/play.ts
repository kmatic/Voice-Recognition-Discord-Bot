import { Client, CommandInteraction, GuildMember } from "discord.js";
import playQueue from "../../utils/playQueue";
import { createQueueEmbed } from "../../utils/embeds";
import getYoutubeInfo from "../../utils/getYoutubeInfo";

export default {
    data: {
        name: "play",
        description: "Play/queue a song",
    },

    async execute(interaction: CommandInteraction, search: string) {
        const member = interaction.member as GuildMember;
        const client = interaction.client as Client;

        if (search === "") {
            return await interaction.channel!.send(`**Did not receive a song to search**`);
        }

        const song = await getYoutubeInfo(search);

        if (!song.url) {
            return await interaction.channel!.send("**Could not find the given video/song");
        }

        const queue = client.queueCollection.get(member.guild.id);

        if (!queue) {
            const queueInit = [song];
            client.queueCollection.set(member.guild.id, queueInit);
            interaction.channel!.send("**Audio player firing up...**");
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
