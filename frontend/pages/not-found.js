import { MobileDetectSSR } from "@/shared/model";
/* 
    When something is not found
*/

export default function NotFound() {
    return (
        <div>
            <h1>Error: Resource not found</h1>
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
