import { MobileDetectSSR } from "@/shared/model";

function StreamList() {
    return <div>List</div>;
}

export default StreamList;

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
