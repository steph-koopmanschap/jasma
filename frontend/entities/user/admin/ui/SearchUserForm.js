import { useState } from "react";

export const SearchUserForm = ({ onSubmit }) => {
    const [searchUserBoxValue, setSearchUserBoxValue] = useState("");

    const handleChange = (e) => {
        setSearchUserBoxValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(searchUserBoxValue);
    };
    return (
        <>
            <form
                id="searchUserForm"
                className="flex flex-row items-left shadow-md rounded"
                action="#"
                onSubmit={handleSubmit}
            >
                <label
                    className="mr-2"
                    forhtml="searchUser"
                >
                    Find a user:{" "}
                </label>

                <input
                    className="pl-2.5"
                    id="searchUser"
                    type="text"
                    aria-label="Search user"
                    name="searchboxUser"
                    placeholder="Search user..."
                    value={searchUserBoxValue}
                    onChange={handleChange}
                />

                <input
                    className="formButtonDefault outline-white border ml-2.5"
                    type="submit"
                    value="Search"
                />
            </form>
        </>
    );
};
