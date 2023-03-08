import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { createBasicEmbed } from "../../utils/embeds";

export default {
    data: new SlashCommandBuilder().setName("resume").setDescription("Resumes bot audio"),

    async execute(interaction: CommandInteraction) {
        let embed;
        const member = interaction.member as GuildMember;

        const connection = getVoiceConnection(member.guild.id);

        if (!member.voice.channel) {
            embed = createBasicEmbed(
                "You must be connected to a voice channel to use this command"
            );
            return await interaction.reply({ embeds: [embed] });
        }
        if (!connection || connection.joinConfig.channelId !== member.voice.channelId) {
            embed = createBasicEmbed("Bot is not currently connected to this voice channel");
            return await interaction.reply({ embeds: [embed] });
        }

        const state = connection.state as VoiceConnectionReadyState;

        if (state.subscription?.player.state.status !== "paused") {
            embed = createBasicEmbed("Bot is not currently playing anything!");
            return await interaction.reply({ embeds: [embed] });
        }

        state.subscription.player.unpause();

        embed = createBasicEmbed("Audio has been resumed");
        return await interaction.reply({ embeds: [embed] });
    },
};
