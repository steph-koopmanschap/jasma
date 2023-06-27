import { MobileDetectSSR, useRequireAuth } from "@/shared/model";
import UserWidgets from "@/widgets/user";

//The Settings profile
export default function Settings(props) {
    //Redirect user to the dashboard if they are not logged in.
    useRequireAuth("/dashboard");

    return (
        <div className="flex flex-col items-center">
            <UserWidgets.Settings />
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
