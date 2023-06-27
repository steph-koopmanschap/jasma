import SignUpForm from "@/features/auth/sign-up";
import { MobileDetectSSR } from "@/shared/model";

//Login page
export default function RegistrationPage() {
    return (
        <div className="">
            <section className="flex flex-col items-center justify-center w-full h-fit">
                <SignUpForm />
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
