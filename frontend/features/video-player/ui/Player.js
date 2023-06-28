import { VideoPlayer } from "@/entities/video";
import { memo } from "react";
import { useStreamLogic } from "../model/useStreamLogic";
import { useVideoPlayer } from "../model/useVideoPlayer";

export const Player = memo(({ stream_src, isLive = false, type }) => {
    // If source is not to the m3u8 hls playlist but to one file then we don't need to use additional hls logic

    const logic = !stream_src.match(/\.m3u8$/g) ? useVideoPlayer() : useStreamLogic(stream_src, isLive);

    return (
        <VideoPlayer
            {...logic}
            videoSrc={stream_src}
            type={type}
        />
    );
});
