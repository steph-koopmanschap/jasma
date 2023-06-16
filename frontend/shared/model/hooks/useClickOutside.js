import { useEffect, useRef, useState } from "react";

/* Usage: 
    ref should be attached to the component we want to be closed when click is registered somewhere outside.
    isVisible controls whether component should be visible initially.
    
*/

export const useClickOutside = (isVisisble) => {
    const [isShow, setIsShow] = useState(isVisisble);

    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) setIsShow(false);
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isShow]);

    return { ref, isShow, setIsShow };
};
