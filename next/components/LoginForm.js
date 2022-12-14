import React, {useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {login} from '../clientAPI/api.js';
import { useQuery } from "react-query";

export default function LoginForm() {

    const router = useRouter();
    // Values of the email and password input boxes
    const [loginFormState, setLoginFormState] = useState({
        emailInput: "",
        passwordInput: ""
    });

    const { status, isLoading, isError, data, error, refetch } = useQuery(["userCredentials"], 
        async () => {return await login(loginFormState.emailInput, loginFormState.passwordInput)},
        {enabled: false} // disable this query from automatically running
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setLoginFormState({
            ...loginFormState,
            [e.target.name]: value
        });
    };

    // Login authorization code
    const authorize = (e) => {
        e.preventDefault();
        refetch(); //Send a login request
        //Move user to dashboard on succesful login
        if (data?.user && data?.success)
        {
            router.push(`/dashboard`);
        }

        if (isError) {
            console.log(error);
        }
    }

    return ( 
        <div className="flex flex-col items-center justify-center my-16">
            <h1 className="my-4">Login</h1>
            <h3 className="my-2">Not yet registered? <Link className='hover:text-sky-500' href="/register">Register</Link></h3>

            <form className="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4" action="#" onSubmit={authorize}>
                <div className="mb-4">
                    <label className='labelDefault' htmlFor="emailInput">
                        email
                    </label>
                    <input 
                        type="email"
                        placeholder="Email"
                        name="emailInput"
                        value={loginFormState.emailInput} 
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="mb-6">
                    <label className='labelDefault' htmlFor="passwordInput">
                        Password
                    </label>
                    <input 
                        type="password"
                        placeholder="Password"
                        name="passwordInput"
                        value={loginFormState.passwordInput}
                        onChange={handleChange}
                        required 
                    /> 
                </div>


                {data?.success ? null : 
                (<p 
                    className='mb-2 text-red-500'
                >
                    {data?.message}</p>)
                }
{/* 
                {isError ? 
                (<p 
                    className='mb-2 text-red-500'
                >
                    {error}</p>) : null
                }    */}
            
                <div className="flex flex-col items-center justify-between">
                    <button 
                        className="formButtonDefault" 
                        type="submit" 
                        value="Log in"
                    >
                        Log In
                    </button>
                </div>
            </form>

        </div>
    );
}
