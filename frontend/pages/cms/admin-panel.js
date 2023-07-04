import { useCheckAuthClientSide } from "@/features/auth/admin";
import { MobileDetectSSR } from "@/shared/model";
import UserWidgets from "@/widgets/user/index.js";

/*
    This is a page for administrators to manage moderators / account roles.
*/

export default function AdminPanel() {
    useCheckAuthClientSide("/cms/cms-login");

    return (
        <div>
            <UserWidgets.AdminPanel />
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
