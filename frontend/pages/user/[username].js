import { useRouter } from "next/router";
import UserWidgets from "@/widgets/user";
import HeaderMain from "@/widgets/header";
import { MobileDetectSSR } from "@/shared/model";

//The (public?) profile page of a user
export default function ProfilePage(props) {
    const router = useRouter();
    const { username } = router.query;

    return (
        <div>
            <HeaderMain />
            <UserWidgets.UserBox />
            <UserWidgets.Profile username={username} />
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
