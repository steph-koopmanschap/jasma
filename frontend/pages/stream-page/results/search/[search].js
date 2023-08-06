import { MobileDetectSSR } from "@/shared/model";
import StreamSearchWidgets from "@/widgets/stream-search";
import "../../LivePage.css";
const GeneralSearchResults = () => {
    return (
        <div className="stream-list-page-lg">
            <div className="stream-list-content">
                <StreamSearchWidgets.StreamSearch />
                <StreamSearchWidgets.StreamSearchResults />
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

export default GeneralSearchResults;
