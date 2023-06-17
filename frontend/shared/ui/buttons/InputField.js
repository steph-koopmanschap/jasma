import React, { forwardRef } from "react";
import "./Buttons.css";

export const InputField = forwardRef(({ className, ...rest }, ref) => {
    return (
        <input
            {...rest}
            ref={ref}
            type="text"
            className={`input-field ${className}`}
        />
    );
});
