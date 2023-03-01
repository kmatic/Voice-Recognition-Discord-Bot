import {
    SlashCommandBuilder,
    GuildMember,
    CommandInteraction,
    CommandInteractionOptionResolver,
    Client,
} from "discord.js";
import {
    getVoiceConnection,
    joinVoiceChannel,
    VoiceConnectionStatus,
    entersState,
} from "@discordjs/voice";
import getYoutubeInfo from "../../utils/getYoutubeInfo";
import { createQueueEmbed } from "../../utils/embeds";
import { NotUserChannel, NotBotChannel } from "../../utils/responses";
import playQueue from "../../utils/playQueue";

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

        if (!member.voice.channel) return await NotUserChannel(interaction);
        if (connection && connection.joinConfig.channelId !== member.voice.channelId) {
            return await NotBotChannel(interaction);
        }

        if (!connection) {
            try {
                // join voice channel user is in
                const connection = joinVoiceChannel({
                    channelId: member.voice.channel.id,
                    guildId: member.voice.channel.guild.id,
                    adapterCreator: member.voice.channel.guild.voiceAdapterCreator,
                });

                // register connection event listeners
                connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                    try {
                        await Promise.race([
                            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                        ]);
                        // Seems to be reconnecting to a new channel - ignore disconnect
                    } catch (error) {
                        // Seems to be a real disconnect which SHOULDN'T be recovered from
                        connection.destroy();
                    }
                });

                connection.on("stateChange", (oldState, newState) => {
                    console.log(
                        "join",
                        "Connection state change from",
                        oldState.status,
                        "to",
                        newState.status
                    );
                    if (
                        oldState.status === VoiceConnectionStatus.Ready &&
                        newState.status === VoiceConnectionStatus.Connecting
                    ) {
                        connection.configureNetworking();
                    }
                });
            } catch (error) {
                interaction.reply(`**There was an error connecting**`);
            }
        }

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
