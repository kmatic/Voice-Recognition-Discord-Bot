import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";

export default {
    data: new SlashCommandBuilder().setName("unpause").setDescription("Resumes bot audio"),

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

        state.subscription.player.unpause();
        return await interaction.reply("Audio has been resumed");
    },
};
