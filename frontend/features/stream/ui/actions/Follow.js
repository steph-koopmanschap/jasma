import { StreamActionBtn } from "@/entities/stream";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const Follow = () => {
    return (
        <StreamActionBtn>
            <FontAwesomeIcon icon={faHeart} />
            Follow
        </StreamActionBtn>
    );
};
