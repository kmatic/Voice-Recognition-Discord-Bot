import { CommandInteraction, GuildMember } from "discord.js";
import {
    getVoiceConnection,
    createAudioPlayer,
    NoSubscriberBehavior,
    AudioPlayerStatus,
} from "@discordjs/voice";
import { YoutubeInfo } from "../types/YoutubeInfo";
import getNextResource from "./getNextResource";
import { createPlayEmbed } from "./embeds";

export default async function playQueue(
    interaction: CommandInteraction,
    member: GuildMember,
    queue: YoutubeInfo[]
) {
    const connection = getVoiceConnection(member.guild.id);
    const firstSong = queue[0];

    const audioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    connection!.subscribe(audioPlayer);
    const resource = await getNextResource(firstSong);
    audioPlayer.play(resource);

    audioPlayer.on("error", (error) => {
        console.error(error);
    });

    audioPlayer.on(AudioPlayerStatus.Idle, async () => {
        queue.shift();
        const nextSong = queue[0];

        if (!nextSong) {
            console.log("queue is empty");
            audioPlayer.stop();
            interaction.client.queueCollection.delete(member.guild.id);
            return;
        }

        const nextSongResource = await getNextResource(nextSong);
        audioPlayer.play(nextSongResource);

        const nextEmbed = createPlayEmbed(nextSong.info!, nextSong.url!, member.user.id);
        interaction.channel!.send({ embeds: [nextEmbed] });
    });

    const embed = createPlayEmbed(firstSong.info!, firstSong.url!, member.user.id);
    return await interaction.channel!.send({ embeds: [embed] });
}
