import { CommandInteraction } from "discord.js";

export default async function dispatchVoiceCommand(
    transcription: string,
    interaction: CommandInteraction
) {
    const transcriptionArray = transcription.split(" ");
    const transcriptionCommand = transcriptionArray.shift()?.toLowerCase();

    const command = interaction.client.voiceCommands.get(transcriptionCommand);

    if (!command) {
        console.error(`No commands matching ${transcriptionCommand} was found.`);
        return;
    }

    try {
        await command.execute(interaction, transcriptionArray.join(" "));
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
}
