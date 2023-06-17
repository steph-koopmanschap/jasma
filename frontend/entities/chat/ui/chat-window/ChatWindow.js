import { useEffect, useRef } from "react";
import { ChatMessage } from "../chat-elements/Message";
import "./ChatWindow.css";

export const ChatWindow = ({ title, messageList, sendMessage }) => {
    const messagesRef = useRef(null);

    useEffect(() => {
        if (!messagesRef.current) return;
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [messageList.length]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h3 className="chat-title">{title}</h3>
            </div>
            <>
                {messageList ? (
                    <MessageList
                        list={messageList}
                        forwardRef={messagesRef}
                    />
                ) : (
                    <div></div>
                )}
            </>
            <>{sendMessage ? sendMessage : <div></div>}</>
        </div>
    );
};

const MessageList = ({ list, forwardRef }) => {
    return (
        <div
            className="chat-message-list"
            ref={forwardRef}
        >
            {list.map((item) => (
                <ChatMessage
                    key={item.timestamp}
                    {...item}
                />
            ))}
        </div>
    );
};
