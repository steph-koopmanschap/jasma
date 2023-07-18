import { MobileDetectSSR } from "@/shared/model";
import StreamListWidgets from "@/widgets/stream-list";
import "./StreamList.css";

function StreamList() {
    return (
        <div className="stream-list-page-lg">
            <div className="stream-list-content">
                <StreamListWidgets.Header />
                <StreamListWidgets.RecommendedList />
                <StreamListWidgets.TopChannelsList />
                <StreamListWidgets.LiveList />
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
