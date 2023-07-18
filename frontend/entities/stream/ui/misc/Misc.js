import "./Misc.css";
export const SectionHeading = ({ children }) => {
    return <h2 className="stream-section-heading">{children}</h2>;
};

export const LoadError = ({ children }) => {
    return <h3 className="stream-load-error">{children}</h3>;
};
