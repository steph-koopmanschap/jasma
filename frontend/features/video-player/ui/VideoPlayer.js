import {
    faCircle,
    faPause,
    faPlay,
    faRectangleXmark,
    faVolumeHigh,
    faVolumeLow,
    faVolumeMute
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useCallback } from "react";
import { useVideoPlayer } from "../model/useVideoPlayer";
import { Settings } from "./Settings";
import "./VideoPlayer.css";
import { formatTime } from "../utils/formatTime";

export const VideoPlayer = forwardRef((props, forwardedRef) => {
    const { refs, functions, status } = useVideoPlayer();

    return (
        <div className="player-container">
            <video
                id="video"
                ref={(el) => {
                    refs.videoRef.current = el;
                    forwardedRef.current = el;
                }}
                src="https://www.w3schools.com/tags/mov_bbb.mp4"
                onTimeUpdate={functions.updateProgress}
                onCanPlay={(e) => {
                    functions.setVideoTime(e.target.duration);
                    functions.changeVolume({ target: { value: Number(window.localStorage.userVideoVolume || 0.5) } });
                }}
                onEnded={functions.reset}
            >
                Your browser does not support HTML5 video.
            </video>
            <div className="top-curtain"></div>
            <OnAirSign />
            <div className="control-panel-container">
                <ProgressContainer
                    elapsed={status.currentTime}
                    totalTime={status.videoTime}
                    progress={status.progress}
                />
                <Controls
                    onChangeVolume={functions.changeVolume}
                    onTogglePlay={functions.togglePlay}
                    onToggleMute={functions.toggleMute}
                    volume={status.volume}
                    isMuted={status.isMuted}
                    isPlaying={status.isPlaying}
                />
            </div>
        </div>
    );
});

function OnAirSign() {
    return (
        <div className="on-air-sign">
            <FontAwesomeIcon icon={faCircle} />
            <p>Air</p>
        </div>
    );
}

function ProgressContainer({ progress, elapsed, totalTime }) {
    return (
        <div className="progress-container">
            <div className="progress-time-wrapper">
                <span className="timemark">{formatTime(elapsed)}</span>
                <span className="timemark">{formatTime(totalTime)}</span>
            </div>
            <div className="progress-line-container">
                <div className="progress-line-wrapper">
                    <div className="progress-line"></div>
                    <div
                        className="progress-done"
                        style={{ width: `${progress}%` }}
                    ></div>
                    <div
                        className="progress-thumb"
                        style={{ left: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

function Controls({ onChangeVolume, onTogglePlay, isMuted, isPlaying, volume, onToggleMute }) {
    const getVolumeIcon = useCallback(() => {
        if (isMuted) return faVolumeMute;
        if (volume <= 0.5) return faVolumeLow;
        return faVolumeHigh;
    }, [isMuted, volume]);

    return (
        <div className="controls-container">
            <div className="controls-left-container">
                <button
                    className="action-btn"
                    onClick={onTogglePlay}
                >
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </button>
                <div className="sound-container">
                    <button
                        className="action-btn"
                        onClick={onToggleMute}
                    >
                        <FontAwesomeIcon icon={getVolumeIcon()} />
                    </button>
                    <input
                        onChange={onChangeVolume}
                        value={volume}
                        type="range"
                        min="0"
                        max="1"
                        step="any"
                        className="volume-slider"
                        style={{ backgroundSize: `${volume * 100}% 100%` }}
                    />
                </div>
            </div>
            <div className="controls-right-container">
                <Settings />
                <button className="action-btn">
                    <FontAwesomeIcon icon={faRectangleXmark} />
                </button>
            </div>
        </div>
    );
}
