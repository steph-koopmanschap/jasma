import React, {useState} from 'react';
import Link from 'next/link';

export default function LoginForm() {
    // Values of the email and password input boxes
    const [loginFormState, setLoginFormState] = useState({
        emailInput: "",
        passwordInput: ""
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setLoginFormState({
            ...loginFormState,
            [e.target.name]: value
        });
    };

    // Login authorization code
    const authorize = async (e) => {
        e.preventDefault();
    
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
            
                <div className="flex flex-col items-center justify-between">
                    <button className="formButtonDefault" type="submit" value="Log in">
                        Log In
                    </button>
                </div>
            </form>

        </div>
    );
}
