import { CommandInteraction, GuildMember } from "discord.js";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { NotBotPlaying } from "src/utils/responses";

export default {
    data: {
        name: "pause",
        description: "Pause bot audio",
    },

    async execute(interaction: CommandInteraction, search: string) {
        const member = interaction.member as GuildMember;
        const connection = getVoiceConnection(member.guild.id);

        const state = connection!.state as VoiceConnectionReadyState;

        if (state.subscription?.player.state.status !== "playing") {
            return await interaction.channel!.send(`**Bot is not currently playing anything!**`);
        }

        state.subscription.player.pause();

        return await interaction.channel!.send(`**Audio has been paused**`);
    },
};
