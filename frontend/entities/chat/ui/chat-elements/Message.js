import { InputField } from "@/shared/ui";
import { useRef } from "react";
import "./ChatElements.css";

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

/* Will be moved to features later */

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
