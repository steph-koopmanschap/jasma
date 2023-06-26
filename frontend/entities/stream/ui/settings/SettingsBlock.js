import "./Settings.css";

export const SettingsBlock = ({ title = "", action = null, description = null }) => {
    return (
        <div className="setting-block-container">
            <div className="title-wrapper">
                <h2>{title}</h2>
            </div>
            <div className="main-wrapper">
                <div className="action-block">{action ? action : null}</div>
                <div className="description-block">{description ? description : null}</div>
            </div>
        </div>
    );
};
