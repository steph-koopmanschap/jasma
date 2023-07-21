import { MobileDetectSSR } from "@/shared/model";
import StreamListWidgets from "@/widgets/stream-list";
import { useState } from "react";
import "./StreamList.css";
import { useRouter } from "next/router";

function StreamList() {
    const router = useRouter();
    const [category, setCategory] = useState("");
    const handleOpenStream = (stream_key) => {
        router.push(`/live/stream/${stream_key}`);
    };
    const handleChooseCategory = (cat) => {
        setCategory(cat);
    };
    return (
        <div className="stream-list-page-lg">
            <div className="stream-list-content">
                <StreamListWidgets.Header />
                <StreamListWidgets.CategoriesList onClickCategory={handleChooseCategory} />
                <StreamListWidgets.TopChannelsList />
                <StreamListWidgets.LiveList
                    onClick={handleOpenStream}
                    category={category}
                />
            </div>
        </div>
    );
}

export default StreamList;

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
