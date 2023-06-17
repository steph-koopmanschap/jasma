import { ChatWindow, SendMessage } from "@/entities/chat";
import { useCallback, useRef, useState } from "react";

const TEST_DATA = [
    { sender: "John Doe1", timestamp: "19:36", message: "Hello everyone!" },
    { sender: "John Doe2", timestamp: "19:35", message: "Hello everyone!" },
    { sender: "John Doe3", timestamp: "19:31", message: "Hello everyone!" },
    { sender: "John Doe4", timestamp: "19:32", message: "Hello everyone!" }
];

const MSG_LIMIT = 50;
const SPLICE_FACTOR = 0.1;

export const StreamChat = () => {
    const messages = useRef(TEST_DATA); // More optimized than prev => [...prev, newMsg] pattern;

    const [update, forceUpdate] = useState(false);

    const handleSend = useCallback(
        (msg) => {
            // Sanitize first, most likely library will be used instead

            if (messages.current.length >= MSG_LIMIT) {
                messages.current.splice(0, Math.floor(messages.current.length * SPLICE_FACTOR));
            }
            messages.current.push({ message: msg, sender: "You", timestamp: Date.now() });

            forceUpdate(!update);
        },
        [update]
    );

    return (
        <div className="px-1.5">
            <ChatWindow
                title={"Live chat"}
                messageList={messages.current}
                sendMessage={<SendMessage onSend={handleSend} />}
            />
        </div>
    );
};
