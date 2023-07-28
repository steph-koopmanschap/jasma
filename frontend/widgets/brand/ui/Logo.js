import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";

function Logo() {
    return (
        <FontAwesomeIcon
            icon={faMugHot}
            className="w-8 h-8"
        />
    );
}

export default Logo;
