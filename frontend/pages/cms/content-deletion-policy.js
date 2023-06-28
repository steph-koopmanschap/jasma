import { useCheckAuthClientSide } from "@/features/auth/admin/index.js";
import { MobileDetectSSR } from "@/shared/model";

export default function CMS_Login() {
    useCheckAuthClientSide("/cms/cms-login");

    return (
        <div>
            <h1 className="text-xl">JASMA CONTENT DELETION POLICY</h1>
            <p>Nothing here yet...</p>
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
