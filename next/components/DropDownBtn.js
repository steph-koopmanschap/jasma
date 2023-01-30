import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default function DropDownBtn(props) {
    //const { children } = props;

    const [isActive, setIsActive] = useState(false);

    const handleOnClick = () => {
        //props.dropDownStyle = props.dropDownStyle + " hidden"
        setIsActive(!isActive);
        
    }

    return (
        <div className={props.style}>
            <button className="" onClick={handleOnClick}><FontAwesomeIcon icon={faBars} /></button>
            
            {isActive ? 
                <div className={props.dropDownStyle}>
                    {props.children}
                </div>
            : null}

        </div>
    );
}
