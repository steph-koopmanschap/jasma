import { SearchInput, ResultList } from "@/entities/stream";
import { useClickOutside } from "@/shared/model";
import { useSearch } from "@/shared/model/hooks/search/useSearch";
import "./Search.css";

export const Search = ({ onGoTo }) => {
    const { ref, isShow, setIsShow } = useClickOutside(false);

    const handleSearch = async (searchTerm) => {
        console.log(searchTerm);
        return [{ value: "Test", description: "test" }];
    };

    const { searchTerm, prevQueries, inputRef, results, resultsRef, handlers } = useSearch({
        onGoTo,
        onSearch: handleSearch,
        queryPrefix: "stream-queries"
    });

    return (
        <div
            className="search-block-container"
            ref={ref}
            tabIndex={0}
            role="combobox"
            onClick={() => setIsShow(true)}
        >
            <SearchInput
                onChange={handlers.handleChange}
                onClick={handlers.handleInputClick}
                onSubmit={handlers.handleGoTo}
                searchTerm={searchTerm}
                forwardedRef={inputRef}
                isResultsOpen={results.length && isShow}
            />
            {isShow && results.length ? (
                <ResultList
                    onDeleteCache={handlers.handleDeleteCached}
                    forwardedRef={resultsRef}
                    prevQueries={prevQueries}
                    results={results}
                    onItemClick={handlers.handleGoTo}
                />
            ) : null}
        </div>
    );
};
