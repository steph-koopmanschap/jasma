import { MobileDetectSSR } from "@/shared/model";
import StreamListWidgets from "@/widgets/stream-list";
import "./LivePage.css";
import StreamSearchWidgets from "@/widgets/stream-search";

function Live() {
    return (
        <div className="stream-list-page-lg">
            <div className="stream-list-content">
                <StreamSearchWidgets.StreamSearch />
                <StreamListWidgets.CategoriesList />
                <StreamListWidgets.TopChannelsList />
                <StreamListWidgets.LiveList />
            </div>
        </div>
    );
}

export default Live;

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
