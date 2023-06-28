import "./VideoInfo.css";

// Can be used for streams also

export const VideoInfo = ({ released = null, views = null, likes = null }) => {
    return (
        <div className="video-info-container">
            <div className="data-boxes-container">
                <div className="data-boxes">
                    <DataBox
                        title={"Views"}
                        value={views}
                        key={"views"}
                    />
                    <DataBox
                        title={"Likes"}
                        value={likes}
                        key={"likes"}
                    />
                    <DataBox
                        title={"Premiered"}
                        value={released}
                        key={"released"}
                    />
                </div>
                <div className="separator"></div>
            </div>
        </div>
    );
};

export const VideoTitle = ({ title = "" }) => {
    return (
        <div className="video-title-container">
            <h2>{title}</h2>
        </div>
    );
};

function DataBox({ title, value }) {
    if (!title || value === null) return null;

    return (
        <div className="data-box">
            <h3>{value}</h3>
            <h6>{title}</h6>
        </div>
    );
}
