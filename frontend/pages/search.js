import { MobileDetectSSR } from "@/shared/model";
import SearchResults from "../widgets/search";

//The search results page
export default function Search() {
    return (
        <div>
            <SearchResults />
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
