import "./Misc.css";
export const SectionHeading = ({ children }) => {
    return <h2 className="stream-section-heading">{children}</h2>;
};

export const LoadError = ({ children }) => {
    return <h3 className="stream-load-error">{children}</h3>;
};

export const StreamActionBtn = ({ children, ...rest }) => {
    return (
        <button
            {...rest}
            className="stream-action-btn"
        >
            {children}
        </button>
    );
};
