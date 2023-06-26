export const CoreBtnDef = ({ text, className, ...rest }) => {
    return (
        <button
            {...rest}
            className={`core-btn-default ${className}`}
        >
            {text}
        </button>
    );
};
