import StreamWidget from "@/widgets/stream";
import { useRouter } from "next/router";
import "./StreamPage.css";
import React from "react";
import ChatWidgets from "@/widgets/chat";
import { useMobileProvider } from "@/shared/model";

const StreamPage = (props) => {
    const router = useRouter();
    const { isMobile } = useMobileProvider();

    return (
        <div>
            <StreamWidget />
        </div>
    );
};

export const getServerSideProps = async () => {
    return {
        props: {}
    };
};

export default StreamPage;
