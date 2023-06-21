import { HSL_CONFIG } from "@/entities/stream";
import { useVideoPlayer } from "@/features/video-player";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export const useStreamLogic = (stream_src, isLive) => {
    const [qualityOptions, setQualityOptions] = useState([]);

    const isFirstLoad = useRef(true);
    const hls = useRef(null);
    const Events = Hls.Events;

    const changeQuality = (newQuality) => {
        if (!hls.current) return;
        hls.current.levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
                hls.current.currentLevel = levelIndex;
            }
        });
    };

    const { refs, functions, status } = useVideoPlayer(isLive, qualityOptions, changeQuality);
    const videoRef = refs.videoRef;
    const videoSrc = stream_src;

    const handleManifestParsed = (_, data) => {
        setQualityOptions(() => {
            return data.levels.map((l) => l.height);
        });
        functions.setIsBuffering(true);
    };

    const handleFragBuffered = (_, data) => {
        if (isFirstLoad.current && isLive) {
            functions.toggleMute();
            functions.togglePlay();
            isFirstLoad.current = false;
        }
        functions.setIsBuffering(false);
    };
    const handleError = (_, data) => {
        if (!hls.current) return;
        console.log(data);
        if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
            return functions.setIsBuffering(true);
        }

        if (data.fatal) {
            switch (data.type) {
                case Hls.ErrorTypes.MEDIA_ERROR:
                    functions.setError("Fatal media error encountered, trying to recover");
                    hls.current.recoverMediaError();
                    break;
                case Hls.ErrorTypes.NETWORK_ERROR:
                    functions.setError("Fatal network error encountered");
                    // All retries and media options have been exhausted.
                    // Immediately trying to restart loading could cause loop loading.
                    // Consider modifying loading policies to best fit your asset and network
                    // conditions (manifestLoadPolicy, playlistLoadPolicy, fragLoadPolicy).
                    hls.current.destroy();
                    hls.current = null;
                    functions.reset();
                    break;

                default:
                    // cannot recover
                    hls.current = null;
                    hls.current.destroy();
                    functions.reset();
                    break;
            }
        }
    };

    useEffect(() => {
        if (!videoRef.current) return;
        const video = videoRef.current;

        if (Hls.isSupported()) {
            hls.current = new Hls(HSL_CONFIG);
            hls.current.config.backBufferLength = 10;
            hls.current.config.maxBufferLength = 10;

            hls.current.loadSource(videoSrc);
            hls.current.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.addEventListener("loadedmetadata", (e) => {
                functions.togglePlay();
                functions.toggleMute();
            });
        }
    }, [stream_src, videoRef.current]);

    useEffect(() => {
        if (!hls.current) return;

        hls.current.on(Events.MANIFEST_PARSED, handleManifestParsed);
        hls.current.on(Events.ERROR, handleError);
        hls.current.on(Events.FRAG_BUFFERED, handleFragBuffered);
        return () => {
            if (!hls.current) return;
            hls.current.off(Events.MANIFEST_PARSED, handleManifestParsed);
            hls.current.off(Events.ERROR, handleError);
            hls.current.off(Events.FRAG_BUFFERED, handleFragBuffered);
        };
    }, [hls.current]);

    return {
        refs,
        status,
        functions,
        videoSrc
    };
};
