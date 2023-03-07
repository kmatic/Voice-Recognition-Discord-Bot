import { SlashCommandBuilder, CommandInteraction, GuildMember, Client } from "discord.js";
import { joinVoiceChannel, VoiceConnectionStatus, entersState } from "@discordjs/voice";
import { NotUserChannel } from "../../utils/responses";
import createListeningStream from "../../utils/createListeningStream";
import transcribeAudio from "../../utils/transcribeAudio";
import dispatchVoiceCommand from "../voice/dispatchVoiceCommand";
import { Porcupine, BuiltinKeyword } from "@picovoice/porcupine-node";

export default {
    data: new SlashCommandBuilder()
        .setName("listen")
        .setDescription("Connects and listen to audio in voice channel"),

    async execute(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;
        const client = interaction.client as Client;
        const existingListen = client.listenConnection.get(member.guild.id);

        if (!member.voice.channel) return await NotUserChannel(interaction);
        // check if bot is already listening to a user
        if (existingListen) return await interaction.reply(`**Already listening to a user**`);

        // join voice channel user is in
        const connection = joinVoiceChannel({
            channelId: member.voice.channel.id,
            guildId: member.voice.channel.guild.id,
            adapterCreator: member.voice.channel.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 5e3);
        } catch (error) {
            console.warn(error);
            return await interaction.reply(
                "Failed to join voice channel within 5 seconds, please try again later!"
            );
        }

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

        const porcupine = initPorcupine();
        const receiver = connection.receiver;

        client.listenConnection.set(member.guild.id, member.user.id);
        client.porcupineInstance.set(member.guild.id, porcupine);

        receiver.speaking.on("start", async (userId) => {
            console.log(`User ${userId} started speaking`);
            if (userId === client.listenConnection.get(member.guild.id)) {
                let transcription = "";

                const inputAudio = (await createListeningStream(
                    receiver,
                    userId,
                    porcupine
                )) as Buffer;

                if (inputAudio.length > 0) {
                    transcription = await transcribeAudio(inputAudio);
                }

                if (transcription) dispatchVoiceCommand(transcription, interaction);
            }
        });

        return await interaction.reply(
            `**Bot has joined the channel ${member.voice.channel.name} and is now listening to ${member.user.tag} for commands**`
        );
    },
};

function initPorcupine() {
    // instantiate porcupine (hotword detection)
    const accessKey = process.env.PICOVOICE_ACCESS_KEY as string;
    const porcupine = new Porcupine(accessKey, [BuiltinKeyword.BUMBLEBEE], [0.65]);

    return porcupine;
}
