import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export function SearchInput(props) {
    const router = useRouter();
    const [searchValue, setsearchValue] = useState(props.prevQuery);

    const search = (e) => {
        //prevent page from refreshing
        e.preventDefault();
        //Go to the search page with the search query
        //replace spaces with '+' characters first
        router.push(`/search/?q=${searchValue.trim().replace(/[ ]/g, "+")}`);
    };

    //Empty the search bar when it is clicked for first time
    const emptySearchBar = (e) => {
        if (searchValue === "Search...") {
            setsearchValue("");
        }
    };

    const handleChange = (e) => {
        setsearchValue(e.target.value);
    };

    return (
        <div>
            <form
                id="search"
                className="flex flex-row items-left justify-center shadow-md rounded mx-auto"
                action="#"
                onSubmit={search}
            >
                <input
                    className="pl-2.5"
                    type="search"
                    aria-label="JASMA search"
                    name="searchbox"
                    placeholder="Search..."
                    value={searchValue}
                    onClick={emptySearchBar}
                    onChange={handleChange}
                />

                <input
                    className="formButtonDefault outline-white border ml-2.5"
                    type="submit"
                    value="Search"
                />
            </form>
        </div>
    );

    // OLD CODE
    // return (
    //     <div>
    //         <form
    //             id="search"
    //             className="flex flex-row items-left justify-center shadow-md rounded mx-auto px-8 pt-6 pb-8 mb-4"
    //             action="#"
    //             onSubmit={search}>

    //             <input
    //                 className="my-2 p-1"
    //                 type="search"
    //                 aria-label="JASMA search"
    //                 name="searchbox"
    //                 value={searchValue}
    //                 onClick={emptySearchBar}
    //                 onChange={handleChange}
    //             />

    //             <input
    //                 className="formButtonDefault py-2 px-2 ml-2 outline-white border"
    //                 type="submit"
    //                 value="Search"
    //             />
    //         </form>
    //     </div>
    // );
}
