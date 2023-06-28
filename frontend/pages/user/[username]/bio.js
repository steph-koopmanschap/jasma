import { useRouter } from "next/router";
import UserWidgets from "@/widgets/user";
import { MobileDetectSSR } from "@/shared/model";

//The (public?) bio page of a user
export default function BioPage(props) {
    const router = useRouter();
    const { username } = router.query;

    return <UserWidgets.Bio username={username} />;
}

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
