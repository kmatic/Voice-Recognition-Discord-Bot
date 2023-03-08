import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { createBasicEmbed } from "../../utils/embeds";

export default {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pause bot audio"),

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

        if (state.subscription?.player.state.status !== "playing") {
            embed = createBasicEmbed("Bot is not currently playing anything!");
            return await interaction.reply({ embeds: [embed] });
        }

        state.subscription.player.pause();

        embed = createBasicEmbed("Audio has been paused");
        return await interaction.reply({ embeds: [embed] });
    },
};
