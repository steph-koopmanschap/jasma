export const SearchFilter = ({ value, children, onClick, ...rest }) => {
    return (
        <button
            className="formButtonDefault m-2"
            value={value}
            aria-label={`Choose ${value} filter`}
            onClick={onClick}
            {...rest}
        >
            {children}
        </button>
    );
};
