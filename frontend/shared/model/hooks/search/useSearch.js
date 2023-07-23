import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "./useDebounce";

/**
 *
 * @param {Function} onGoTo fires when you hit enter or click on a search result
 * @param {Function} onSearch fires when typing a query
 * @param {Number} delay debounce in ms. Default 200
 * @param {Boolean} isArrowActive can use keyboard arrows to navigate results or not. Default true
 * @param {Boolean} isMobile is mobile version of the app. Default false
 * @param {Boolean} isAutocompleteInline activate autocompletion when typing or not. Don't work on mobile. Default true
 * @param {String} queryPrefix prefix that is added when saving users queries to localStorage. Default empty string
 * @param {Number} maxCachedQueries maximum queries to store in localStorage. Default 15
 * @returns
 */

export function useSearch({
    onGoTo,
    onSearch,
    delay = 200,
    isArrowsActive = true,
    isAutocompleteInline = true,
    isMobile = false,
    queryPrefix = "",
    maxCachedQueries = 15
}) {
    const [results, setResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [autocomplete, setAutocomplete] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const debounced = useDebounce(searchTerm, delay);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);

    const handleInputClick = useCallback((value) => {
        _handleSuggestion(value);
    }, []);

    // saving only on submit
    const handleGoTo = useCallback((query = "") => {
        if (!query) return;
        _cacheQuery(query);
        onGoTo(query);
        setSearchTerm("");
    }, []);

    const handleArrowPress = useCallback((e) => {
        if (!resultsRef.current) return;
        const resNodes = Array.from(resultsRef.current.children);
        if (!resNodes.length) return;
        let activeInd = resNodes.findIndex((item) => item === document.activeElement);

        if (e.code === "ArrowDown") {
            e.preventDefault();
            activeInd++;
        }
        if (e.code === "ArrowUp") {
            e.preventDefault();

            if (activeInd < 0) activeInd = resNodes.length;
            activeInd--;
        }
        resNodes[activeInd] ? resNodes[activeInd].focus() : inputRef.current?.focus();
    }, []);

    const handleChange = useCallback((e) => {
        setAutocomplete("");
        setSearchTerm(e.target.value);
    }, []);

    const _retrieveQueries = useCallback(() => {
        const queries = window.localStorage.getItem(queryPrefix + "user_queries");
        return queries ? JSON.parse(queries) : [];
    }, []);

    const _selectText = useCallback((searchQuery) => {
        if (!isAutocompleteInline) return;
        const node = inputRef.current;
        if (!node) return;
        node.focus();
        node.setSelectionRange(searchQuery.length, -1);
    }, []);

    const _cacheQuery = useCallback((query) => {
        let queries = _retrieveQueries();
        if (queries.find((q) => q === query)) return;
        queries = [query, ...queries];
        if (queries.length > maxCachedQueries) queries.pop();
        window.localStorage.setItem(queryPrefix + "user_queries", JSON.stringify(queries));
    }, []);

    // suggests only from cached queries
    const _handleInlineAutocomplete = useCallback(
        (searchQuery) => {
            const queries = _retrieveQueries();
            const query = queries.find((str) => {
                let temp = str.slice(0, searchTerm.length);
                return temp.toLowerCase() === searchQuery.toLowerCase();
            });
            if (!query) return;
            const sliced = query.slice(searchQuery.length) || "";
            if (searchQuery.length === 0 || searchQuery.length > 1) return;
            setAutocomplete(sliced);
        },
        [debounced]
    );

    const handleDeleteCached = useCallback(
        (query) => {
            console.log(query);
            const queries = _retrieveQueries();
            const filtered = queries.filter((item) => item !== query);
            window.localStorage.setItem(queryPrefix + "user_queries", JSON.stringify(filtered));

            setSuggestions((prev) => prev.filter((sugg) => sugg !== query));
        },
        [suggestions]
    );

    const _handleSuggestion = useCallback(
        (searchQuery) => {
            const queries = _retrieveQueries();
            const matches = queries.filter((str) => {
                let temp = str.slice(0, searchQuery.length);
                return temp.toLowerCase() === searchQuery.toLowerCase();
            });
            setSuggestions(matches.slice(0, 5));
        },
        [debounced]
    );

    const _handleSearch = useCallback(async () => {
        try {
            const res = await onSearch(searchTerm);

            setResults([...res]);
        } catch (error) {}
    }, [searchTerm]);

    useEffect(() => {
        if (!isArrowsActive) return;
        document.body.addEventListener("keydown", handleArrowPress);

        return () => {
            document.body.removeEventListener("keydown", handleArrowPress);
        };
    }, []);

    useEffect(() => {
        _handleSearch();
        _handleSuggestion(searchTerm);
    }, [debounced]);

    useEffect(() => {
        if (!debounced || !isAutocompleteInline || isMobile) return;
        _handleInlineAutocomplete(searchTerm);
    }, [_handleInlineAutocomplete]);

    useEffect(() => {
        _selectText(searchTerm);
    }, [autocomplete]);

    return {
        handlers: {
            handleChange,
            handleGoTo,
            handleInputClick,
            handleDeleteCached
        },
        results,
        searchTerm: `${searchTerm}${autocomplete}`,
        inputRef,
        resultsRef,
        suggestions
    };
}
