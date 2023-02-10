export type YoutubeInfo = {
    url: string | null;
    info: Snippet | null;
};

export type Snippet = {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    liveBroadcastContent: string;
    thumbnails: {
        default: Thumbnail;
        medium: Thumbnail;
        high: Thumbnail;
    };
};

type Thumbnail = {
    url: string;
    width: number;
    height: number;
};
