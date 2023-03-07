import { CommandInteraction, GuildMember } from "discord.js";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { createBasicEmbed } from "../../utils/embeds";

export default {
    data: {
        name: "pause",
        description: "Pause bot audio",
    },

    async execute(interaction: CommandInteraction, search: string) {
        let embed;
        const member = interaction.member as GuildMember;
        const connection = getVoiceConnection(member.guild.id);

        const state = connection!.state as VoiceConnectionReadyState;

        if (state.subscription?.player.state.status !== "playing") {
            embed = createBasicEmbed("**Bot is not currently playing anything!**");
            return await interaction.channel!.send({ embeds: [embed] });
        }

        state.subscription.player.pause();

        embed = embed = createBasicEmbed("*Audio has been paused**");
        return await interaction.channel!.send({ embeds: [embed] });
    },
};
