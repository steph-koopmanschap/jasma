import { StreamInfo } from "@/entities/stream";
import { Follow, Report, Share } from "@/features/stream";
import Player from "@/features/video-player";
import { useMobileProvider } from "@/shared/model";
import ChatWidgets from "../chat";
import UserWidgets from "../user";
import "./Stream.css";

export const StreamWidget = ({ stream_key }) => {
    const { isMobile } = useMobileProvider();

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
                        // stream_src={`http://localhost:8000/hls/${stream_key}.m3u8`}
                        stream_src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
                        isPartitioned={false}
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
                    username="John Doe"
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
