import axios from "axios";

// this util function hits the youtube data api to search for a youtube video matching the input given to the bot (works with direct urls as well)
export default async function getYoutubeInfo(search: string): Promise<string | null> {
    const trimSearch = search.trim();
    const query = trimSearch.replace(/ /g, "%20");

    const endpoint = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&type=video&part=snippet&maxResults=1&q=${query}`;

    let videoURL: string | null = null;

    try {
        const response = await axios.get(endpoint);
        const data = response.data.items[0];
        console.log(data);

        videoURL = `https://www.youtube.com/watch?v=${data.id.videoId}`;
    } catch (error) {
        console.error(error);
    }

    return videoURL;
}
