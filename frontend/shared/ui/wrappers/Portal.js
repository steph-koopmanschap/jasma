import { createPortal } from "react-dom";

export const Portal = ({ parent, children }) => {
    return createPortal(children, parent || document.body);
};
