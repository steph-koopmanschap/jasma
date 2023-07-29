import StreamWidget from "@/widgets/stream";
import { useRouter } from "next/router";
import "./StreamPage.css";
import { MobileDetectSSR } from "@/shared/model";

const StreamPage = (props) => {
    const router = useRouter();

    return (
        <div className="stream-page-main-container">
            <StreamWidget stream_key={router.query.key} />
        </div>
    );
};

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};

export default StreamPage;
