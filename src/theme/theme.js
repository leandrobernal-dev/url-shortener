import { extendTheme } from "@mui/joy/styles";

import { useColorScheme } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import { DarkModeRounded, LightModeRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";

const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                background: {
                    body: "var(--joy-palette-neutral-50)",
                },
            },
        },
        dark: {
            palette: {
                background: {
                    body: "var(--joy-palette-common-black)",
                    surface: "var(--joy-palette-neutral-900)",
                },
            },
        },
    },
    fontFamily: {
        display: "'Inter', var(--joy-fontFamily-fallback)",
        body: "'Inter', var(--joy-fontFamily-fallback)",
    },
    // colorSchemes: {
    //     light: {
    //         palette: {},
    //     },
    //     dark: {
    //         palette: {},
    //     },
    // },
});
export default theme;

export const ColorSchemeToggle = ({ onClick, ...props }) => {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return (
            <IconButton size="sm" variant="plain" color="neutral" disabled />
        );
    }
    return (
        <IconButton
            id="toggle-mode"
            size="sm"
            variant="plain"
            color="neutral"
            aria-label="toggle light/dark mode"
            {...props}
            onClick={(event) => {
                if (mode === "light") {
                    setMode("dark");
                } else {
                    setMode("light");
                }
                onClick?.(event);
            }}
        >
            {mode === "light" ? <DarkModeRounded /> : <LightModeRounded />}
        </IconButton>
    );
};
