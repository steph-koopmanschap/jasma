import { VideoInfo, VideoTitle } from "@/entities/video";
import VideoPlayer from "@/features/video-player";
import Hls from "hls.js";
import "./Stream.css";
import { useEffect, useRef } from "react";
import { StreamInfo } from "@/entities/stream";
import { Follow, Report, Share } from "@/features/stream";
import UserWidgets from "../user";
import ChatWidgets from "../chat";
import { useMobileProvider } from "@/shared/model";

export const StreamWidget = ({ stream_key }) => {
    const videoRef = useRef(null);
    const videoSrc = `http://localhost:8000/hls/${stream_key}.m3u8`;

    const { isMobile } = useMobileProvider();
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

    const render = (...elements) => {
        if (isMobile) {
            return <MobileLayout video={elements.shift()}>{...elements}</MobileLayout>;
        } else {
            return <LargeLayout video={elements.shift()}>{...elements}</LargeLayout>;
        }
    };

    return (
        <>
            {render(
                <div className="stream-video-wrapper">
                    <VideoPlayer
                        forwardRef={videoRef}
                        // videoSrc={
                        //     "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
                        // }
                        videoSrc="https://assets.mixkit.co/videos/preview/mixkit-a-man-waving-a-rainbow-flag-1343-large.mp4"
                        isLive={true}
                    />
                </div>,
                <>
                    <StreamInfo
                        userPicWidget={
                            <UserWidgets.ProfilePic
                                width={50}
                                height={50}
                            />
                        }
                        title="Random Stream"
                        username="John Doe"
                        followAction={<Follow />}
                        reportAction={<Report />}
                        shareAction={<Share />}
                    />
                    <ChatWidgets.StreamChat />
                </>
            )}
        </>
    );
};

function MobileLayout({ video, children }) {
    return (
        <div className="stream-mobile-layout">
            {video}
            <div>{children}</div>
        </div>
    );
}

function LargeLayout({ video, children }) {
    return (
        <div className="stream-large-layout">
            {video}
            <div>{children}</div>
        </div>
    );
}
