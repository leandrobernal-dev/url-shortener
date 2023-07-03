"use client";

import * as React from "react";
import { CssVarsProvider } from "@mui/joy";
import { GlobalStyles } from "@mui/joy";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import { Button } from "@mui/joy";
import Checkbox from "@mui/joy/Checkbox";
import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import { Link } from "@mui/joy";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import customTheme from "@/theme/theme";
import { Google } from "@mui/icons-material";

import { ColorSchemeToggle } from "@/theme/theme";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * This template uses [`Inter`](https://fonts.google.com/specimen/Inter?query=inter) font.
 */
export default function RegisterPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleSignUp = async (event) => {
        event.preventDefault();
        const formElements = event.currentTarget.elements;

        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: formElements.email.value,
                password: formElements.password.value,
            }),
        });
        const data = await response.json();

        if (response.ok) {
            console.log(data);
            await signIn("credentials", {
                email: formElements.email.value,
                password: formElements.password.value,
                redirect: false,
            })
                .then(({ ok, error, status, url }) => {
                    console.log(ok, error, status, url);
                    if (ok) {
                        console.log(error);
                        router.push(searchParams.get("callbackUrl"));
                    } else {
                        console.log(error);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log(data);
        }
    };
    return (
        <CssVarsProvider
            defaultMode="dark"
            disableTransitionOnChange
            theme={customTheme}
        >
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ":root": {
                        "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
                        "--Cover-width": "40vw", // must be `vw` only
                        "--Form-maxWidth": "700px",
                        "--Transition-duration": "0.4s", // set to `none` to disable transition
                    },
                }}
            />
            <Box
                sx={(theme) => ({
                    width: "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
                    transition: "width var(--Transition-duration)",
                    transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    backdropFilter: "blur(4px)",
                    backgroundColor: "rgba(255 255 255 / 0.6)",
                    [theme.getColorSchemeSelector("dark")]: {
                        backgroundColor: "rgba(19 19 24 / 0.4)",
                    },
                })}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "100dvh",
                        width: "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
                        maxWidth: "100%",
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{
                            py: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            fontWeight="lg"
                            startDecorator={
                                <Box
                                    component="span"
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        background: (theme) =>
                                            `linear-gradient(45deg, ${theme.vars.palette.primary.solidBg}, ${theme.vars.palette.primary.solidBg} 30%, ${theme.vars.palette.primary.softBg})`,
                                        borderRadius: "50%",
                                        boxShadow: (theme) => theme.shadow.md,
                                        "--joy-shadowChannel": (theme) =>
                                            theme.vars.palette.primary
                                                .mainChannel,
                                    }}
                                />
                            }
                        >
                            Logo
                        </Typography>
                        <ColorSchemeToggle />
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: "auto",
                            py: 2,
                            pb: 5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            width: 400,
                            maxWidth: "100%",
                            mx: "auto",
                            borderRadius: "sm",
                            "& form": {
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            },
                            [`& .${formLabelClasses.asterisk}`]: {
                                visibility: "hidden",
                            },
                        }}
                    >
                        <div>
                            <Typography
                                component="h1"
                                fontSize="xl2"
                                fontWeight="lg"
                            >
                                Create a New Account
                            </Typography>
                        </div>
                        <form onSubmit={handleSignUp}>
                            <FormControl required>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" name="email" />
                            </FormControl>
                            <FormControl required>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" name="password" />
                            </FormControl>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "end",
                                    alignItems: "center",
                                }}
                            >
                                <Typography level="body3" textAlign="center">
                                    Already have an Account?{" "}
                                    <Link
                                        fontSize="sm"
                                        href={`/auth/login?callbackUrl=${encodeURIComponent(
                                            searchParams.get("callbackUrl")
                                        )}`}
                                        fontWeight="lg"
                                    >
                                        Sign-In.
                                    </Link>
                                </Typography>
                            </Box>
                            <Button variant="outlined" type="submit" fullWidth>
                                Sign Up
                            </Button>
                        </form>
                        <Button
                            variant="outlined"
                            color="neutral"
                            fullWidth
                            startDecorator={<Google />}
                        >
                            Sign up with Google
                        </Button>
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body3" textAlign="center">
                            © Your company {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: "100%",
                    position: "fixed",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
                    transition:
                        "background-image var(--Transition-duration), left var(--Transition-duration) !important",
                    transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
                    backgroundColor: "background.level1",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
                    [theme.getColorSchemeSelector("dark")]: {
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
                    },
                })}
            />
        </CssVarsProvider>
    );
}
