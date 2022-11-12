import React, {useState} from 'react';

export default function SignUpForm() {
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
    const register = async (e) => {
        e.preventDefault();
    }

    return ( 
        <div className="flex flex-col items-center justify-center my-16">
            <h1 className="my-2">Create a new account</h1>
            <h3 className="my-2">Already registered?</h3>

            <form className="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4" action="#" onSubmit={register}>
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
                </div>
            </form>

        </div>
    );
}
