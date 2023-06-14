/* All the logic for video player */

import { useCallback, useEffect, useRef, useState } from "react";

export const useVideoPlayer = () => {
    const videoRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoTime, setVideoTime] = useState(0);
    const [preview, setPreview] = useState(0);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [controlsOpen, setControlsOpen] = useState(true);

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
            setIsMuted(true);
            setVolume(0);
        }
    }, [isMuted]);

    const updateProgress = useCallback(() => {
        setCurrentTime(video.currentTime);
        setProgress(Number(((video.currentTime / videoTime) * 100).toFixed(4)));
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        setCurrentTime(0);
    }, []);

    const changeVolume = useCallback(
        (e) => {
            if (!videoRef.current) return;

            if (Number(e.target.value) <= 0) setIsMuted(true);
            if (Number(e.target.value) > 0) setIsMuted(false);
            if (isMuted) toggleMute();
            videoRef.current.volume = e.target.value;
            setVolume(Number(e.target.value));
            window.localStorage.setItem("userVideoVolume", e.target.value.toString());
        },
        [videoRef.current, toggleMute]
    );

    // useEffect(() => {
    //     if (videoRef.current?.duration) {
    //         setVideoTime(videoRef.current.duration);
    //         changeVolume({ target: { value: Number(window.localStorage.userVideoVolume || 0.5) } });
    //     }
    // }, [videoRef.current, videoRef.current?.duration]);

    return {
        functions: {
            togglePlay,
            toggleMute,
            changeVolume,
            updateProgress,
            setVideoTime,
            reset
        },
        status: {
            isMuted,
            isPlaying,
            volume,
            currentTime,
            progress,
            videoTime
        },
        refs: {
            videoRef
        }
    };
};
