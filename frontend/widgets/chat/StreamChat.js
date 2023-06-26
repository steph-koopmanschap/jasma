import { ChatWindow, SendMessage } from "@/entities/chat";
import { useRef, useState } from "react";
import "./Chat.css";

const TEST_DATA = [
    { sender: "John Doe1", timestamp: Date.now(), message: "Hello everyone!" },
    { sender: "John Doe2", timestamp: Date.now(), message: "Hello everyone!" },
    { sender: "John Doe3", timestamp: Date.now(), message: "Hello everyone!" },
    { sender: "John Doe4", timestamp: Date.now(), message: "Hello everyone!" }
];

const MSG_LIMIT = 50;
const SPLICE_FACTOR = 0.1;

export const StreamChat = () => {
    const messages = useRef(TEST_DATA); // More optimized than prev => [...prev, newMsg] pattern;

    const [update, forceUpdate] = useState(false);

    const handleSend = (msg) => {
        // Sanitize first, most likely library will be used instead
        if (!msg) return;

        if (messages.current.length >= MSG_LIMIT) {
            messages.current.splice(0, Math.floor(messages.current.length * SPLICE_FACTOR));
        }
        messages.current.push({ message: msg, sender: "You", timestamp: Date.now() });

        forceUpdate(!update);
    };

    return (
        <div className="stream-chat-container">
            <ChatWindow
                title={"Live chat"}
                messageList={messages.current}
                sendMessage={<SendMessage onSend={handleSend} />}
            />
        </div>
    );
};
