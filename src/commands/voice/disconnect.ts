import { Client, CommandInteraction, GuildMember } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { createBasicEmbed } from "../../utils/embeds";

export default {
    data: {
        name: "disconnect",
        description: "Leave the channel",
    },

    async execute(interaction: CommandInteraction, search: string) {
        const member = interaction.member as GuildMember;
        const connection = getVoiceConnection(member.guild.id);
        const client = interaction.client as Client;

        const porcupine = client.porcupineInstance.get(member.guild.id);
        const gcClient = client.gcSpeechInstance.get(member.guild.id);

        porcupine.release();
        gcClient.close();
        connection!.destroy();
        client.queueCollection.delete(member.guild.id); // clears song queue for guildId
        client.listenConnection.delete(member.guild.id); // clears any listening connections
        client.porcupineInstance.delete(member.guild.id); // clears porcupine instance after releasing resources
        client.gcSpeechInstance.delete(member.guild.id); // clears gcSpeech instance

        const embed = createBasicEmbed(`Bot has disconnected from the channel`);
        return await interaction.channel!.send({ embeds: [embed] });
    },
};
