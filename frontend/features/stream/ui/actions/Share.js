import { StreamActionBtn } from "@/entities/stream";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Share = () => {
    return (
        <StreamActionBtn>
            <FontAwesomeIcon icon={faShare} />
        </StreamActionBtn>
    );
};
