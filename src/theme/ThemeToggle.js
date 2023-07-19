import { DarkModeRounded, LightModeRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";

function ThemeToggle() {
    const [darkTheme, setDarkTheme] = useState(true);

    useEffect(() => {
        setDarkTheme(() =>
            document.querySelector("html").classList.contains("dark")
        );
    }, []);

    const toggleDarkMode = async () => {
        await fetch("/api/toggletheme");
        const htmlClasses = document.querySelector("html").classList;

        setDarkTheme((prevMode) => !prevMode);

        if (htmlClasses.contains("dark")) {
            htmlClasses.remove("dark");
        } else {
            htmlClasses.add("dark");
        }
    };

    return (
        <button onClick={toggleDarkMode} className="rounded-full">
            {darkTheme ? (
                <LightModeRounded className="text-white" />
            ) : (
                <DarkModeRounded />
            )}
        </button>
    );
}

export default ThemeToggle;
