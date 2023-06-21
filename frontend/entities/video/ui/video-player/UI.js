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

export function CircleWrapper({ className = "", children }) {
    return <div className={`circle-wrapper ${className}`}>{children}</div>;
}

export function LoadingState() {
    return (
        <CircleWrapper>
            <Spinner />
        </CircleWrapper>
    );
}

export function VolumeDirection({ volume, direction }) {
    const render = () => {
        if (volume === 0) return <FontAwesomeIcon icon={faVolumeMute} />;
        if (volume > 0.5) return <FontAwesomeIcon icon={faVolumeHigh} />;
        if (volume <= 0.5) return <FontAwesomeIcon icon={faVolumeLow} />;
    };
    return (
        <CircleWrapper className="ui-feedback">
            <div className="volume-direction ui-feedback">
                {render()}
                <h3>Vol {direction === DIRECTION.D ? "-" : "+"}</h3>
            </div>
        </CircleWrapper>
    );
}

export function PlayState({ isPlaying }) {
    return (
        <CircleWrapper className="ui-feedback">
            <div className="playstate ui-feedback">
                {isPlaying ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}
            </div>
        </CircleWrapper>
    );
}

export function SeekingDirection({ direction }) {
    return (
        <CircleWrapper className={`ui-feedback absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}>
            <div className="seeking-direction ui-feedback">
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

export function ActionBtn({ onActivate, children }) {
    return (
        <button
            className="action-btn"
            onClick={onActivate}
            // onTouchStart={(e) => {
            //     onActivate();
            // }}
        >
            {children}
        </button>
    );
}

export function PreviewFrame({ preview }) {
    const frameRef = useRef(null);

    const getFrameWidth = () => {
        if (!frameRef.current) return 0;

        const { width } = frameRef.current.getBoundingClientRect();
        return width;
    };

    return (
        <div
            ref={frameRef}
            className="preview-frame"
            style={{ left: `calc(${preview}% - ${getFrameWidth() / 2}px)` }}
        ></div>
    );
}
