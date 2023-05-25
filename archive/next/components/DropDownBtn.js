import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default function DropDownBtn(props) {

    const [isActive, setIsActive] = useState(false);

    const handleOnClick = () => {
        setIsActive(!isActive);
    }

    return (
        <div className={props.style}>
            <button className="" onClick={handleOnClick}>
                {props.addIcon ? <FontAwesomeIcon icon={faBars} /> : props.replacementIcon}
            </button>
            
            {isActive ? 
                <div className={props.dropDownStyle}>
                    {props.children}
                </div>
            : null}

        </div>
    );
}
