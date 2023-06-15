import { useEffect, useState } from "react";

/* Simplified for now */

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const updateSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        updateSize();
        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize);
    }, [isMobile]);

    return { isMobile };
};
