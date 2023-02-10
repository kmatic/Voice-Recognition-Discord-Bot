import {
    SlashCommandBuilder,
    GuildMember,
    CommandInteraction,
    CommandInteractionOptionResolver,
    EmbedBuilder,
} from "discord.js";
import {
    createAudioPlayer,
    NoSubscriberBehavior,
    getVoiceConnection,
    createAudioResource,
} from "@discordjs/voice";
import getYoutubeInfo from "../utils/getYoutubeInfo";
import play from "play-dl";

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
        const connection = getVoiceConnection(member.guild.id);

        if (!connection) return await interaction.reply("Bot is not currently in a channel");

        const search = options.getString("search")!;

        const { url, info } = await getYoutubeInfo(search);

        if (!url) return await interaction.reply("Could not find the given video/song");

        console.log(info);

        // create audio player
        const audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Stop,
            },
        });

        audioPlayer.on("error", (error) => {
            console.error(error);
        });

        const subscription = connection.subscribe(audioPlayer);
        const stream = await play.stream(url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        const embed = createEmbed(info, url);

        audioPlayer.play(resource);

        return await interaction.reply({ embeds: [embed] });
    },
};

function createEmbed(info: any, url: string) {
    const templatedEmbed = new EmbedBuilder()
        .setColor(0x2d66d7)
        .setTitle(info.title)
        .setURL(url)
        .setDescription(info.description)
        .setThumbnail(info.thumbnails.default.url)
        .setAuthor({ name: "Now Playing" })
        .setFooter({ text: "Requested by: " });

    return templatedEmbed;
}
