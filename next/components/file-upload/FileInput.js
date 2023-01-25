import { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import checkFileTooLarge from "../../utils/checkFileTooLarge.js";

function fileInputError(text) {
    toast.error(text, {
        position: "bottom-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    });
}

const FileInput = ({ file, setFile, accept }) => {
    const inputRef = useRef(null);
    const toastId = useRef(null);

    useEffect(() => {
        if (!file) {
            inputRef.current.value = "";
        }
    }, [file]);

    const notify = (text) => (toastId.current = fileInputError(text));

    const dismiss = () => toast.dismiss(toastId.current);

    const handleChooseFileClick = (e) => {
        e.preventDefault();
        inputRef.current.click();
    };

    const handleFile = (e) => {
        const eventFile = e.target.files[0];
        if (!eventFile) {
            return;
        }

        const sizeDoesntExist = !eventFile.size;

        if (sizeDoesntExist) {
            return notify("No file size found. Invalid file.");
        }

        const fileIsTooLarge = checkFileTooLarge(eventFile.size);

        if (fileIsTooLarge) {
            return notify("File is too Large!");
        }

        setFile(eventFile);
    };

    return (
        <div className="file-input">
            <div className="file-input-mask">
                <button
                    style={{
                        background: "#6b6b6b",
                        padding: "5px",
                        borderRadius: "3px",
                        fontSize: "16px",
                        marginRight: "5px"
                    }}
                    onClick={handleChooseFileClick}
                >
                    Choose File
                </button>
                <span>{file ? file.name : "No file chosen"}</span>
            </div>
            <input
                ref={inputRef}
                className="hidden-file-input"
                type="file"
                name="file"
                accept={accept ? accept : "image/*, video/*, audio/*"}
                onInput={handleFile}
                onClick={dismiss}
                style={{ display: "none" }}
            />
        </div>
    );
};

export default FileInput;
