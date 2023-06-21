import React, { useCallback, useEffect, useMemo, useRef } from "react";

export const Resizable = ({ child }) => {
    const containerRef = useRef(null);

    const doResize = useCallback(
        (e) => {
            if (!containerRef.current) return;
            const container = containerRef.current;
            const { width: containerW, height: containerH } = container.getBoundingClientRect();
            const { width, height } = container.firstChild.getBoundingClientRect();

            let scale, origin;

            scale = Math.min(containerW / width, containerH / height);
            console.log(scale);

            // container.firstChild.style.transform = "translate(-50%, -50%) " + "scale(" + scale + ")";
            container.firstChild.style.transform = "scale(" + scale + ")";
        },
        [containerRef.current]
    );

    useEffect(() => {
        if (!containerRef.current) return;

        let observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                doResize();
            }
        });

        observer.observe(containerRef.current);

        return () => {
            if (!containerRef.current) return;
            observer.unobserve(containerRef.current);
        };
    }, [containerRef.current]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative resize"
        >
            {child}
        </div>
    );
};
