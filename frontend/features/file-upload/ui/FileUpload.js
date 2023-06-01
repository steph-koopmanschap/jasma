import { FileInput } from "@/entities/file-upload";
import { FileDeleteBtn } from "./FileDeleteBtn";

export function FileUploader({ file, setFile, accept }) {
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
            {file && <FileDeleteBtn onClick={removeFile} />}
        </div>
    );
}
