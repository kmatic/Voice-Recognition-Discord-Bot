import { Client, CommandInteraction, GuildMember } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

export default {
    data: {
        name: "disconnect",
        description: "Leave the channel",
    },

    async execute(interaction: CommandInteraction, search: string) {
        const member = interaction.member as GuildMember;
        const connection = getVoiceConnection(member.guild.id);
        const client = interaction.client as Client;

        connection!.destroy();
        client.queueCollection.delete(member.guild.id);
        client.listenConnection.delete(member.guild.id);

        return await interaction.channel!.send(`**Bot has disconnected from the channel**`);
    },
};
