import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { ThemeProvider } from "styled-components";
import Nav from "../Nav";
import { MetaHead } from "../MetaHead";
import { themeState, themes } from "@/entities/theme";
import GlobalStyles from "@/shared/styles/GlobalStyles";
import FooterMain from "@/widgets/footer";
import HeaderMain from "@/widgets/header";

export default function Layout({ children }) {
    const [theme, setTheme] = useRecoilState(themeState);
    const isLoaded = useRef(false);

    useEffect(() => {
        function determineTheme() {
            if (window.matchMedia) {
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    setTheme(themes.dark);
                } else {
                    setTheme(themes.light);
                }
            } else {
                setTheme(themes.light);
            }
        }

        function registerPreferenceListener() {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
                setTheme(event.matches ? themes.dark : themes.light);
            });
        }

        determineTheme();
        registerPreferenceListener();
    }, []);

    useEffect(() => {
        if (theme && !isLoaded.current) {
            isLoaded.current = true;
        }
    });

    function toggleTheme() {
        setTheme((prev) => (prev.name === "light" ? themes.dark : themes.light));
    }

    if (!theme) {
        return null;
    }

    return (
        <ThemeProvider theme={theme.styles}>
            <GlobalStyles isLoaded={isLoaded.current} />
            <MetaHead />
            <header>
                <Nav
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            </header>
            <div className="h-full flex-col justify-between flex">
                <main>
                    <HeaderMain />
                    {children}
                </main>
                <FooterMain />
            </div>
        </ThemeProvider>
    );
}
