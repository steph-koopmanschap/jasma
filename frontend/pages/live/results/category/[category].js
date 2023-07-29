import React from "react";
import "../../LivePage.css";
import { MobileDetectSSR } from "@/shared/model";
import { useRouter } from "next/router";
import StreamListWidgets from "@/widgets/stream-list";
import StreamSearchWidgets from "@/widgets/stream-search";

const CategorySearchResults = () => {
    const router = useRouter();
    return (
        <div className="stream-list-page-lg">
            <div className="stream-list-content">
                <StreamSearchWidgets.StreamSearch />
                <StreamListWidgets.LiveList category={router.query.category} />
            </div>
        </div>
    );
};

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};

export default CategorySearchResults;
