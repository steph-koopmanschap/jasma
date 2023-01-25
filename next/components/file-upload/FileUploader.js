import FileInput from "./FileInput";
import FilePreview from "./FilePreview";

function FileUploader({ file, setFile, accept }) {
    const removeFile = (e) => {
        setFile(null);
    };

    return (
        <div className="file-uploader">
            <FileInput
                file={file}
                setFile={setFile}
                accept={accept}
            />
            <FilePreview file={file} />
            {file && (
                <button
                    className="remove-file-btn formButtonDefault border p-2 m-2"
                    onClick={removeFile}
                >
                    Remove file
                </button>
            )}
        </div>
    );
}

export default FileUploader;
