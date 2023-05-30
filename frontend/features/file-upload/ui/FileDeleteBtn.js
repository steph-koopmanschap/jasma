export const FileDeleteBtn = ({ onClick }) => {
    return (
        <button
            className="remove-file-btn formButtonDefault border p-2 m-2"
            onClick={onClick}
        >
            Remove file
        </button>
    );
};
