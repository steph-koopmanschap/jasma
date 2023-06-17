import { VideoInfo, VideoTitle } from "@/entities/video";
import VideoPlayer from "@/features/video-player";
import Hls from "hls.js";
import "./Stream.css";
import { useEffect, useRef } from "react";

export const StreamWidget = ({ stream_key }) => {
    const videoRef = useRef(null);
    const videoSrc = `http://localhost:8000/hls/${stream_key}.m3u8`;

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
        <div className="stream-widget-container">
            <div className="stream-video-container">
                <div className="stream-video-wrapper">
                    <VideoPlayer
                        forwardRef={videoRef}
                        // videoSrc={
                        //     "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
                        // }
                        videoSrc="https://assets.mixkit.co/videos/preview/mixkit-a-man-waving-a-rainbow-flag-1343-large.mp4"
                        isLive={true}
                    />
                </div>
                <div className="stream-video-info">
                    <VideoTitle title="Random Stream" />
                    <VideoInfo
                        views={20000}
                        likes={15000}
                    />
                </div>
            </div>
        </div>
    );
};
