import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { NotUserChannel, NotBotChannel, NotBotPlaying } from "../../utils/responses";

export default {
    data: new SlashCommandBuilder().setName("unpause").setDescription("Resumes bot audio"),

    async execute(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;

        const connection = getVoiceConnection(member.guild.id);

        if (!member.voice.channel) return await NotUserChannel(interaction);
        if (!connection || connection.joinConfig.channelId !== member.voice.channelId) {
            return await NotBotChannel(interaction);
        }

        const state = connection.state as VoiceConnectionReadyState;

        if (!state.subscription) return await NotBotPlaying(interaction);

        state.subscription.player.unpause();
        return await interaction.reply("Audio has been resumed");
    },
};
