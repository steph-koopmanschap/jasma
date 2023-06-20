import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Share = () => {
    return (
        <button className="text-sm flex justify-between items-center w-3 h-3">
            <FontAwesomeIcon icon={faShare} />
        </button>
    );
};
