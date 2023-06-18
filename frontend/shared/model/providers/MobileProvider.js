import { createContext, useContext } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const MobileCtx = createContext();

export const useMobileProvider = () => {
    const context = useContext(MobileCtx);

    if (!context) throw new Error("must be used within provider Mobile Provider");

    return context;
};

export const MobileProvider = ({ children }) => {
    const { isMobile } = useIsMobile();

    return <MobileCtx.Provider value={{ isMobile }}>{children}</MobileCtx.Provider>;
};
