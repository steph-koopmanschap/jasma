export const formatTime = (seconds) => {
    let secs = Math.round(seconds);
    let hours = secs >= 3600 ? Math.trunc(secs / 3600) : 0;
    let mins = secs >= 60 ? Math.trunc(secs / 60) : 0;

    mins = mins % 60;
    secs = secs % 60;

    return `${hours.toString().length < 2 ? "0" + hours : hours}:${mins.toString().length < 2 ? "0" + mins : mins}:${
        secs.toString().length < 2 ? "0" + secs : secs
    }`;
};
