import { useCheckAuthClientSide } from "@/features/auth/admin";
import { useMobileProvider } from "@/shared/model";
import StreamSettings from "@/widgets/stream-settings";
import { useRouter } from "next/router";
import { useEffect } from "react";

/* For now users can adjust stream setting only on a desktop version */

const Settings = () => {
    const { isMobile } = useMobileProvider();
    const router = useRouter();

    useEffect(() => {
        if (isMobile) {
            router.replace("/");
            return;
        }
        // useCheckAuthClientSide("/login");
    }, [isMobile]);

    return (
        <div>
            <StreamSettings />
        </div>
    );
};

export default Settings;
