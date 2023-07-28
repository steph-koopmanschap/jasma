import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./Switch.css";

export const ThemeSwitch = () => {
    const [theme, setTheme] = useState("");

    useEffect(() => {
        function determineTheme() {
            if (window.matchMedia) {
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    setTheme("dark");
                } else {
                    setTheme("light");
                }
            } else {
                setTheme("light");
            }
        }

        function registerPreferenceListener() {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
                setTheme(event.matches ? "dark" : "light");
            });
        }

        determineTheme();
        registerPreferenceListener();
    }, []);

    function toggleTheme() {
        theme === "dark"
            ? document.documentElement.classList.remove("dark")
            : document.documentElement.classList.add("dark");
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }

    return (
        // {` height: "100%", width: "30px", cursor: "pointer" `}
        //"h-full w-8 cursor-pointer"
        //{` h-full w-8 cursor-pointer `}
        <div className="switch-container">
            {theme === "light" && (
                <FontAwesomeIcon
                    icon={faMoon}
                    onClick={toggleTheme}
                    fontSize="25px"
                />
            )}
            {theme === "dark" && (
                <FontAwesomeIcon
                    icon={faSun}
                    onClick={toggleTheme}
                    fontSize="25px"
                />
            )}
        </div>
    );
};
