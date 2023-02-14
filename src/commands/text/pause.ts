import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pause bot audio"),

    async execute(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            return await interaction.reply("You must be in a channel to use this command");
        }

        const connection = getVoiceConnection(member.guild.id);

        if (!connection || connection.joinConfig.channelId !== member.voice.channelId) {
            return await interaction.reply("The Bot is not connected to this voice channel");
        }

        const state = connection.state as VoiceConnectionReadyState;

        if (!state.subscription) {
            return await interaction.reply("The bot is not currently playing anything");
        }

        state.subscription.player.pause();
        return await interaction.reply("Audio has been paused");
    },
};
