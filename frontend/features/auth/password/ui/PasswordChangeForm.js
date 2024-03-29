import React, { useState } from "react";
import { handlePassChange } from "../model/passwordActions";
//import { getCSRF_TOKEN } from "@/entities/auth";
import { useToast } from "@/shared/model";

export function ChangePasswordForm() {
    const { notifyToast } = useToast();

    const [passwordChangeState, setPasswordChangeState] = useState({
        newPasswordInput: "",
        secondPasswordInput: ""
    });

    const handleChangePassword = (e) => {
        const value = e.target.value;
        setPasswordChangeState({
            ...passwordChangeState,
            [e.target.name]: value
        });
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (passwordChangeState.newPasswordInput === passwordChangeState.secondPasswordInput) {
            const res = await handlePassChange(passwordChangeState.newPasswordInput);
            console.log(res);
            if (res.error) return notifyToast(res.message, true);
            notifyToast("Successfully changed!");
        } else {
            console.log("Passwords do not match.");
            notifyToast("Passwords do not match.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center my-14">
            <p className="my-2">Change your password:</p>
            <form
                className="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4"
                action="#"
                onSubmit={changePassword}
            >
                {/* <input
                    type="hidden"
                    name="XSRF-TOKEN"
                    value={getCSRF_TOKEN()}
                /> */}
                <div className="mb-2">
                    <label
                        className="labelDefault"
                        htmlFor="newPasswordInput"
                    >
                        New password
                    </label>
                    <input
                        type="password"
                        id="newPasswordInput"
                        placeholder="New password"
                        name="newPasswordInput"
                        value={passwordChangeState.newPasswordInput}
                        onChange={handleChangePassword}
                        required
                        minLength="3"
                        maxLength="16"
                    />
                </div>
                <div className="mb-2">
                    <label
                        className="labelDefault"
                        htmlFor="newPasswordInput"
                    >
                        Retype password
                    </label>
                    <input
                        type="password"
                        id="secondPasswordInput"
                        placeholder="Retype password"
                        name="secondPasswordInput"
                        value={passwordChangeState.secondPasswordInput}
                        onChange={handleChangePassword}
                        required
                        minLength="3"
                        maxLength="16"
                    />
                </div>
                <div className="flex flex-col items-center justify-between">
                    <input
                        className="formButtonDefault"
                        type="submit"
                        value="Change password"
                    />
                </div>
            </form>
        </div>
    );
}
