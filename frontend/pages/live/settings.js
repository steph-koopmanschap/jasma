import { useCheckAuthClientSide } from "@/features/auth/admin";
import { MobileDetectSSR, useMobileProvider } from "@/shared/model";
import StreamSettings from "@/widgets/stream-settings";
import { useRouter } from "next/router";

/* For now users can adjust stream setting only on a desktop version */

const Settings = () => {
    const { isMobile } = useMobileProvider();
    const router = useRouter();

    if (isMobile) {
        router.replace("/");
        return null;
    }

    return (
        <div>
            <StreamSettings />
        </div>
    );
};

export default Settings;

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
