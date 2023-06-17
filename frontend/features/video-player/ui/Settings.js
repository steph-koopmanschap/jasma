import { useClickOutside } from "@/shared/model";
import { Portal } from "@/shared/ui";
import { faChevronLeft, faChevronRight, faClose, faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createElement, memo, useCallback, useState } from "react";
import "./VideoPlayer.css";

export const Settings = memo(({ onPlaybackChange, onQualityChange, isMobile, isLive, containerRef }) => {
    const { ref, isShow, setIsShow } = useClickOutside(false);

    return (
        <div
            className="settings-container"
            ref={ref}
        >
            <button
                onClick={() => setIsShow(!isShow)}
                onTouchStart={() => setIsShow(!isShow)}
                className="action-btn"
            >
                <FontAwesomeIcon icon={faCog} />
            </button>
            {isShow && !isMobile ? (
                <div className="desktop-settings-wrapper">
                    <SettingsMenu
                        isLive={isLive}
                        onClickOutside={() => setIsShow(false)}
                        onClose={() => setIsShow(false)}
                        onPlaybackChange={onPlaybackChange}
                        onQualityChange={onQualityChange}
                    />
                </div>
            ) : null}
            {isShow && isMobile ? (
                <MobileSettingsMenu
                    containerRef={containerRef}
                    isLive={isLive}
                    onClickOutside={() => setIsShow(false)}
                    onClose={() => setIsShow(false)}
                    onPlaybackChange={onPlaybackChange}
                    onQualityChange={onQualityChange}
                />
            ) : null}
        </div>
    );
});

const SETTINGS_PAGES = {
    ACTIONS: "actions", // main
    SPEED: "speed", // playback rate options
    QUALITY: "quality" // quality options
};

function SettingsMenu({ onClose, onPlaybackChange, onQualityChange, isLive }) {
    const [currentPage, setCurrentPage] = useState(SETTINGS_PAGES.ACTIONS);
    const [currentSpeed, setCurrentSpeed] = useState(+window.sessionStorage.getItem("user_playback_rate") || 1);
    const [currentQuality, setCurrentQuality] = useState(+window.sessionStorage.getItem("user_video_quality") || 480);

    const handleSpeedChange = useCallback((value) => {
        setCurrentSpeed(value);
        onPlaybackChange(value);
    }, []);

    const handleQualityChange = useCallback((value) => {
        setCurrentQuality(value);
        onQualityChange(value);
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case SETTINGS_PAGES.ACTIONS:
                return (
                    <SettingsActions
                        onQualityClick={() => setCurrentPage(SETTINGS_PAGES.QUALITY)}
                        onSpeedClick={() => setCurrentPage(SETTINGS_PAGES.SPEED)}
                        isLive={isLive}
                        currentQuality={currentQuality}
                        currentSpeed={currentSpeed}
                    />
                );
            case SETTINGS_PAGES.SPEED:
                return (
                    <SpeedSettings
                        current={currentSpeed}
                        onChoose={handleSpeedChange}
                    />
                );
            case SETTINGS_PAGES.QUALITY:
                return (
                    <QualitySettings
                        current={currentQuality}
                        onChoose={handleQualityChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div
            className="settings-menu-container"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="settings-menu-header">
                {currentPage === SETTINGS_PAGES.ACTIONS ? (
                    <button
                        onClick={onClose}
                        onTouchStart={onClose}
                    >
                        <FontAwesomeIcon icon={faClose} />
                        <span>Close</span>
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentPage(SETTINGS_PAGES.ACTIONS)}
                        onTouchStart={() => setCurrentPage(SETTINGS_PAGES.ACTIONS)}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span>Back</span>
                    </button>
                )}
            </div>
            <div className="settings-menu-separator"></div>
            <div className="settings-menu-body">{renderPage()}</div>
        </div>
    );
}

function SettingsActions({ currentQuality, currentSpeed, onQualityClick, onSpeedClick, isLive }) {
    return (
        <div className="settings-actions-container">
            <SettingsButton
                title="Quality"
                onChoose={onQualityClick}
                currentChosen={currentQuality ? `${currentQuality}p` : null}
                icon={<FontAwesomeIcon icon={faChevronRight} />}
            />
            {!isLive ? (
                <SettingsButton
                    title="Speed"
                    onChoose={onSpeedClick}
                    currentChosen={currentSpeed ? `${currentSpeed}x` : null}
                    icon={<FontAwesomeIcon icon={faChevronRight} />}
                />
            ) : null}
        </div>
    );
}

function SettingsButton({ title, currentChosen = "", icon = undefined, onChoose }) {
    return (
        <button
            className="settings-menu-button"
            onClick={onChoose}
            onTouchStart={onChoose}
        >
            {title}
            <div>
                {currentChosen ? <span>{currentChosen}</span> : null}
                {icon ? icon : null}
            </div>
        </button>
    );
}

function SpeedSettings({ onChoose, current }) {
    const options = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

    return (
        <fieldset className="option-settings-container">
            {options.map((option) => (
                <RadioOption
                    key={option}
                    onChoose={onChoose}
                    isChecked={option === current}
                    label={option === 1 ? `${option}x (Normal)` : `${option}x`}
                    value={option}
                />
            ))}
        </fieldset>
    );
}

function QualitySettings({ onChoose, current }) {
    const options = [1080, 720, 480, 360];

    return (
        <div className="option-settings-container">
            {options.map((option) => (
                <RadioOption
                    key={option}
                    onChoose={onChoose}
                    isChecked={option === current}
                    label={`${option}p`}
                    value={option}
                />
            ))}
        </div>
    );
}

function RadioOption({ label, onChoose, isChecked, value }) {
    const handleChange = useCallback(() => {
        onChoose(value);
    }, []);

    return (
        <div
            className="option-container"
            onClick={handleChange}
            onTouchStart={handleChange}
        >
            <input
                type="radio"
                id={`id_${label}`}
                name={`id_${label}`}
                checked={isChecked}
            />
            <label htmlFor={`id_${label}`}>{label}</label>
        </div>
    );
}

function MobileSettingsMenu({ containerRef, ...rest }) {
    return (
        <Portal parent={containerRef.current}>
            <div className="mobile-settings-wrapper">
                <SettingsMenu {...rest} />
            </div>
        </Portal>
    );
}