import { StreamKey } from "@/features/stream";
import "./StreamSettings.css";

export const StreamSettings = () => {
    const userID = "";

    return (
        <div className="stream-settings-widget">
            <h2>Stream Settings</h2>
            <div className="stream-settings-container">
                <StreamKey userID={userID} />
                <div className="separator"></div>
            </div>
        </div>
    );
};
