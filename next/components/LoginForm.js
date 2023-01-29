import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../clientAPI/api.js";

export default function LoginForm() {
    const router = useRouter();
    // Values of the email and password input boxes
    const [loginFormState, setLoginFormState] = useState({
        emailInput: "",
        passwordInput: ""
    });

    const [message, setMessage] = useState();

    //Login authorization code
    async function handleSubmit(e) {
        e.preventDefault();
        const { emailInput, passwordInput } = loginFormState;
        const response = await api.login(emailInput, passwordInput);
        console.log("response", response);
        //Move user to dashboard upon succesfull login
        if (response.success) {
            //Store the userID and username of the logged in user into the session storage.
            window.sessionStorage.setItem('loggedInUserID', response.user.user_id);
            window.sessionStorage.setItem('loggedInUsername', response.user.username);
            setMessage(null);
            router.push("/dashboard");
        //Failed login. Show error message.
        } else {
            setMessage(response.message);
        }
    }

    // OLD LOGIN CODE DEPRECATED
    // Login authorization code
    // async function handleSubmit(e) {
    //     e.preventDefault();
    //     await refetch();
    //     //mutate(loginFormState.emailInput, loginFormState.passwordInput)
    //     console.log("status:", status);
    //     console.log("isSuccess:", isSuccess);

    //      //Move user to dashboard upon succesfull login
    //     if (data?.success) {
    //         setMessage(null);
    //         router.push("/dashboard");
    //     }
    //     //Failed login. Show error message.
    //     else {
    //         setMessage(response.message);
    //     }
    // }

    const handleChange = (e) => {
        const value = e.target.value;
        setLoginFormState({
            ...loginFormState,
            [e.target.name]: value
        });
    };

    return (
        <div className="flex flex-col items-center justify-center my-16">
            <h1 className="my-4">Login</h1>
            <h3 className="my-2">
                Not yet registered?{" "}
                <Link
                    className="hover:text-sky-500"
                    href="/register"
                >
                    Register
                </Link>
            </h3>

            <form
                className="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4"
                action="#"
                onSubmit={handleSubmit}
            >
                <div className="mb-4">
                    <label
                        className="labelDefault"
                        htmlFor="emailInput"
                    >
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
                    <label
                        className="labelDefault"
                        htmlFor="passwordInput"
                    >
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

                {message ? <p className="mb-2 text-red-500">{message}</p> : null}

                <div className="flex flex-col items-center justify-between">
                    <button
                        className="formButtonDefault"
                        type="submit"
                        value="Log in"
                    >
                        Log In
                    </button>
                </div>

                <a  
                    className="flex flex-col items-center mt-4 hover:text-sky-500"
                    href="#"
                >
                    Forgot password?
                </a>
            </form>
        </div>
    );
}
