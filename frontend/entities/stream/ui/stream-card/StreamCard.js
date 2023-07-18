import "./StreamCard.css";
import { formatLargeNumber } from "@/shared/utils";

export const StreamCard = ({ userPic, title, username, viewers, thumbnail, onClick }) => {
    return (
        <div
            className="stream-card-container"
            tabIndex={0}
            onClick={onClick}
        >
            <div className="stream-card-layout">
                <div className="stream-media-container">
                    <img
                        src={thumbnail}
                        width={300}
                        height={200}
                    />
                    <div className="stream-card-views-container">
                        <span>{formatLargeNumber(viewers)} watching</span>
                    </div>
                </div>
                <div className="stream-card-info-container">
                    <div className="user-pic-container">{userPic ? userPic : null}</div>
                    <div className="stream-info-body">
                        <h3>{title}</h3>
                        <h4>{username}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};
