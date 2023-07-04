import { MobileDetectSSR } from "@/shared/model";

export default function About() {
    return (
        <div>
            <h1 className="">About</h1>
            <p>
                JASMA also known as Just Another Social Media App <br />
                Is an open source social media platform.
            </p>
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const { isMobile } = MobileDetectSSR(ctx);
    return {
        props: { isSSRMobile: isMobile }
    };
};
