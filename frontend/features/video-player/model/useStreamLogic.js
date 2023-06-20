import { HSL_CONFIG } from "@/entities/stream";
import { useVideoPlayer } from "@/features/video-player";
import Hls from "hls.js";
import { useCallback, useEffect, useRef, useState } from "react";

let s = false;
if (s) {
    const h = new Hls();
}

export const useStreamLogic = (stream_src, isLive) => {
    const [qualityOptions, setQualityOptions] = useState([]);

    const hls = useRef(null);
    const Events = Hls.Events;

    const changeQuality = useCallback(
        (newQuality) => {
            if (!hls.current) return;
            hls.current.levels.forEach((level, levelIndex) => {
                if (level.height === newQuality) {
                    hls.current.currentLevel = levelIndex;
                }
            });
        },
        [hls.current]
    );

    const { refs, functions, status } = useVideoPlayer(isLive, qualityOptions, changeQuality);
    const videoRef = refs.videoRef;
    const videoSrc = stream_src;

    const handleManifestParsed = useCallback(
        (_, data) => {
            console.log(data, hls.current);
            setQualityOptions(() => {
                return data.levels.map((l) => l.height);
            });
        },
        [videoRef.current]
    );

    const handleFragBuffered = useCallback((_, data) => {
        functions.setIsBuffering(false);
    }, []);

    const handleError = useCallback(
        (_, data) => {
            if (!hls.current) return;

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
                        functions.reset();
                        hls.current.destroy();
                        hls.current = null;
                        break;

                    default:
                        // cannot recover
                        functions.reset();
                        hls.current.destroy();
                        hls.current = null;
                        break;
                }
            }
        },
        [hls.current]
    );

    const handleMediaAttached = useCallback(() => {
        functions.setIsBuffering(true);
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;
        const video = videoRef.current;

        if (Hls.isSupported()) {
            hls.current = new Hls(HSL_CONFIG);
            hls.current.config.backBufferLength = 10;

            hls.current.loadSource(videoSrc);
            hls.current.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoSrc;
        }
    }, [stream_src, videoRef.current]);

    useEffect(() => {
        if (!hls.current) return;

        hls.current.on(Events.MANIFEST_PARSED, handleManifestParsed);
        hls.current.on(Events.MEDIA_ATTACHED, handleMediaAttached);
        hls.current.on(Events.ERROR, handleError);
        hls.current.on(Events.FRAG_BUFFERED, handleFragBuffered);
        return () => {
            if (!hls.current) return;
            hls.current.off(Events.MANIFEST_PARSED, handleManifestParsed);
            hls.current.off(Events.ERROR, handleError);
            hls.current.off(Events.FRAG_BUFFERED, handleFragBuffered);
            hls.current.off(Events.MEDIA_ATTACHED, handleMediaAttached);
        };
    }, [handleManifestParsed, handleError]);

    return {
        refs,
        status,
        functions,
        videoSrc
    };
};
