export const formatTime = (seconds) => {
    let secs = seconds.toFixed(0);

    let hours = secs >= 3600 ? (secs / 3600).toFixed(0) : "00";
    let mins = secs >= 60 ? (secs / 60).toFixed(0) : "00";

    return `${hours.length < 2 ? "0" + hours : hours}:${mins.length < 2 ? "0" + mins : mins}:${
        secs.length < 2 ? "0" + secs : secs
    }`;
};
