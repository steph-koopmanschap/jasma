import { useEffect, useState } from "react";

export const useDebounce = (value, delay = 50) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        let timeout = setTimeout(() => {
            setDebounced(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [value, delay]);

    return debounced;
};
