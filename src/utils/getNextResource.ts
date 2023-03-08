import { YoutubeInfo } from "../types/YoutubeInfo";
import play from "play-dl";
import { createAudioResource } from "@discordjs/voice";

// gets next audio resource of the passed in YoutubeInfo parameter
export default async function getNextResource(nextSong: YoutubeInfo) {
    const stream = await play.stream(nextSong.url!);
    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    return resource;
}
