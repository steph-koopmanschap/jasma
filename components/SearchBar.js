
import React, {useState} from 'react';

export default function SearchBar() {

    const [searchValue, setsearchValue] = useState("Search...");

    const search = (e) => {
        //prevent page from refreshing
        e.preventDefault();
        console.log(searchValue);
    }

    const handleChange = (e) => {
        setsearchValue(e.target.value);
    }

    return (
        <div>
            <form 
                id="search" 
                className="flex flex-row items-left justify-center shadow-md rounded mx-auto px-8 pt-6 pb-8 mb-4" 
                action="#" 
                onSubmit={search}>
                
                <input 
                    className="my-2 p-1"
                    type="search"
                    name="searchbox"
                    value={searchValue}
                    onChange={handleChange} 
                />
                
                <input 
                    className="formButtonDefault py-2 px-2 ml-2 outline-white border"
                    type="submit"
                    value="Search" 
                />
            </form>
        </div>
    );
}
