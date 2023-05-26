import FooterMain from "@/widgets/footer";
import HeaderMain from "@/widgets/header";

export default function About() {
    return (
        <div>
            <HeaderMain />
            <h1 className="">About</h1>
            <p>
                JASMA also known as Just Another Social Media App <br />
                Is an open source social media platform.
            </p>
            <FooterMain />
        </div>
    );
}
