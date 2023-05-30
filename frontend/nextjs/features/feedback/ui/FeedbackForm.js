import React, { useState } from "react";
import Link from "next/link";

export function FeedbackForm() {
    // Values of the email and password input boxes
    const [feedbackFormState, setFeedbackFormState] = useState({
        rating: 1,
        review: ""
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setFeedbackFormState({
            ...feedbackFormState,
            [e.target.name]: value
        });
    };

    // Submit Feedback
    const submitForm = async (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex flex-col items-center justify-center my-16">
            <h3 className="my-2">What do you think of JASMA</h3>

            <form
                className="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4"
                action="#"
                onSubmit={submitForm}
            >
                <div className="mb-4">
                    <label
                        className="labelDefault"
                        htmlFor="rating"
                    >
                        rating
                    </label>
                    <input
                        type="number"
                        placeholder=""
                        name="rating"
                        value={feedbackFormState.rating}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="labelDefault"
                        htmlFor="review"
                    >
                        Password
                    </label>
                    <textarea
                        type="textarea"
                        placeholder="Your review..."
                        name="review"
                        value={feedbackFormState.review}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex flex-col items-center justify-between">
                    <button
                        className="formButtonDefault"
                        type="submit"
                        value="Submit Review"
                    >
                        Submit Review
                    </button>
                </div>
            </form>
        </div>
    );
}
