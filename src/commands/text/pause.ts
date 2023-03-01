import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { NotUserChannel, NotBotChannel, NotBotPlaying } from "../../utils/responses";
import { createAudioPlayer, NoSubscriberBehavior } from "@discordjs/voice";

export default {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pause bot audio"),

    async execute(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;

        const connection = getVoiceConnection(member.guild.id);

        if (!member.voice.channel) return await NotUserChannel(interaction);
        if (!connection || connection.joinConfig.channelId !== member.voice.channelId) {
            return await NotBotChannel(interaction);
        }

        const state = connection.state as VoiceConnectionReadyState;

        if (state.subscription?.player.state.status !== "playing") {
            return await NotBotPlaying(interaction);
        }

        state.subscription.player.pause();

        return await interaction.reply("**Audio has been paused**");
    },
};
