import { EmbedBuilder, userMention } from "@discordjs/builders";
import { Snippet } from "../types/YoutubeInfo";

export function createPlayEmbed(info: Snippet, url: string, userId: string) {
    const user = userMention(userId);
    const playEmbed = new EmbedBuilder()
        .setColor(0x2d66d7)
        .setTitle(info.title)
        .setURL(url)
        .setDescription(info.description)
        .addFields({ name: "\u200b", value: `Requested by: ${user} ` })
        .setThumbnail(info.thumbnails.default.url)
        .setAuthor({ name: "Now Playing" });

    return playEmbed;
}

export function createQueueEmbed(info: Snippet, url: string, position: number) {
    const queueEmbed = new EmbedBuilder()
        .setColor(0x492dd7)
        .setTitle(info.title)
        .setURL(url)
        .setAuthor({ name: "Queued" })
        .setFooter({ text: `In position #${position}` });

    return queueEmbed;
}
