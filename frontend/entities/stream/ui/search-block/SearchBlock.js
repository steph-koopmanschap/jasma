import { InputField } from "@/shared/ui";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SearchBlock.css";
import { StreamActionBtn } from "../misc/Misc";

export const SearchInput = ({ isResultsOpen, onChange, onSubmit, onClick, forwardedRef, searchTerm }) => {
    const handleKeyDown = (e) => {
        if (e.code === "Enter") onSubmit(e.target.value);
    };

    const handleClick = (e) => {
        e.preventDefault();
        onClick(e.target.value);
    };

    return (
        <div className={`search-container ${isResultsOpen ? "search-container-open" : ""} `}>
            <InputField
                ref={forwardedRef}
                value={searchTerm}
                role="combobox"
                maxLength={2048}
                aria-haspopup="true"
                aria-autocomplete="both"
                aria-label="Search"
                spellCheck="false"
                placeholder="Search..."
                aria-expanded={isResultsOpen}
                onChange={onChange}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
            />
            <FontAwesomeIcon icon={faSearch} />
        </div>
    );
};

export const ResultList = ({ results, onItemClick, forwardedRef, suggestions, onDeleteCache }) => {
    const handleKeyDown = (code, value) => {
        if (code === "Enter") onItemClick(value);
    };
    console.log(suggestions, results);
    return (
        <div className="results-list-container">
            <ul ref={forwardedRef}>
                {suggestions?.map((item) => (
                    <ResultItem
                        value={item}
                        onClick={() => onItemClick(item.value)}
                        onKeyDown={(e) => handleKeyDown(e.code, item.value)}
                        description="last search"
                        isFromCache={true}
                        onDeleteCache={onDeleteCache}
                        key={item}
                    />
                ))}
                {results?.map((item) => (
                    <ResultItem
                        {...item}
                        onClick={() => onItemClick(item.value)}
                        onKeyDown={(e) => handleKeyDown(e.code, item.value)}
                        key={item.value}
                    />
                ))}
            </ul>
        </div>
    );
};

function ResultItem({
    value = "",
    description = "",
    thumbnail = "",
    onClick,
    onDeleteCache,
    isFromCache = false,
    ...rest
}) {
    const handleClear = (e) => {
        e.stopPropagation();
        onDeleteCache && onDeleteCache(value);
    };

    return (
        <li
            {...rest}
            tabIndex={0}
            onClick={onClick}
            className="result-item-container"
        >
            <div className="result-icon-container">
                <FontAwesomeIcon icon={faSearch} />
            </div>
            <div className="result-body-container">
                <h3>{value}</h3>
                {description ? <p>{description}</p> : null}
            </div>
            <div className="result-action-container">
                {isFromCache ? <StreamActionBtn onClick={handleClear}>clear</StreamActionBtn> : null}
            </div>
        </li>
    );
}
