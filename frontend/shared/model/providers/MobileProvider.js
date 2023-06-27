import { createContext, useContext } from "react";

const MobileCtx = createContext();

export const useMobileProvider = () => {
    const context = useContext(MobileCtx);

    if (!context) throw new Error("must be used within provider Mobile Provider");

    return context;
};

export const MobileProvider = ({ pageProps, children }) => {
    const { isSSRMobile } = pageProps;

    return <MobileCtx.Provider value={{ isMobile: isSSRMobile }}>{children}</MobileCtx.Provider>;
};
