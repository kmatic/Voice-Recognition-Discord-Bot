import { CommandInteraction, GuildMember } from "discord.js";
import { getVoiceConnection, VoiceConnectionReadyState } from "@discordjs/voice";
import { NotBotPlaying } from "src/utils/responses";

export default {
    data: {
        name: "resume",
        description: "Resumes bot audio",
    },

    async execute(interaction: CommandInteraction, search: string) {
        const member = interaction.member as GuildMember;
        const connection = getVoiceConnection(member.guild.id);

        const state = connection!.state as VoiceConnectionReadyState;

        if (state.subscription?.player.state.status !== "paused") {
            return await interaction.channel!.send(`**Bot is not currently playing anything!**`);
        }

        state.subscription.player.unpause();

        return await interaction.channel!.send(`**Audio has been resumed**`);
    },
};
