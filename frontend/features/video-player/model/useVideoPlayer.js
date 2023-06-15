/* All the logic for video player */

import { useIsMobile, useToast } from "@/shared/model";
import { useCallback, useEffect, useRef, useState } from "react";

export const useVideoPlayer = () => {
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);
    const videoContainerRef = useRef(null);

    const { notifyToast } = useToast();
    const { isMobile } = useIsMobile();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoTime, setVideoTime] = useState(0);
    const [preview, setPreview] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [showUi, setShowUI] = useState(true);
    const [isFullscreen, setIsFullScreen] = useState(false);

    const togglePlay = useCallback(() => {
        if (isPlaying) {
            videoRef.current?.pause();
            setIsPlaying(false);
        } else {
            videoRef.current?.play();
            setIsPlaying(true);
        }
    }, [isPlaying]);

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
        setCurrentTime(e.target.currentTime);
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
            if (videoRef.current) {
                const factor = 0.05;
                const result = videoRef.current.duration * factor;
                videoRef.current.currentTime += result * dir;
            }
        },
        [videoRef.current]
    );

    const requestFullscreen = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        } else if (video.mozRequestFullscreen) {
            video.mozRequestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        }
    }, [videoRef.current]);

    const handleOnFullscreenChange = useCallback((e) => {
        !!document.fullscreenElement ? setIsFullScreen(true) : setIsFullScreen(false);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        if (isMobile) return requestFullscreen();

        const video_container = videoContainerRef.current;

        if (!video_container) return;
        try {
            if (!!document.fullscreenElement) {
                await window.document.exitFullscreen();
            } else {
                await video_container.requestFullscreen();
            }
        } catch (error) {
            notifyToast("Something went wrong!", true);
            setIsFullScreen(!!document.fullscreenElement);
        }
    }, [requestFullscreen, isMobile, videoContainerRef.current]);

    const reset = useCallback(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setProgress(0);
    }, []);

    const changeVolume = useCallback(
        (e) => {
            if (!videoRef.current) return;
            const value = +e.target.value;
            if (value > 1) return;
            if (value < 0) {
                setIsMuted(true);
                return;
            }

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

    const previewSeeking = useCallback(
        (e) => {
            if (!videoRef.current) return;

            const percentage = mapMousePosToProgressBar(e);
            if (videoRef.current.paused && isSeeking) {
                setCurrentTime(Number(((percentage / 100) * videoRef.current.duration).toFixed(4)));
                setProgress(percentage);
                return;
            }
            setPreview(percentage);
        },
        [mapMousePosToProgressBar, videoRef.current, isSeeking]
    );

    const changeCurrentTime = useCallback(
        (e) => {
            if (!videoRef.current) return;
            const percentage = mapMousePosToProgressBar(e);
            videoRef.current.currentTime = Number(((percentage / 100) * videoRef.current.duration).toFixed(4));
        },
        [mapMousePosToProgressBar, videoRef.current]
    );

    const setVideoStats = useCallback(
        (e) => {
            setVideoTime(e.target.duration);
            changeVolume({ target: { value: Number(window.localStorage.getItem("user_video_volume") || 0.5) } });
            setPlaybackRate(+window.sessionStorage.getItem("user_playback_rate") || 1);
        },
        [videoRef.current]
    );

    const setVideoQuality = useCallback(() => {
        if (!videoRef.current) return;
    }, []);

    /* Main handlers */

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

    useEffect(() => {
        if (!isPlaying || !showUi) return;
        const delay = 5000;
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

        videoContainer.addEventListener("mousemove", handleMouseMove);
        videoContainer.addEventListener("mousedown", handleMouseDown);
        videoContainer.addEventListener("mouseup", handleMouseUp);
        videoContainer.addEventListener("dblclick", toggleFullscreen);
        return () => {
            videoContainer.removeEventListener("mousemove", handleMouseMove);
            videoContainer.removeEventListener("mousedown", handleMouseDown);
            videoContainer.removeEventListener("mouseup", handleMouseUp);
            videoContainer.removeEventListener("dblclick", toggleFullscreen);
        };
    }, [videoContainerRef.current, handleMouseDown, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        video.focus();
        video.addEventListener("ended", reset);
        video.addEventListener("timeupdate", updateProgress);
        video.addEventListener("canplay", setVideoStats);

        document.addEventListener("fullscreenchange", handleOnFullscreenChange);

        return () => {
            video.removeEventListener("ended", reset);
            video.removeEventListener("timeupdate", updateProgress);
            video.removeEventListener("canplay", setVideoStats);
        };
    }, [videoRef.current]);

    /* Button handlers */

    useEffect(() => {
        const handleKeys = (e) => {
            if (videoContainerRef.current !== e.target) return;
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
                    changeVolume({ target: { value: volume + 0.2 } });
                    break;
                case "ArrowDown":
                    changeVolume({ target: { value: volume - 0.2 } });
                    break;
                case "KeyF":
                    toggleFullscreen();
                    break;
                case "Space":
                    togglePlay();
                    break;
                case "Escape":
                    break;

                default:
                    return;
            }
        };

        document.addEventListener("keydown", handleKeys);
        return () => {
            document.removeEventListener("keydown", handleKeys);
        };
    }, [videoContainerRef.current, togglePlay, toggleFullscreen, volume]);

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
            currentTime,
            progress,
            videoTime,
            preview,
            isSeeking,
            isFullscreen,
            showUi
        },
        refs: {
            videoRef,
            progressBarRef,
            videoContainerRef
        }
    };
};
