import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { toast } from "react-toastify";
import { toastSuccess } from "../utils/defaultToasts.js"
import api from "../clientAPI/api.js";

export default function SignUpForm() {
    //React Toast
    const toastId = useRef(null);
    const notify = (text) => (toastId.current = toastSuccess(text));
    const dismiss = () => toast.dismiss(toastId.current);

    //Values of all the input boxes
    const [registrationState, setRegistrationState] = useState({
        userNameInput: "",
        emailInput: "",
        passwordInput: "",
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setRegistrationState({
            ...registrationState,
            [e.target.name]: value
        });
    };

    //Registration action (OnSubmit form)
    const signup = async (e) => {
        e.preventDefault();
        const res = await api.register(registrationState.userNameInput, registrationState.emailInput, registrationState.passwordInput);
        if (res.success === true ) {
            console.log(res.message);
            return notify(res.message);
        }
        else if (res?.errors) {
            console.log(res.errors[0].msg);
            return notify(res.errors[0].msg);
        }
        else {
            console.log(res.message);
            return notify(res.message);
        }
    }

    return ( 
        <div className="flex flex-col items-center justify-center my-16">
            <h1 className="my-2">Create a new account</h1>
            <h3 className="my-2">Already registered? <Link className='hover:text-sky-500' href="/login">Login</Link></h3>

            <form className="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4" action="#" onSubmit={signup}>
                <div className="mb-6">
                    <label className='labelDefault' htmlFor="userNameInput">Username</label>
                    <input 
                        type="text"
                        id="userNameInput"
                        placeholder="Username"
                        name="userNameInput"
                        value={registrationState.userNameInput}
                        onChange={handleChange}
                        required 
                        minLength="3"
                        maxLength="25"
                        pattern="[a-zA-Z0-9]+"
                    />
                </div>
                <div className="mb-6">
                    <label className='labelDefault' htmlFor="emailInput">Email</label>
                    <input 
                        type="email"
                        id="emailInput"
                        placeholder="E-mail"
                        name="emailInput"
                        value={registrationState.emailInput}
                        onChange={handleChange}
                        required 
                        minLength="6"
                        maxLength="50"
                    />
                </div>  
                <div className="mb-6">
                    <label className='labelDefault' htmlFor="passwordInput">Password</label>
                    <input 
                        type="password"
                        id="passwordInput"
                        placeholder="Password"
                        name="passwordInput"
                        value={registrationState.passwordInput}
                        onChange={handleChange}
                        required 
                        minLength="3"
                        maxLength="16"
                    /> 
                </div>  
                <div className="flex flex-col items-center justify-between">
                
                <input className="formButtonDefault"
                    type="submit" 
                    value="Sign up" 
                />  
                <p className='pt-4 text-xs'>
                    By clicking Sign Up, you agree to our <Link className='hover:text-sky-500' href="/legal/terms-of-service">Terms of Serice.</Link>
                </p>
                </div>
            </form>

        </div>
    );
}
