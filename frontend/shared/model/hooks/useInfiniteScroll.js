import { useCallback, useEffect, useRef, useState } from "react";

export const useInfiniteScroll = ({ onRequestNext, isLoading, startPage, options = {} }) => {
    const [currPage, setCurrPage] = useState(startPage);
    const lastElRef = useRef(null);

    const fetchNext = useCallback(() => {
        onRequestNext(currPage);
        setCurrPage((prev) => prev + 1);
    }, [currPage]);

    useEffect(() => {
        if (!lastElRef.current || isLoading) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    fetchNext();
                    observer.disconnect();
                }
            });
        }, options);

        observer.observe(lastElRef.current);

        return () => {
            observer.disconnect();
        };
    }, [lastElRef.current, currPage, isLoading]);

    return {
        lastElRef
    };
};
