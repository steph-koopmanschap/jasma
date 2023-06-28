import {
    faChevronCircleLeft,
    faChevronCircleRight,
    faCircle,
    faPause,
    faPlay,
    faVolumeHigh,
    faVolumeLow,
    faVolumeMute
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DIRECTION } from "../../utils/enums";
import "./VideoPlayer.css";
import { Spinner } from "@/shared/ui";
import { useRef } from "react";

/* Small UI elements */

export function OnAirSign() {
    return (
        <div className="on-air-sign">
            <FontAwesomeIcon icon={faCircle} />
            <p>Air</p>
        </div>
    );
}

export function CircleWrapper({ className = "", containerRef, children }) {
    return (
        <div
            ref={containerRef}
            className={`circle-wrapper ${className}`}
        >
            {children}
        </div>
    );
}

export function LoadingState() {
    return (
        <CircleWrapper>
            <Spinner />
        </CircleWrapper>
    );
}

export function VolumeDirection({ volume, containerRef, direction }) {
    const render = () => {
        if (volume === 0) return <FontAwesomeIcon icon={faVolumeMute} />;
        if (volume > 0.5) return <FontAwesomeIcon icon={faVolumeHigh} />;
        if (volume <= 0.5) return <FontAwesomeIcon icon={faVolumeLow} />;
    };
    return (
        <CircleWrapper
            containerRef={containerRef}
            className="opacity-0"
        >
            <div className="volume-direction">
                {render()}
                <h3>Vol {direction === DIRECTION.D ? "-" : "+"}</h3>
            </div>
        </CircleWrapper>
    );
}

export function PlayState({ isPlaying, containerRef }) {
    return (
        <CircleWrapper
            containerRef={containerRef}
            className="opacity-0"
        >
            <div className="playstate">
                {isPlaying ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}
            </div>
        </CircleWrapper>
    );
}

export function SeekingDirection({ direction, containerRef }) {
    return (
        <CircleWrapper
            className="opacity-0"
            containerRef={containerRef}
        >
            <div className="seeking-direction">
                {direction === DIRECTION.L ? (
                    <FontAwesomeIcon icon={faChevronCircleLeft} />
                ) : (
                    <FontAwesomeIcon icon={faChevronCircleRight} />
                )}
                <h3>5 sec</h3>
            </div>
        </CircleWrapper>
    );
}

export function ActionBtn({ onActivate, tooltip, children }) {
    return (
        <button
            className="action-btn"
            onClick={onActivate}
        >
            {tooltip ? <ToolTip text={tooltip} /> : null}
            {children}
        </button>
    );
}

export function ToolTip({ text }) {
    return <div className="tooltip">{text}</div>;
}

export function PreviewFrame({ preview }) {
    const frameRef = useRef(null);
    if (preview === 0) return null;
    const getFramePos = () => {
        if (!frameRef.current) return 0;

        const { width } = frameRef.current.getBoundingClientRect();
        const parentW = frameRef.current.offsetParent.offsetWidth;
        const previewPos = (preview / 100) * parentW;
        const framePos = previewPos - width / 2;

        if (framePos <= 0) return 0;
        if (framePos + width >= parentW) return parentW - width;

        return framePos;
    };

    return (
        <div
            ref={frameRef}
            className="preview-frame"
            style={{ left: `${getFramePos()}px` }}
        ></div>
    );
}
