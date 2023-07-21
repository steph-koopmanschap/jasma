import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 
 * Infinite scroll hooks works with Virtualized wrapper.
 * onRequestNext: function that fires upon reaching last element from the list. It returns current page number
 * isLoading: hook this state with your local loading state to avoid numerous requests
 * options: options for Intersection observer API
 * USAGE:
 * Attach lastElRef to the last list element to fire onRequestNext upon reaching the element. 
 */

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
