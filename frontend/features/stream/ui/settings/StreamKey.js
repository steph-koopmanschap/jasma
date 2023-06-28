import { CoreBtnDef, InputField } from "@/shared/ui";
import { handleGenerateStreamKey } from "../../model/actions";
import { useState } from "react";
import "./Settings.css";
import { SettingsBlock } from "@/entities/stream";
import { copyToClipboard } from "@/shared/utils";
import { useToast } from "@/shared/model";

export const StreamKey = ({ userID }) => {
    return (
        <SettingsBlock
            title="Stream Key"
            action={<KeyField userID={userID} />}
            description={<Description />}
        />
    );
};

function GenerateKey({ onGenerate, userID }) {
    const handleGenerate = async () => {
        // make a call to backend, get generate key. On backend associate key with the user.
        const key = await handleGenerateStreamKey(userID);
        onGenerate(key);
    };

    return (
        <CoreBtnDef
            className={"px-2 py-1.5"}
            text={"Generate"}
            onClick={handleGenerate}
        />
    );
}

function KeyField({ userID }) {
    const [key, setKey] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const { notifyToast } = useToast();
    const decode = () => {
        if (!key) return "";

        return isVisible ? "••••••••••••••••" : key;
    };

    const handleCopy = () => {
        copyToClipboard(key);
        notifyToast("Key copied");
    };

    return (
        <div className="stream-key-field">
            <div className="stream-key-field-wrapper">
                <InputField value={decode(false)} />
                {key ? (
                    <CoreBtnDef
                        className={"px-2 py-1.5"}
                        onClick={handleCopy}
                        text={"Copy"}
                    />
                ) : (
                    <GenerateKey
                        userID={userID}
                        onGenerate={(key) => setKey(key)}
                    />
                )}
            </div>
            <button
                className="key-show-btn"
                onClick={() => setIsVisible(!isVisible)}
            >
                {isVisible ? "hide" : "show"}
            </button>
        </div>
    );
}

function Description() {
    return (
        <div className="stream-key-description">
            <p>
                To start streaming through <b>OBS</b> specify server{" "}
                <span className="font-bold text-red-500">rtmp://localhost:1935/live</span> and add your{" "}
                <b>stream key</b>
            </p>
        </div>
    );
}
