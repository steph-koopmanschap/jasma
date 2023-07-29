import { StreamInfo } from "@/entities/stream";
import { Follow, Report, Share } from "@/features/stream";
import Player from "@/features/video-player";
import { useMobileProvider } from "@/shared/model";
import ChatWidgets from "../chat";
import UserWidgets from "../user";
import "./Stream.css";
import { useRouter } from "next/router";

export const StreamWidget = ({ stream_key }) => {
    const { isMobile } = useMobileProvider();
    const router = useRouter();

    const render = (...elements) => {
        if (isMobile) {
            return <MobileLayout video={elements.shift()}>{...elements}</MobileLayout>;
        } else {
            return (
                <LargeLayout
                    video={elements.shift()}
                    subVideoSection={elements.shift()}
                >
                    {...elements}
                </LargeLayout>
            );
        }
    };

    return (
        <>
            {render(
                <div className="stream-video-wrapper">
                    <Player
                        // stream_src={`http://localhost:5050/hls/${stream_key}.m3u8`}
                        /* Uncomment to check full video player */
                        stream_src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
                        // type="application/x-mpegURL"
                        isLive={true}
                    />
                </div>,
                <StreamInfo
                    userPicWidget={
                        <UserWidgets.ProfilePic
                            width={50}
                            height={50}
                        />
                    }
                    title="Random Stream"
                    username="username_24"
                    onUserClick={() => router.push(`/user/${"dummy_user"}`)}
                    followAction={<Follow />}
                    reportAction={<Report />}
                    shareAction={<Share />}
                />,
                <ChatWidgets.StreamChat />
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

function LargeLayout({ video, children, subVideoSection }) {
    return (
        <div className="stream-large-layout">
            <div className="stream-large-main">
                {video}
                {subVideoSection}
            </div>
            <div>{children}</div>
        </div>
    );
}
