import { useCheckAuthClientSide } from "@/features/auth/admin";
import LoginForm from "@/features/auth/login";
import { MobileDetectSSR } from "@/shared/model";

//Login page
export default function LoginPage() {
    useCheckAuthClientSide("", "/dashboard");

    return (
        <div className="">
            <section className="flex flex-col items-center justify-center w-full h-fit">
                <LoginForm />
            </section>
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
