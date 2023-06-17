import React, { useRef } from "react";
import "./ChatElements.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { InputField } from "@/shared/ui";

export const ChatMessage = ({ message, sender, timestamp, isByUser = false }) => {
    return (
        <div className={`chat-message-container ${isByUser ? "bg-red-300" : ""}`}>
            <div className="chat-message-body">
                <h3>{sender}:</h3>
                <p>{message}</p>
            </div>
            <span className="chat-timestamp">{timestamp}</span>
        </div>
    );
};

export const SendMessage = ({ onSend }) => {
    const fieldRef = useRef(null);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault(), onSend(fieldRef.current?.value);
            }}
        >
            <div className="chat-input-container">
                <InputField
                    placeholder="Say hello"
                    ref={fieldRef}
                />
                <button type="submit">Send</button>
            </div>
        </form>
    );
};
