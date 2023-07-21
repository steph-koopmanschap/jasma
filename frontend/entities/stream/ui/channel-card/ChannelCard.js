import { formatLargeNumber } from "@/shared/utils";
import "./ChannelCard.css";

export const ChannelCard = ({ userPic, title, followers, onClick }) => {
    return (
        <div
            className="channel-card-container"
            tabIndex={0}
            onClick={onClick}
            role="link"
            aria-label={`${title} profile page`}
        >
            <div className="pic-container">{userPic ? userPic : null}</div>
            <div className="info-container">
                <h3>{title}</h3>
                <span>{formatLargeNumber(followers)} following</span>
            </div>
        </div>
    );
};
