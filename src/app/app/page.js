"use client";

import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import {
    CssBaseline,
    Box,
    Button,
    Typography,
    Input,
    IconButton,
    LinearProgress,
} from "@mui/joy";

// Icons import
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";
import MenuIcon from "@mui/icons-material/Menu";
import BookRoundedIcon from "@mui/icons-material/BookRounded";

// custom
import theme from "@/theme/theme";
import Menu from "@/layout/Menu";
import Layout from "@/layout/Layout";
import Navigation from "@/layout/Navigation";
import { ColorSchemeToggle } from "@/theme/theme";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Add } from "@mui/icons-material";
import NewUrlModalForm from "@/components/NewUrlModal";
import UrlCard from "@/components/UrlCard";
import DeleteUrlModal from "@/components/DeleteUrlModal";

export default function App() {
    const { data: session, status } = useSession({ required: true });
    const [userData, setUserData] = React.useState([]);

    const [newUrlModalFormOpen, setNewUrlModalFormOpen] = React.useState(false);
    const [deleteUrlModalOpen, setDeleteUrlModalOpen] = React.useState(false);

    const [loadingData, setLoadingData] = React.useState(true);
    const [newUrlLoadingButton, setNewUrlLoadingButton] = React.useState(false);

    const [deleteUrlId, setDeleteUrlId] = React.useState(null);

    async function getUrls() {
        const res = await fetch("/api/urls");
        const data = await res.json();

        if (res.ok) {
            console.log(data);
            setUserData(() => {
                setLoadingData(() => false);
                return data.data;
            });
        } else {
            console.log(data);
        }
    }
    React.useEffect(() => {
        getUrls();
    }, []);

    async function handleDeleteUrl(id) {
        const response = await fetch("/api/urls?id=" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (response.ok) {
            const data = await response.json();
            await getUrls();
            console.log(data);
        } else {
            console.log(response);
        }
    }

    async function handleCreateNewUrl(e) {
        setNewUrlLoadingButton((prevState) => !prevState);
        e.preventDefault();
        const formElements = e.currentTarget.elements;
        const name = formElements.name.value;
        const url = formElements.url.value;
        const description = formElements.description.value;

        const response = await fetch("/api/urls", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                url,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setNewUrlLoadingButton((prevState) => !prevState);
            setNewUrlModalFormOpen((prevState) => !prevState);
        } else {
            console.log(response);
        }
    }

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    return (
        <CssVarsProvider disableTransitionOnChange theme={theme}>
            <CssBaseline />
            {drawerOpen && (
                <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
                    <Navigation />
                </Layout.SideDrawer>
            )}

            <Layout.Root
                sx={{
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "minmax(64px, 200px) minmax(450px, 1fr)",
                        md: "minmax(160px, 300px) minmax(600px, 1fr)",
                    },
                    ...(drawerOpen && {
                        height: "100vh",
                        overflow: "hidden",
                    }),
                }}
            >
                <Layout.Header>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <IconButton
                            variant="outlined"
                            size="sm"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ display: { sm: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant="solid"
                            sx={{ display: { xs: "none", sm: "inline-flex" } }}
                        >
                            <FindInPageRoundedIcon />
                        </IconButton>
                        <Typography component="h1" fontWeight="xl">
                            Files
                        </Typography>
                    </Box>
                    <Input
                        size="sm"
                        placeholder="Search anything…"
                        startDecorator={<SearchRoundedIcon color="primary" />}
                        endDecorator={
                            <IconButton variant="outlined" color="neutral">
                                <Typography
                                    fontWeight="lg"
                                    fontSize="sm"
                                    textColor="text.tertiary"
                                >
                                    /
                                </Typography>
                            </IconButton>
                        }
                        sx={{
                            flexBasis: "500px",
                            display: {
                                xs: "none",
                                sm: "flex",
                            },
                        }}
                    />
                    <Box
                        sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}
                    >
                        <IconButton
                            size="sm"
                            variant="outlined"
                            color="primary"
                            sx={{ display: { xs: "inline-flex", sm: "none" } }}
                        >
                            <SearchRoundedIcon />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant="outlined"
                            color="primary"
                            component="a"
                            href="/blog/first-look-at-joy/"
                        >
                            <BookRoundedIcon />
                        </IconButton>
                        <Menu
                            id="app-selector"
                            control={
                                <IconButton
                                    size="sm"
                                    variant="outlined"
                                    color="primary"
                                    aria-label="Apps"
                                >
                                    <GridViewRoundedIcon />
                                </IconButton>
                            }
                            menus={[
                                {
                                    label: "Email",
                                    href: "/joy-ui/getting-started/templates/email/",
                                },
                                {
                                    label: "Team",
                                    href: "/joy-ui/getting-started/templates/team/",
                                },
                                {
                                    label: "Files",
                                    active: true,
                                    href: "/joy-ui/getting-started/templates/files/",
                                    "aria-current": "page",
                                },
                            ]}
                        />
                        <ColorSchemeToggle />
                        {status === "authenticated" ? (
                            <>
                                <Button onClick={() => signOut()}>
                                    <Typography>Logout</Typography>
                                </Button>
                                {/* <Typography>{session.user.email}</Typography> */}
                                <Button
                                    variant="outlined"
                                    color="neutral"
                                    startDecorator={<Add />}
                                    onClick={() =>
                                        setNewUrlModalFormOpen(
                                            (prevState) => !prevState
                                        )
                                    }
                                >
                                    New
                                </Button>
                            </>
                        ) : (
                            ""
                        )}
                    </Box>
                </Layout.Header>

                <Layout.SideNav>
                    <Navigation
                        data={userData}
                        setNewUrlModalFormOpen={setNewUrlModalFormOpen}
                    />
                </Layout.SideNav>

                <Layout.Main>
                    <DeleteUrlModal
                        open={deleteUrlModalOpen}
                        setOpen={setDeleteUrlModalOpen}
                        deleteFunction={() => handleDeleteUrl(deleteUrlId)}
                    />
                    <NewUrlModalForm
                        handleSubmit={handleCreateNewUrl}
                        open={newUrlModalFormOpen}
                        setOpen={setNewUrlModalFormOpen}
                        loading={newUrlLoadingButton}
                    />
                    {loadingData ? (
                        <LinearProgress />
                    ) : (
                        <div
                            style={{ height: "100%" }}
                            className="w-100 h-100 flex items-center justify-center"
                        >
                            Select Url to View Details
                        </div>
                    )}
                </Layout.Main>
            </Layout.Root>
        </CssVarsProvider>
    );
}
