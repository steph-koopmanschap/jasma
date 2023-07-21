import { InputField } from "@/shared/ui";
import "./SearchBlock.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useClickOutside } from "@/shared/model";

export const SearchInput = ({ onChange, onClick, onResultClick, searchResults }) => {
    const { isShow, setIsShow, ref } = useClickOutside(false);

    const handleKeyDown = () => {};

    return (
        <div
            className="search-block-container"
            ref={ref}
        >
            <div className={`search-container`}>
                <InputField
                    role="combobox"
                    maxLength={2048}
                    aria-haspopup="true"
                    aria-autocomplete="both"
                    aria-label="Search"
                    spellCheck="false"
                    placeholder="Search..."
                    aria-expanded={isShow && searchResults?.length}
                    onChange={onChange}
                    onClick={onClick}
                    onKeyDown={handleKeyDown}
                />
                <FontAwesomeIcon icon={faSearch} />
            </div>
            {isShow && searchResults?.length ? (
                <ResultList
                    results={searchResults}
                    onItemClick={onResultClick}
                />
            ) : null}
        </div>
    );
};

function ResultList({ results, onItemClick }) {
    return (
        <div>
            <ul>
                {results?.map((item) => (
                    <ResultItem
                        {...item}
                        onClick={onItemClick}
                        key={item.value}
                    />
                ))}
            </ul>
        </div>
    );
}

function ResultItem({ value = "", description = "", thumbnail = "", onClick }) {
    return (
        <li
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
        </li>
    );
}
