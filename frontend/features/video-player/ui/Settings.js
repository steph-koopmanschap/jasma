import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./VideoPlayer.css";
import { faChevronRight, faCog } from "@fortawesome/free-solid-svg-icons";

export const Settings = () => {
    return (
        <div className="settings-container">
            <button className="action-btn">
                <FontAwesomeIcon icon={faCog} />
            </button>
            <SettingsMenu />
        </div>
    );
};

function SettingsMenu() {
    <div className="settings-menu-container">
        <div className="settings-menu-header">
            <button>X Close</button>
        </div>
        <span className="settings-menu-separator"></span>
        <div className="settings-menu-body"></div>
    </div>;
}

function SettingsActions() {
    return (
        <div className="settings-actions-container">
            <SettingsButton
                title="Quality"
                currentChosen="Auto"
                icon={<FontAwesomeIcon icon={faChevronRight} />}
            />
            <SettingsButton
                title="Speed"
                currentChosen="Normal"
                icon={<FontAwesomeIcon icon={faChevronRight} />}
            />
        </div>
    );
}

function SettingsButton({ title, currentChosen = "", icon = undefined }) {
    return (
        <button className="settings-menu-button">
            {title}
            <div>
                {currentChosen ? <span>currentChosen</span> : null}
                {icon ? icon : null}
            </div>
        </button>
    );
}

function SpeedSettings({ onChoose, current }) {
    const options = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

    return (
        <div className="option-settings-container">
            {options.map((option) => (
                <RadioOption label={option === 1 ? `${option}x (Normal)` : `${option}x`} />
            ))}
        </div>
    );
}

function QualitySettings({ onChoose, current }) {
    const options = [1080, 720, 480, 360];

    return (
        <div className="option-settings-container">
            {options.map((option) => (
                <RadioOption label={`${option}p`} />
            ))}
        </div>
    );
}

function RadioOption({ label, onChoose, isChecked }) {
    return (
        <div className="option-container">
            <input
                type="radio"
                id={`id_${label}`}
                onChange={onChoose}
                checked={isChecked}
            />
            <label for={`id_${label}`}>{label}</label>
        </div>
    );
}
