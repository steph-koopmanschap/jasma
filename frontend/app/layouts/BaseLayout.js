import { useMobileProvider } from "@/shared/model";
import FooterMain from "@/widgets/footer";
import { MetaHead } from "../MetaHead";
import Nav from "../Nav";

export default function Layout({ children }) {
    const { isMobile } = useMobileProvider();

    return (
        <>
            <MetaHead isMobile={isMobile} />
            <header>
                <Nav />
            </header>
            <div className="min-h-screen w-full">
                <main className="min-h-screen">
                    {/* <HeaderMain /> */}
                    {children}
                </main>
                <FooterMain />
            </div>
        </>
    );
}
