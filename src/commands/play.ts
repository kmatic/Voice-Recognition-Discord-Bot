import { SlashCommandBuilder, GuildMember } from "discord.js";
import {
    createAudioPlayer,
    NoSubscriberBehavior,
    getVoiceConnection,
    createAudioResource,
} from "@discordjs/voice";
import { join } from "path";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play audio from a song/video")
        .addStringOption((option) =>
            option.setName("source").setDescription("source to play from").setRequired(true)
        ),

    async execute(interaction: any) {
        // return await interaction.reply("now playing");
        const member = interaction.member as GuildMember;

        const connection = getVoiceConnection(member.guild.id);

        if (!connection) return await interaction.reply("Bot is not currently in a channel");

        // create audio player
        const audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        audioPlayer.on("error", (error) => {
            console.error(error);
        });

        const resource = createAudioResource(join(__dirname, "example.mp3"));

        const subscription = connection.subscribe(audioPlayer);

        audioPlayer.play(resource);

        // if (subscription) {
        //     // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
        //     setTimeout(() => subscription.unsubscribe(), 5_000);
        // }

        await interaction.reply("now playing");
    },
};
