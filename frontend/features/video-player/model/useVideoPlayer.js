/* All the logic for video player */

import { useMobileProvider, useToast } from "@/shared/model";
import { clamp, normilize } from "@/shared/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export const UI_FEEDBACK_TYPES = {
    PLAYBACK: "playback",
    SEEKING: "seeking",
    VOLUME_CHANGE: "volume_change"
};

export const DIRECTION = {
    L: "left",
    R: "right",
    U: "up",
    D: "down"
};

export const useVideoPlayer = () => {
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);
    const videoContainerRef = useRef(null);
    const mediaContainerRef = useRef(null);

    const tapTimer = useRef(null); // for detecting double tap on mobile
    const currentTime = useRef(0);
    const videoTime = useRef(0);
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
    const [UIFeedback, setUIFeedback] = useState({});
    const [buffered, setBuffered] = useState(0);

    const togglePlay = useCallback(() => {
        if (!videoRef.current?.duration) return;
        if (isPlaying) {
            videoRef.current?.pause();
            setIsPlaying(false);
        } else {
            videoRef.current?.play();
            setIsPlaying(true);
        }
        toggleUIFeedback(UI_FEEDBACK_TYPES.PLAYBACK);
    }, [isPlaying, videoRef.current]);

    // Triggers UI feedback elements such as circles with UI information (play/pause/volume etc)
    const toggleUIFeedback = useCallback((type, direction = DIRECTION.L) => {
        switch (type) {
            case UI_FEEDBACK_TYPES.PLAYBACK:
                return setUIFeedback({ type });
            case UI_FEEDBACK_TYPES.SEEKING:
                return setUIFeedback({ type, dir: direction });
            case UI_FEEDBACK_TYPES.VOLUME_CHANGE:
                return setUIFeedback({ type, dir: direction });
            default:
                return;
        }
    }, []);

    const toggleMute = useCallback(() => {
        if (!videoRef.current) return;

        if (isMuted) {
            setIsMuted(false);
            videoRef.current.muted = false;
            setVolume(videoRef.current.volume);
        } else {
            videoRef.current.muted = true;
            window.localStorage.setItem("user_video_volume", "0");
            setIsMuted(true);
            setVolume(0);
        }
    }, [isMuted]);

    const updateProgress = useCallback((e) => {
        currentTime.current = e.target.currentTime;
        setProgress(Number(((e.target.currentTime / e.target.duration) * 100).toFixed(4)));
    }, []);

    const setPlaybackRate = useCallback(
        (value) => {
            if (!videoRef.current) return;

            videoRef.current.playbackRate = value;

            window.sessionStorage.setItem("user_playback_rate", value);
        },
        [videoRef.current]
    );

    const skip = useCallback(
        (dir) => {
            if (!videoRef.current || !videoRef.current.duration) return;
            videoRef.current.currentTime += 5 * dir;
            toggleUIFeedback(UI_FEEDBACK_TYPES.SEEKING, dir < 0 ? DIRECTION.L : DIRECTION.R);
        },
        [videoRef.current]
    );

    const requestFullscreen = useCallback(() => {
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
    }, [mediaContainerRef.current, videoRef.current]);

    const handleOnFullscreenChange = useCallback((e) => {
        !!document.fullscreenElement ? setIsFullScreen(true) : setIsFullScreen(false);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        try {
            if (!!document.fullscreenElement) {
                await window.document.exitFullscreen();
            } else {
                await requestFullscreen();
            }
        } catch (error) {
            notifyToast("Something went wrong!", true);
            setIsFullScreen(!!document.fullscreenElement);
        }
    }, [requestFullscreen, isMobile]);

    const reset = useCallback(() => {
        setIsPlaying(false);
        currentTime.current = 0;
        setProgress(0);
    }, []);

    const changeVolume = useCallback(
        (e) => {
            if (!videoRef.current) return;
            const value = clamp(+e.target.value, 0, 1);

            if (value <= 0) setIsMuted(true);
            if (value > 0) setIsMuted(false);
            if (isMuted) toggleMute();
            videoRef.current.volume = value;
            setVolume(value);
            window.localStorage.setItem("user_video_volume", e.target.value);
        },
        [videoRef.current, toggleMute]
    );

    const mapMousePosToProgressBar = useCallback(
        (e) => {
            if (!progressBarRef.current) return;
            const node = progressBarRef.current.getBoundingClientRect();
            const percentage = Number(
                ((Math.min(Math.max(0, e.clientX - node.x), node.width) / node.width) * 100).toFixed(4)
            );
            return percentage;
        },
        [progressBarRef.current]
    );

    const bufferHandler = useCallback((e) => {
        const video = e.target;
        if (!video.duration) return;

        if (video.buffered && video.buffered.length > 0 && video.buffered.end) {
            const buffered = video.buffered.end(video.buffered.length - 1);

            console.log(video.buffered, buffered, video.buffered.start(video.buffered.length - 1));
            const duration = video.duration;
            const buffered_percentage = (buffered / duration) * 100;
            setBuffered(buffered_percentage);
        }
    }, []);

    const previewSeeking = useCallback(
        (e) => {
            if (!videoRef.current || !videoRef.current.duration) return;

            const percentage = mapMousePosToProgressBar(e);
            if (videoRef.current.paused && isSeeking) {
                currentTime.current = Number(((percentage / 100) * videoRef.current.duration).toFixed(4));
                setProgress(percentage);
                return;
            }
            setPreview(percentage);
        },
        [mapMousePosToProgressBar, videoRef.current, isSeeking]
    );

    const changeCurrentTime = useCallback(
        (e) => {
            if (!videoRef.current || !videoRef.current.duration) return;
            const percentage = mapMousePosToProgressBar(e);
            videoRef.current.currentTime = Number(((percentage / 100) * videoRef.current.duration).toFixed(4));
        },
        [mapMousePosToProgressBar, videoRef.current]
    );

    const setVideoStats = useCallback((e) => {
        videoTime.current = e.target.duration;
        changeVolume({ target: { value: Number(window.localStorage.getItem("user_video_volume") || 0.5) } });
        setPlaybackRate(+window.sessionStorage.getItem("user_playback_rate") || 1);
    }, []);

    const setVideoQuality = useCallback(() => {
        if (!videoRef.current) return;
    }, []);

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
        [progressBarRef.current, isSeeking]
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
        [progressBarRef.current, isSeeking, togglePlay]
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
            }, 500);
        } else {
            clearTimeout(tapTimer.current);
            tapTimer.current = null;
            const { width, x } = videoContainerRef.current.getBoundingClientRect();
            const { clientX } = e.changedTouches[0];
            const norm = normilize(clientX, x, x + width);

            skip(norm < 0.5 ? -1 : 1);
            return true;
        }
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        if (handleDoubleTap(e)) return;
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
        if (!UIFeedback.type) return;
        const delay = 200;
        const timeout = setTimeout(() => {
            setUIFeedback((prev) => Object.create(null));
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [UIFeedback]);

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
    }, [videoContainerRef.current, handleMouseDown, handleMouseMove, handleMouseUp, isMobile, handleTouchEnd]);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        video.addEventListener("ended", reset);
        video.addEventListener("timeupdate", updateProgress);
        video.addEventListener("canplay", setVideoStats);
        video.addEventListener("dblclick", toggleFullscreen);
        video.addEventListener("progress", bufferHandler);

        document.addEventListener("fullscreenchange", handleOnFullscreenChange);

        return () => {
            video.removeEventListener("ended", reset);
            video.removeEventListener("timeupdate", updateProgress);
            video.removeEventListener("canplay", setVideoStats);
            video.removeEventListener("progress", bufferHandler);
            video.removeEventListener("dblclick", toggleFullscreen);
        };
    }, [videoRef.current]);

    /* Button handlers */

    useEffect(() => {
        if (isMobile) return;

        const handleKeys = (e) => {
            if (videoContainerRef.current !== e.target || !videoRef.current) return;
            e.preventDefault();
            setShowUI(true);
            switch (e.code) {
                case "ArrowRight":
                    skip(1);
                    break;
                case "ArrowLeft":
                    skip(-1);
                    break;
                case "ArrowUp":
                    toggleUIFeedback(UI_FEEDBACK_TYPES.VOLUME_CHANGE, DIRECTION.U);
                    changeVolume({ target: { value: videoRef.current.volume + 0.1 } });
                    break;
                case "ArrowDown":
                    toggleUIFeedback(UI_FEEDBACK_TYPES.VOLUME_CHANGE, DIRECTION.D);
                    changeVolume({ target: { value: videoRef.current.volume - 0.1 } });
                    break;
                case "KeyF":
                    toggleFullscreen();
                    break;
                case "Space":
                    togglePlay();
                    break;
                case "KeyM":
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
    }, [videoRef.current, videoContainerRef.current, volume, togglePlay, toggleFullscreen, toggleMute, isMobile]);

    return {
        functions: {
            togglePlay,
            toggleMute,
            changeVolume,
            setPlaybackRate,
            toggleFullscreen
        },
        status: {
            isMuted,
            isPlaying,
            volume,
            currentTime: currentTime.current,
            progress,
            videoTime: videoTime.current,
            preview,
            isSeeking,
            isFullscreen,
            showUi,
            UIFeedback,
            isMobile,
            buffered
        },
        refs: {
            videoRef,
            progressBarRef,
            videoContainerRef,
            mediaContainerRef
        }
    };
};
