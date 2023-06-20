import { VideoPlayer } from "@/entities/video";
import { memo } from "react";
import { useStreamLogic } from "../model/useStreamLogic";
import { useVideoPlayer } from "../model/useVideoPlayer";

/* Use isPartitioned true if src link is to one video file. If you want a stream buffer leave this as false. Mostly used for testing, mostlikely it will be deprecated */

export const Player = memo(({ stream_src, isLive = false, isPartitioned = true }) => {
    const logic = !isPartitioned ? useVideoPlayer() : useStreamLogic(stream_src, isLive);

    return (
        <VideoPlayer
            {...logic}
            videoSrc={!isPartitioned ? stream_src : null}
        />
    );
});
