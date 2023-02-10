import axios from "axios";
import { YoutubeInfo, Snippet } from "src/types/YoutubeInfo";

// this util function hits the youtube data api to search for a youtube video matching the input given to the bot (works with direct urls as well)
export default async function getYoutubeInfo(search: string): Promise<YoutubeInfo> {
    const trimSearch = search.trim();
    const query = trimSearch.replace(/ /g, "%20");

    const endpoint = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&type=video&part=snippet&maxResults=1&q=${query}`;

    let url: string | null = null;
    let info: Snippet | null = null;

    try {
        const response = await axios.get(endpoint);
        const data = response.data.items[0];
        if (data) {
            info = data.snippet;
            url = `https://www.youtube.com/watch?v=${data.id.videoId}`;
        }
    } catch (error) {
        console.error(error);
    }

    return { url, info };
}
