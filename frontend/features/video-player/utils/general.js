export const convertToQualityLevel = (bitrate) => {
    if (!bitrate) return 0;

    if (bitrate <= 2048000) return 1080;
    if (bitrate <= 1552000) return 720;
    if (bitrate <= 480000) return 480;
    if (bitrate <= 288000) return 360;
};
