import { Events, BaseInteraction } from "discord.js";

// executes command from client.commands array
export default {
    name: Events.InteractionCreate,

    async execute(interaction: BaseInteraction): Promise<void> {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.textCommands.get(interaction.commandName);

        if (!command) {
            console.error(`No commands match ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
