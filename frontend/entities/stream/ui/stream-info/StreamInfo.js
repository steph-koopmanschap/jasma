import { useMobileProvider } from "@/shared/model";
import "./StreamInfo.css";

export const StreamInfo = ({
    userPicWidget,
    onUserClick,
    username = "",
    title = "",
    viewers = 0,
    followAction,
    subAction,
    reportAction,
    shareAction
}) => {
    const { isMobile } = useMobileProvider();

    return (
        <div className="stream-info-container">
            <div
                className="pic-container"
                tabIndex={0}
                role="link"
                aria-label={`${username} profile`}
                onClick={onUserClick}
            >
                {userPicWidget ? userPicWidget : null}
            </div>
            <div className="stream-info-data">
                <div>
                    <h4 className="username">{username}</h4>
                    <div className="stream-actions">
                        {followAction ? followAction : null}
                        {!isMobile ? (
                            <>
                                {shareAction ? shareAction : null}
                                {reportAction ? reportAction : null}
                                {subAction ? subAction : null}
                            </>
                        ) : null}
                    </div>
                </div>
                <div>
                    {!isMobile ? <h2 className="title">{title}</h2> : null}

                    <div className="stats-container">{!isMobile ? <span>Watching: {viewers}</span> : null}</div>
                </div>
            </div>
        </div>
    );
};
