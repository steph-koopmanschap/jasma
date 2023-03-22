import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from 'react-query';
import api from "../../clientAPI/api.js";

/*
    This is a page for administrators to manage moderators / account roles.
*/

export default function AdminPanel() {

    const router = useRouter();

    const [roleFilter, setRoleFilter] = useState("mod");
    const [searchUserBoxValue, setSearchUserBoxValue] = useState("");
    //Use useRef instead?
    //Contains the the userID related to the username in the searchUserBoxValue
    //const [searchedUser, setSearchedUser] = useState("");
    const searchedUser = useRef("");
    
    useEffect( () => {
        //Check if user is already logged in. If yes, redirect them to admin portal.
        //Because useEffect() itself can not be itself async, a self-executing async function is placed inside useEffect
        (async () => {
            const isLoggedIn = await api.checkAuthClientSide(); 
            // Replace above line of code with below 2 lines of code when page is done.
            //const res = await api.checkAuthUserRole();
            //const isLoggedIn !== res.admin;
            if (isLoggedIn === false) {
                router.replace('/cms/cms-login');
            }
        })();
    }, []);

    const { isSuccess, isLoading, isError, data, error, refetch } = useQuery([`UserIDS_${roleFilter}`], 
    async () => {return await api.getUserIDsByRole(roleFilter)},
    {   
        enabled: true,
        refetchOnWindowFocus: false,
        //onSuccess: (result) => {setReports(result.reports)} //Load the response data into state upon succesful fetch
    }
    );

    if (isLoading) {
        return (<h1>Loading...</h1>);
    }

    if (isError) {
        return (<h1>{error}</h1>);
    }

    if (data.success === false) {
        return (<h1>{data.message}</h1>)
    }

    const handleChange = (e) => {
        setSearchUserBoxValue(e.target.value);
    }

    const searchUser = async (e) => {
        e.preventDefault();
        //const username = document.getElementById("searchUser").value;
        const username = searchUserBoxValue;
        console.log("username:", username)
        const res = await api.getUserID(username);
        searchedUser.current = res.user_id;
        //setSearchedUser(res.user_id);
        //console.log("searchedUser", searchedUser); 
        console.log("searchedUser.current", searchedUser.current);    
    }

    const filterRoles = () => {
        const newFilter = document.getElementById("roleFilterBtn").value;
        console.log("newFilter", newFilter);
        setRoleFilter(newFilter);
        refetch;
    }

    const changeRole = async (e) => {
        e.preventDefault();
        let res = "";
        //if (searchedUser !== "" && searchedUser) {
        if (searchedUser.current !== "" && searchedUser.current) {
            const role = document.getElementById(`changeRoleSelect_search`).value;
            console.log("role", role);
            //res = await api.changeUserRole(searchedUser, role);
            res = await api.changeUserRole(searchedUser.current, role);
        }
        else {
            const user_id = e.target.id.replace('form_', '');
            const role = document.getElementById(`changeRoleSelect_${user_id}`).value;
            res = await api.changeUserRole(user_id, role);
        }
    }

    return (
    <div className='mt-4'>
        <h1 className="text-xl text-center mt-4">JASMA ADMINISTRATION PANEL</h1>

        <form 
            id="searchUserForm" 
            className="flex flex-row items-left shadow-md rounded" 
            action="#" 
            onSubmit={searchUser}>

            <label className='mr-2' forhtml="searchUser">Find a user: </label>
        
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

        <p className=''>Change role of {searchUserBoxValue} to:</p>

        <form className="mb-6" id={`form_search`} action="#" onSubmit={changeRole}>
            <select name="role" id={`changeRoleSelect_search`}>
                <option value="admin">admin</option>
                <option value="mod">mod</option>
                <option value="normal">normal</option>
            </select>
            <input
                className="formButtonDefault outline-white border my-1 ml-2"
                type="submit"
                value="Save"
            />
        </form>

        
        <select name="roleFilter" id="roleFilterBtn" onChange={filterRoles}>
            <option value="">--Filter by role--</option>
            <option value="admin">admin</option>
            <option value="mod">mod</option>
            <option value="normal">normal</option>
        </select>

        <h2 className='mt-2 mb-2'>Current {roleFilter}s</h2>

        <div className="flex flex-col">
            {data.users.map((user) => (
                <div className='mb-2' key={user.user_id}>
                    <p className='mb-2'>
                        Username:
                        <Link
                            className="font-bold"
                            href={`/user/${user.username}`}
                        >
                            {user.username}
                        </Link>
                    </p>

                    <form className="" id={`form_${user.user_id}`} action="#" onSubmit={changeRole}>
                        <select name="role" id={`changeRoleSelect_${user.user_id}`}>
                            <option value="">--Change role--</option>
                            <option value="admin">admin</option>
                            <option value="mod">mod</option>
                            <option value="normal">normal</option>
                        </select>
                        <input
                            className="formButtonDefault outline-white border my-1 ml-2"
                            type="submit"
                            value="Save"
                        />
                    </form>
                </div>
            ))}
        </div>

    </div>
    );
}
