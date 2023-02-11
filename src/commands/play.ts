import {
    SlashCommandBuilder,
    GuildMember,
    CommandInteraction,
    CommandInteractionOptionResolver,
    Client,
} from "discord.js";
import {
    createAudioPlayer,
    NoSubscriberBehavior,
    getVoiceConnection,
    AudioPlayerStatus,
} from "@discordjs/voice";
import getYoutubeInfo from "../utils/getYoutubeInfo";
import { YoutubeInfo } from "../types/YoutubeInfo";
import { createPlayEmbed, createQueueEmbed } from "../utils/embeds";
import getNextResource from "../utils/getNextResource";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play audio from a song/video")
        .addStringOption((option) =>
            option.setName("search").setDescription("what do you want to play?").setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const member = interaction.member as GuildMember;
        const client = interaction.client as Client;
        const connection = getVoiceConnection(member.guild.id);

        if (!connection) return await interaction.reply("Bot is not currently in a channel");

        const search = options.getString("search")!;
        const song = await getYoutubeInfo(search);

        if (!song.url) return await interaction.reply("Could not find the given video/song");

        const queue = client.queueCollection.get(member.guild.id);

        if (!queue) {
            const queueInit = [song];
            client.queueCollection.set(member.guild.id, queueInit);
            interaction.reply({ content: "Audio player firing up...", ephemeral: true });
            playQueue(interaction, member, queueInit);
        } else {
            queue.push(song);
            interaction.client.queueCollection.set(member.guild.id, queue);

            const position = queue.length - 1;
            const queueEmbed = createQueueEmbed(song.info!, song.url!, position);

            return await interaction.reply({ embeds: [queueEmbed] });
        }
    },
};

async function playQueue(
    interaction: CommandInteraction,
    member: GuildMember,
    queue: YoutubeInfo[]
) {
    const connection = getVoiceConnection(member.guild.id);
    const firstSong = queue[0];

    const audioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop,
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
