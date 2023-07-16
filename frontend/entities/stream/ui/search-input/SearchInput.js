import { InputField } from "@/shared/ui";
import "./SearchInput.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export const SearchInput = ({ isResultsShowing, onChange, onClick, onKeyDown }) => {
    return (
        <div className={`search-container`}>
            <InputField
                role="combobox"
                maxLength={2048}
                aria-haspopup="true"
                aria-autocomplete="both"
                aria-label="Search"
                spellCheck="false"
                placeholder="Search..."
                aria-expanded={isResultsShowing}
                onChange={onChange}
                onClick={onClick}
                onKeyDown={onKeyDown}
            />
            <FontAwesomeIcon icon={faSearch} />
        </div>
    );
};
