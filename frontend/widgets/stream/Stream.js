import VideoPlayer from "@/features/video-player";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

export const StreamWidget = () => {
    const videoRef = useRef(null);
    // const videoSrc = "http://localhost:8000/hls/test.m3u8";

    // useEffect(() => {
    //     if (!videoRef.current) return;
    //     const video = videoRef.current;

    //     if (Hls.isSupported()) {
    //         let hls = new Hls();

    //         hls.loadSource(videoSrc);
    //         hls.attachMedia(video);
    //     } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    //         video.src = videoSrc;
    //     }
    // }, []);

    return (
        <div>
            <h2>Live Stream</h2>
            <VideoPlayer ref={videoRef} />
        </div>
    );
};
