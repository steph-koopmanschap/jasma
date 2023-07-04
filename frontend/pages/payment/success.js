import { MobileDetectSSR } from "@/shared/model";

export default function PaymentSuccess() {
    return (
        <div className="">
            <section className="flex flex-col items-center justify-center w-full h-fit">
                <h1 className="text-xl">Payment Success.</h1>
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
