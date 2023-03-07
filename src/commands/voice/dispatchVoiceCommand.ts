import { CommandInteraction } from "discord.js";
import { createBasicEmbed } from "../../utils/embeds";

export default async function dispatchVoiceCommand(
    transcription: string,
    interaction: CommandInteraction
) {
    const transcriptionArray = transcription.split(" ");
    const transcriptionCommand = transcriptionArray.shift()?.toLowerCase();

    const command = interaction.client.voiceCommands.get(transcriptionCommand);

    if (!command) {
        const embed = createBasicEmbed(
            `**No commands matching ${transcriptionCommand} was found**`
        );
        console.error(`No commands matching ${transcriptionCommand} was found.`);
        return await interaction.channel!.send({ embeds: [embed] });
    }

    try {
        await command.execute(interaction, transcriptionArray.join(" "));
    } catch (error) {
        console.error(error);
        await interaction.channel!.send("There was an error while executing this command!");
    }
}
