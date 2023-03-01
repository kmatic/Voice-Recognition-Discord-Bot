import { CommandInteraction, userMention } from "discord.js";

export async function NotUserChannel(interaction: CommandInteraction) {
    const user = userMention(interaction.member!.user.id);

    return interaction.reply(
        `**${user} must be connected to a voice channel to use this command**`
    );
}

export async function NotBotChannel(interaction: CommandInteraction) {
    return interaction.reply(`**Bot is not currently connected to this voice channel**`);
}

export async function NotBotPlaying(interaction: CommandInteraction) {
    return interaction.reply(`**Bot is not currently playing anything!**`);
}
