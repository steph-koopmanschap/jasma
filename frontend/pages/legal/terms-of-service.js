import { MobileDetectSSR } from "@/shared/model";

export default function TermsOfService() {
    return (
        <div>
            <h1 className="">Terms of Service</h1>
            <h2>Nothing here yet...</h2>
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
