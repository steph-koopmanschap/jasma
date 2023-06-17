import StreamWidget from "@/widgets/stream";
import { useRouter } from "next/router";
import "./StreamPage.css";
import React from "react";
import ChatWidgets from "@/widgets/chat";

const StreamPage = (props) => {
    const router = useRouter();

    return (
        <div>
            <StreamWidget stream_key={router.query.key} />
            <ChatWidgets.StreamChat />
        </div>
    );
};

export const getServerSideProps = async () => {
    return {
        props: {}
    };
};

export default StreamPage;
