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
import { DIRECTION, UI_FEEDBACK_TYPES } from "../../utils/enums";
import { formatTime } from "../../utils/formatTime";
import { Settings } from "./Settings";
import {
    ActionBtn,
    LoadingState,
    OnAirSign,
    PlayState,
    PreviewFrame,
    SeekingDirection,
    ToolTip,
    VolumeDirection
} from "./UI";
import "./VideoPlayer.css";

/* Bare video player UI. Doesn't work without useVideoPlayer hook. Use composition pattern on upper level to make it work */

export const VideoPlayer = ({ videoSrc = "", thumbnail = "", status, refs, functions }) => {
    return (
        <div
            className="media-wrapper "
            ref={refs.mediaContainerRef}
        >
            <div
                className="player-container"
                ref={refs.videoContainerRef}
                tabIndex={1}
            >
                <div className="video-wrapper">
                    <video
                        id="video"
                        ref={refs.videoRef}
                        playsInline
                        // preload="metadata"
                        poster={thumbnail}
                        src={videoSrc}
                        type={status.type}
                    >
                        Your browser does not support HTML5 video.
                    </video>
                </div>
                {status.showUi ? <div className="top-curtain"></div> : null}
                <div className={`${status.isSeeking && !status.isPlaying ? "fullscreen-curtain" : ""}`}></div>
                {status.showUi && status.isLive && status.isPlaying ? <OnAirSign /> : null}
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
                    {status.isBuffering ? <LoadingState /> : null}
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
                        buffered={status.buffered}
                        isLive={status.isLive}
                    />
                    <Controls
                        onChangeVolume={functions.changeVolume}
                        onTogglePlay={functions.togglePlay}
                        onToggleMute={functions.toggleMute}
                        defaultQuality={status.defaultQuality}
                        onToggleFullscreen={functions.toggleFullscreen}
                        volume={status.volume}
                        qualityOptions={status.qualityOptions}
                        onPlaybackChange={functions.setPlaybackRate}
                        onQualityChange={functions.onChangeQuality}
                        isMuted={status.isMuted}
                        isFullscreen={status.isFullscreen}
                        isPlaying={status.isPlaying}
                        isMobile={status.isMobile}
                        isLive={status.isLive}
                        currentSpeed={status.currentSpeed}
                        containerRef={refs.mediaContainerRef}
                    />
                </div>
            </div>
        </div>
    );
};

const ProgressContainer = forwardRef(({ progress, elapsed, totalTime, preview, isSeeking, buffered, isLive }, ref) => {
    progress = isLive ? 100 : progress;

    return (
        <div className="progress-container">
            <div className="progress-time-wrapper">
                <span className="timemark">{formatTime(elapsed)}</span>
                {!isLive ? <span className="timemark">{formatTime(totalTime)}</span> : null}
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
                    <div
                        className="progress-preview"
                        style={{ width: `${buffered}%` }}
                    ></div>
                    {!isLive ? <PreviewFrame preview={preview} /> : null}
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
    qualityOptions,
    onToggleFullscreen,
    isFullscreen,
    isMobile,
    isLive,
    defaultQuality,
    currentSpeed,
    containerRef
}) {
    const getVolumeIcon = useCallback(() => {
        if (isMuted || volume === 0) return faVolumeMute;
        if (volume <= 0.5) return faVolumeLow;
        return faVolumeHigh;
    }, [isMuted, volume]);

    return (
        <div className="controls-container">
            <div className="controls-left-container">
                <ActionBtn
                    onActivate={onTogglePlay}
                    tooltip={isPlaying ? "pause" : "play"}
                >
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </ActionBtn>

                <div className="sound-container">
                    <ActionBtn
                        onActivate={onToggleMute}
                        tooltip={isMuted ? "unmute" : "mute"}
                    >
                        <FontAwesomeIcon icon={getVolumeIcon()} />
                    </ActionBtn>

                    {!isMobile ? (
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
                    ) : null}
                </div>
            </div>
            <div className="controls-right-container">
                <Settings
                    onPlaybackChange={onPlaybackChange}
                    onQualityChange={onQualityChange}
                    qualityOptions={qualityOptions}
                    defaultQuality={defaultQuality}
                    isMobile={isMobile}
                    isLive={isLive}
                    currentSpeed={currentSpeed}
                    containerRef={containerRef}
                />
                <ActionBtn
                    onActivate={onToggleFullscreen}
                    tooltip={isFullscreen ? "exit fullscreen" : "toggle fullscreen"}
                >
                    <FontAwesomeIcon icon={!isFullscreen ? faTvAlt : faRectangleXmark} />
                </ActionBtn>
            </div>
        </div>
    );
}
