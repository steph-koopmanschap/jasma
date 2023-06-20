import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const Follow = () => {
    return (
        <button className="flex items-center gap-1 text-sm font-semibold">
            <FontAwesomeIcon icon={faHeart} />
            Follow
        </button>
    );
};
