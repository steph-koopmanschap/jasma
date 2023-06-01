import { useState, useEffect } from "react";

export const FilePreview = ({ file }) => {
    const [objectUrl, setObjectUrl] = useState();

    useEffect(() => {
        if (file) {
            URL.revokeObjectURL(objectUrl);
            setObjectUrl(URL.createObjectURL(file));
        }

        () => {
            if (objectUrl) {
                URL.revokeObjectUrl(objectUrl);
            }
        };
    }, [file]);

    if (!file) {
        return null;
    }

    if (file.type.includes("image")) {
        return (
            <img
                src={objectUrl}
                id="imagePreview"
                alt="Image preview"
                width="250px"
                height="250px"
            />
        );
    }

    if (file.type.includes("video")) {
        return (
            <video
                id="videoPreview"
                width="320"
                height="240"
                controls
            >
                <source
                    src={objectUrl}
                    type={file.type}
                />
                Your browser does not support video previews.
            </video>
        );
    }

    if (file.type.includes("audio")) {
        return (
            <audio
                id="audioPreview"
                controls
            >
                <source
                    src={objectUrl}
                    type={file.type}
                />
                Your browser does not support audio previews.
            </audio>
        );
    }
};
