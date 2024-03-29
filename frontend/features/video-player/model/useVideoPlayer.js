/* All the logic for video player */

import { DIRECTION, UI_FEEDBACK_TYPES } from "@/entities/video";
import { useMobileProvider, useToast } from "@/shared/model";
import { clamp, normilize } from "@/shared/utils";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 *
 * @param {Boolean} isLive is streaming live (default: false). Use false option for VoD
 * @param {Uint32Array} qualityOptions default: empty array
 * @param {Function} onChangeQuality function that fires on quality change
 * @returns
 */

export const useVideoPlayer = (isLive = false, qualityOptions = [], onChangeQuality = () => {}) => {
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);
    const videoContainerRef = useRef(null);
    const mediaContainerRef = useRef(null);
    const currentQualityRef = useRef(0);

    const tapTimer = useRef(null); // for detecting double tap on mobile
    const currentTime = useRef(0);

    /* UI feedback circles */
    const playstateUI = useRef(null);
    const volumeUI = useRef(null);
    const seekingUI_left = useRef(null);
    const seekingUI_right = useRef(null);

    const { notifyToast } = useToast();
    const { isMobile } = useMobileProvider();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [showUi, setShowUI] = useState(true);
    const [isFullscreen, setIsFullScreen] = useState(false);
    const [UIFeedbackDir, setUIFeedbackDir] = useState("");
    const [buffered, setBuffered] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);
    const [currentSpeed, setCurrentSpeed] = useState(+window.sessionStorage.getItem("user_playback_rate") || 1);

    const togglePlay = () => {
        if (!videoRef.current?.paused) {
            videoRef.current?.pause();
            setIsPlaying(false);
        } else {
            videoRef.current?.play();
            setIsPlaying(true);
        }
        toggleUIFeedback(UI_FEEDBACK_TYPES.PLAYBACK);
    };
    // Triggers UI feedback elements such as circles with UI information (play/pause/volume etc)
    const toggleUIFeedback = (type, direction = DIRECTION.L) => {
        switch (type) {
            case UI_FEEDBACK_TYPES.PLAYBACK:
                toggleElement(playstateUI.current);
                break;
            case UI_FEEDBACK_TYPES.SEEKING:
                setUIFeedbackDir(direction);
                if (direction === DIRECTION.L) return toggleElement(seekingUI_left.current);
                if (direction === DIRECTION.R) return toggleElement(seekingUI_right.current);
                break;
            case UI_FEEDBACK_TYPES.VOLUME_CHANGE:
                setUIFeedbackDir(direction);
                toggleElement(volumeUI.current);
                break;
            default:
                return;
        }

        function toggleElement(el) {
            if (!el) return;
            el.classList.remove("ui-feedback");
            setTimeout(() => {
                el.classList.add("ui-feedback");
            }, 10);
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;

        if (isMuted) {
            setIsMuted(false);
            videoRef.current.muted = false;
            setVolume(videoRef.current.volume);
        } else {
            videoRef.current.muted = true;
            setIsMuted(true);
            setVolume(0);
        }
    };

    const updateProgress = (e) => {
        currentTime.current = e.target.currentTime;
        setProgress(Number(((e.target.currentTime / e.target.duration) * 100).toFixed(4)));
    };

    const setPlaybackRate = (value) => {
        if (!videoRef.current) return;
        setCurrentSpeed(value);
        videoRef.current.playbackRate = value;

        window.sessionStorage.setItem("user_playback_rate", value);
    };

    const skip = (dir) => {
        if (isLive) return;
        if (!videoRef.current || !videoRef.current.duration) return;

        videoRef.current.currentTime += 5 * dir;
        toggleUIFeedback(UI_FEEDBACK_TYPES.SEEKING, dir < 0 ? DIRECTION.L : DIRECTION.R);
        updateProgress({ target: videoRef.current });
    };

    const requestFullscreen = () => {
        const media_container = mediaContainerRef.current;
        const video = videoRef.current;
        if (!media_container || !video) return;

        if (media_container.requestFullscreen) {
            return media_container.requestFullscreen();
        } else if (media_container.msRequestFullscreen) {
            return media_container.msRequestFullscreen();
        } else if (media_container.mozRequestFullscreen) {
            return media_container.mozRequestFullscreen();
        } else if (media_container.webkitRequestFullscreen) {
            return media_container.webkitRequestFullscreen();
        } else if (media_container.webkitEnterFullscreen) {
            return media_container.webkitEnterFullscreen();
        } else if (video.webkitRequestFullscreen) {
            return video.webkitRequestFullscreen();
        } else if (video.webkitEnterFullscreen) {
            return video.webkitEnterFullscreen();
        }
    };

    const handleOnFullscreenChange = (e) => {
        !!document.fullscreenElement ? setIsFullScreen(true) : setIsFullScreen(false);
        if (!videoRef.current && !isMobile) return;

        // Update state after small delay, sync state after closing native mobile fullscreen player. Mostly on IOS Safari
        setTimeout(() => {
            setIsMuted(videoRef.current.muted);
            setIsPlaying(!videoRef.current.paused);
            setCurrentSpeed(videoRef.current.playbackRate);
        }, 500);
    };

    const toggleFullscreen = async () => {
        try {
            if (!!document.fullscreenElement) {
                await window.document.exitFullscreen();
            } else {
                await requestFullscreen();
            }
        } catch (error) {
            notifyToast("Something went wrong!" + error.message, true);
            setIsFullScreen(!!document.fullscreenElement);
        }
    };

    const reset = () => {
        setIsPlaying(false);
        currentTime.current = 0;
        setProgress(0);
        setIsBuffering(false);
    };

    const changeVolume = (e) => {
        if (!videoRef.current) return;
        const value = clamp(+e.target.value, 0, 1);

        if (value <= 0) setIsMuted(true);
        if (value > 0) setIsMuted(false);
        if (isMuted) toggleMute();
        videoRef.current.volume = value;
        setVolume(value);
        window.localStorage.setItem("user_video_volume", e.target.value);
    };

    const mapMousePosToProgressBar = (e) => {
        if (!progressBarRef.current) return;
        const node = progressBarRef.current.getBoundingClientRect();
        const percentage = Number((Math.min(Math.max(0, e.clientX - node.x), node.width) / node.width) * 100);
        return percentage;
    };

    const bufferHandler = (e) => {
        if (isLive) return;
        const video = e.target;
        if (!video.duration) return;

        if (video.buffered && video.buffered.length > 0 && video.buffered.end) {
            const buffered = video.buffered.end(video.buffered.length - 1);

            const duration = video.duration;
            const buffered_percentage = (buffered / duration) * 100;
            setBuffered(buffered_percentage);
        }
    };

    const handleMetadata = (e) => {
        if (!currentQualityRef.current) currentQualityRef.current = e.target.videoHeight;
        changeVolume({ target: { value: Number(window.localStorage.getItem("user_video_volume") || 0.5) } });
        setPlaybackRate(+window.sessionStorage.getItem("user_playback_rate") || 1);
        if (isLive) {
            toggleMute();
            togglePlay();
        }
    };

    const setError = (err) => notifyToast(err, true); // temporary solution;

    const previewSeeking = (e) => {
        if (isLive) return;
        if (!videoRef.current || !videoRef.current.duration) return;

        const percentage = mapMousePosToProgressBar(e);
        if (videoRef.current.paused && isSeeking) {
            currentTime.current = Number((percentage / 100) * videoRef.current.duration);
            setProgress(percentage);
        }
        setPreview(percentage);
    };

    const changeCurrentTime = (e) => {
        if (isLive) return;
        if (!videoRef.current || !videoRef.current.duration) return;
        const percentage = mapMousePosToProgressBar(e);
        videoRef.current.currentTime = Number((percentage / 100) * videoRef.current.duration);
    };

    const handleCanPlay = () => setIsBuffering(false);

    const handleLoading = () => setIsBuffering(true);

    /* Main handlers */

    // Listens for mouse on top level
    const handleMouseMove = useCallback(
        (e) => {
            if (progressBarRef.current.contains(e.target) || isSeeking) {
                previewSeeking(e);
            } else {
                setPreview(0);
            }

            setShowUI(true);
        },
        [progressBarRef.current, isSeeking, isLive]
    );

    const handleMouseUp = useCallback(
        (e) => {
            if (progressBarRef.current.contains(e.target) || isSeeking) {
                changeCurrentTime(e);
                setIsSeeking(false);
                setPreview(0);
            } else {
                if (videoRef.current.contains(e.target)) togglePlay();
            }
        },
        [progressBarRef.current, isSeeking, togglePlay, isLive]
    );

    const handleMouseDown = useCallback(
        (e) => {
            if (progressBarRef.current.contains(e.target)) {
                setIsSeeking(true);
            }
        },
        [progressBarRef.current]
    );

    /* Mobile Handlers */

    const handleDoubleTap = (e) => {
        if (!videoContainerRef.current) return;
        if (!tapTimer.current) {
            tapTimer.current = setTimeout(function () {
                tapTimer.current = null;
            }, 300);
        } else {
            clearTimeout(tapTimer.current);
            tapTimer.current = null;
            if (isLive) return toggleFullscreen(); // No skipping when live, just open fullscreen on double tap
            const { width, x } = videoContainerRef.current.getBoundingClientRect();
            const { clientX } = e.changedTouches[0];
            const norm = normilize(clientX, x, x + width);

            skip(norm < 0.5 ? -1 : 1);
            return true;
        }
    };

    const handleTouchStart = (e) => {
        if (videoRef.current === e.target) e.preventDefault();

        handleDoubleTap(e);
        if (progressBarRef.current.contains(e.target)) {
            setIsSeeking(true);
        }
    };

    const handleTouchMove = useCallback(
        (e) => {
            const { clientX, clientY } = e.changedTouches[0];

            handleMouseMove({ target: e.target, clientX, clientY });
        },
        [handleMouseMove]
    );

    const handleTouchEnd = useCallback(
        (e) => {
            const { clientX, clientY } = e.changedTouches[0];
            if (progressBarRef.current.contains(e.target) || isSeeking) {
                changeCurrentTime({ target: e.target, clientX, clientY });
                setIsSeeking(false);
                setPreview(0);
            } else {
                if (videoRef.current.contains(e.target) && showUi) togglePlay();
            }
            setShowUI(true);
        },
        [progressBarRef.current, togglePlay, showUi, isSeeking]
    );

    useEffect(() => {
        if (!isPlaying || !showUi) return;
        const delay = 1000 * 10;
        const timeout = setTimeout(() => {
            setShowUI(false);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [showUi, isPlaying]);

    useEffect(() => {
        if (!videoContainerRef.current) return;
        const videoContainer = videoContainerRef.current;

        if (isMobile) {
            videoContainer.addEventListener("touchstart", handleTouchStart);
            videoContainer.addEventListener("touchmove", handleTouchMove);
            videoContainer.addEventListener("touchend", handleTouchEnd);
        } else {
            videoContainer.addEventListener("mousemove", handleMouseMove);
            videoContainer.addEventListener("mousedown", handleMouseDown);
            videoContainer.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            if (isMobile) {
                videoContainer.removeEventListener("touchstart", handleTouchStart);
                videoContainer.removeEventListener("touchmove", handleTouchMove);
                videoContainer.removeEventListener("touchend", handleTouchEnd);
            } else {
                videoContainer.removeEventListener("mousemove", handleMouseMove);
                videoContainer.removeEventListener("mousedown", handleMouseDown);
                videoContainer.removeEventListener("mouseup", handleMouseUp);
            }
        };
    }, [videoContainerRef.current, isLive, handleMouseDown, handleMouseMove, handleMouseUp, isMobile, handleTouchEnd]);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        video.addEventListener("ended", reset);
        video.addEventListener("timeupdate", updateProgress);
        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("loadedmetadata", handleMetadata);
        video.addEventListener("dblclick", toggleFullscreen);
        video.addEventListener("progress", bufferHandler);
        video.addEventListener("waiting", handleLoading);
        video.addEventListener("error", setError);

        document.addEventListener("fullscreenchange", handleOnFullscreenChange);
        video.addEventListener("webkitendfullscreen", handleOnFullscreenChange);

        return () => {
            video.removeEventListener("ended", reset);
            video.removeEventListener("timeupdate", updateProgress);
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("progress", bufferHandler);
            video.removeEventListener("waiting", handleLoading);
            video.removeEventListener("loadedmetadata", handleMetadata);
            video.removeEventListener("error", setError);
            video.removeEventListener("dblclick", toggleFullscreen);

            document.removeEventListener("fullscreenchange", handleOnFullscreenChange);
            video.removeEventListener("webkitendfullscreen", handleOnFullscreenChange);
        };
    }, [videoRef.current, isLive]);

    /* Button handlers */

    useEffect(() => {
        if (isMobile) return;

        const handleKeys = (e) => {
            if (videoContainerRef.current !== e.target || !videoRef.current) return;

            setShowUI(true);
            switch (e.code) {
                case "ArrowRight":
                    e.preventDefault();
                    skip(1);
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    skip(-1);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    toggleUIFeedback(UI_FEEDBACK_TYPES.VOLUME_CHANGE, DIRECTION.U);
                    changeVolume({ target: { value: videoRef.current.volume + 0.1 } });
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    toggleUIFeedback(UI_FEEDBACK_TYPES.VOLUME_CHANGE, DIRECTION.D);
                    changeVolume({ target: { value: videoRef.current.volume - 0.1 } });
                    break;
                case "KeyF":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "Space":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "KeyM":
                    e.preventDefault();
                    toggleMute();
                    break;

                default:
                    return;
            }
        };

        document.addEventListener("keydown", handleKeys);
        return () => {
            document.removeEventListener("keydown", handleKeys);
        };
    }, [videoRef.current, isLive, isPlaying, videoContainerRef.current, volume, isMobile]);

    return {
        functions: {
            togglePlay,
            toggleMute,
            changeVolume,
            setPlaybackRate,
            toggleFullscreen,
            setError,
            onChangeQuality,
            setIsBuffering,
            reset
        },
        status: {
            isMuted,
            isPlaying,
            volume,
            currentTime: currentTime.current,
            progress,
            videoTime: videoRef.current?.duration,
            preview,
            isSeeking,
            isFullscreen,
            showUi,
            UIFeedbackDir,
            isMobile,
            buffered,
            isLive,
            qualityOptions,
            currentQuality: currentQualityRef.current,
            isBuffering,
            currentSpeed
        },
        refs: {
            videoRef,
            progressBarRef,
            videoContainerRef,
            mediaContainerRef,
            playstateUI,
            seekingUI_left,
            seekingUI_right,
            volumeUI
        }
    };
};
