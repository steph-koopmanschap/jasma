import {
    faPause,
    faPlay,
    faRectangleXmark,
    faTvAlt,
    faVolumeHigh,
    faVolumeLow,
    faVolumeMute
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useCallback } from "react";
import { DIRECTION, UI_FEEDBACK_TYPES, useVideoPlayer } from "../model/useVideoPlayer";
import { formatTime } from "../utils/formatTime";
import { Settings } from "./Settings";
import { OnAirSign, PlayState, SeekingDirection, VolumeDirection } from "./UI";
import "./VideoPlayer.css";

export const VideoPlayer = forwardRef(({ isLive = false }, forwardedRef) => {
    const { refs, functions, status } = useVideoPlayer();

    return (
        <div
            className="player-container"
            ref={refs.videoContainerRef}
            tabIndex={1}
        >
            <video
                id="video"
                ref={(el) => {
                    refs.videoRef.current = el;
                    forwardedRef.current = el;
                }}
                src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
            >
                Your browser does not support HTML5 video.
            </video>
            {status.showUi ? <div className="top-curtain"></div> : null}
            <div className={`${status.isSeeking && !status.isPlaying ? "fullscreen-curtain" : ""}`}></div>
            {status.showUi && isLive ? <OnAirSign /> : null}
            <div className="video-left">
                {status.UIFeedback.type === UI_FEEDBACK_TYPES.SEEKING && status.UIFeedback.dir === DIRECTION.L ? (
                    <SeekingDirection direction={status.UIFeedback.dir} />
                ) : null}
            </div>
            <div className="video-center">
                {status.UIFeedback.type === UI_FEEDBACK_TYPES.VOLUME_CHANGE ? (
                    <VolumeDirection
                        volume={status.volume}
                        direction={status.UIFeedback.dir}
                    />
                ) : null}
                {status.UIFeedback.type === UI_FEEDBACK_TYPES.PLAYBACK ? (
                    <PlayState isPlaying={status.isPlaying} />
                ) : null}
            </div>
            <div className="video-right">
                {status.UIFeedback.type === UI_FEEDBACK_TYPES.SEEKING && status.UIFeedback.dir === DIRECTION.R ? (
                    <SeekingDirection direction={status.UIFeedback.dir} />
                ) : null}
            </div>

            <div
                className={`control-panel-container ${
                    status.showUi ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            >
                <ProgressContainer
                    ref={refs.progressBarRef}
                    elapsed={status.currentTime}
                    totalTime={status.videoTime}
                    preview={status.preview}
                    progress={status.progress}
                    isSeeking={status.isSeeking}
                />
                <Controls
                    onChangeVolume={functions.changeVolume}
                    onTogglePlay={functions.togglePlay}
                    onToggleMute={functions.toggleMute}
                    onToggleFullscreen={functions.toggleFullscreen}
                    volume={status.volume}
                    onPlaybackChange={functions.setPlaybackRate}
                    onQualityChange={() => {}}
                    isMuted={status.isMuted}
                    isFullscreen={status.isFullscreen}
                    isPlaying={status.isPlaying}
                    isMobile={status.isMobile}
                />
            </div>
        </div>
    );
});

const ProgressContainer = forwardRef(({ progress, elapsed, totalTime, preview, isSeeking }, ref) => {
    return (
        <div className="progress-container">
            <div className="progress-time-wrapper">
                <span className="timemark">{formatTime(elapsed)}</span>
                <span className="timemark">{formatTime(totalTime)}</span>
            </div>
            <div
                className={`${isSeeking ? "progress-line-container-large" : ""} progress-line-container`}
                ref={ref}
            >
                <div className="progress-line-wrapper">
                    <div className="progress-line"></div>
                    <div
                        className="progress-done"
                        style={{ width: `${progress}%` }}
                    ></div>
                    <div
                        className="progress-thumb"
                        style={{ left: `${progress - 0.5}%` }}
                    ></div>
                    <div
                        className="progress-preview"
                        style={{ width: `${preview}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
});

function Controls({
    onChangeVolume,
    onTogglePlay,
    isMuted,
    isPlaying,
    volume,
    onToggleMute,
    onPlaybackChange,
    onQualityChange,
    onToggleFullscreen,
    isFullscreen,
    isMobile
}) {
    const getVolumeIcon = useCallback(() => {
        if (isMuted || volume === 0) return faVolumeMute;
        if (volume <= 0.5) return faVolumeLow;
        return faVolumeHigh;
    }, [isMuted, volume]);

    return (
        <div className="controls-container">
            <div className="controls-left-container">
                <button
                    className="action-btn"
                    onClick={onTogglePlay}
                    onTouchStart={onTogglePlay}
                >
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </button>
                {!isMobile ? (
                    <div className="sound-container">
                        <button
                            className="action-btn"
                            onClick={onToggleMute}
                            onTouchStart={onToggleMute}
                        >
                            <FontAwesomeIcon icon={getVolumeIcon()} />
                        </button>
                        <input
                            onChange={onChangeVolume}
                            value={volume}
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            className="volume-slider"
                            style={{ backgroundSize: `${volume * 100}% 100%` }}
                        />
                    </div>
                ) : null}
            </div>
            <div className="controls-right-container">
                <Settings
                    onPlaybackChange={onPlaybackChange}
                    onQualityChange={onQualityChange}
                />
                <button
                    onClick={onToggleFullscreen}
                    onTouchStart={onToggleFullscreen}
                    className="action-btn"
                >
                    <FontAwesomeIcon icon={!isFullscreen ? faTvAlt : faRectangleXmark} />
                </button>
            </div>
        </div>
    );
}
