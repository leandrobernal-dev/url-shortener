"use client";

import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import {
    CssBaseline,
    AspectRatio,
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Typography,
    Input,
    IconButton,
    Divider,
    Sheet,
    CircularProgress,
    LinearProgress,
} from "@mui/joy";

// Icons import
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";
import MenuIcon from "@mui/icons-material/Menu";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
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

export default function App() {
    const { data: session, status } = useSession({ required: true });
    const [userUrls, setUserUrls] = React.useState([]);

    const [newUrlModalFormOpen, setNewUrlModalFormOpen] = React.useState(false);
    const [loadingData, setLoadingData] = React.useState(true);
    const [newUrlLoadingButton, setNewUrlLoadingButton] = React.useState(false);

    async function getUrls() {
        const res = await fetch("/api/urls");
        const data = await res.json();

        if (res.ok) {
            console.log(data);
            setUserUrls(() => {
                setLoadingData(() => false);
                return data.urls;
            });
        } else {
            console.log(data);
        }
    }
    React.useEffect(() => {
        getUrls();
    }, []);

    const urlsElement = userUrls.map((url) => {
        return (
            <UrlCard
                key={url._id}
                urlId={url._id}
                name={url.name}
                url={`http://localhost:3000/${url.shortenedUrl}`}
                description={url.description}
                createdAt={url.createdAt}
                clicks={url.clicks}
                urlRedirect={url.url}
                deleteFunction={handleDeleteUrl}
            />
        );
    });

    async function handleDeleteUrl(e) {
        const id = e.target.parentNode.getAttribute("url-id");

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
            setUserUrls((prevState) => {
                setNewUrlLoadingButton((prevState) => !prevState);
                setNewUrlModalFormOpen((prevState) => !prevState);
                return [...prevState, data.newUrl];
            });
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
                        md: "minmax(160px, 300px) minmax(600px, 1fr) minmax(300px, 420px)",
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
                                    Create New
                                </Button>
                            </>
                        ) : (
                            ""
                        )}
                    </Box>
                </Layout.Header>

                <Layout.SideNav>
                    <Navigation />
                </Layout.SideNav>

                <Layout.Main>
                    <NewUrlModalForm
                        handleSubmit={handleCreateNewUrl}
                        open={newUrlModalFormOpen}
                        setOpen={setNewUrlModalFormOpen}
                        loading={newUrlLoadingButton}
                    />
                    {loadingData ? <LinearProgress /> : urlsElement}
                </Layout.Main>

                <Sheet
                    sx={{
                        display: { xs: "none", sm: "initial" },
                        borderLeft: "1px solid",
                        borderColor: "neutral.outlinedBorder",
                    }}
                >
                    <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                        <Typography sx={{ flex: 1 }}>
                            torres-del-paine.png
                        </Typography>
                        <IconButton
                            variant="outlined"
                            color="neutral"
                            size="sm"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <Box sx={{ display: "flex" }}>
                        <Button
                            variant="soft"
                            sx={{
                                borderRadius: 0,
                                borderBottom: "2px solid",
                                borderColor: "primary.solidBg",
                                flex: 1,
                                py: "1rem",
                            }}
                        >
                            Details
                        </Button>
                        <Button
                            variant="plain"
                            color="neutral"
                            sx={{ borderRadius: 0, flex: 1, py: "1rem" }}
                        >
                            Activity
                        </Button>
                    </Box>
                    <AspectRatio ratio="21/9">
                        <img
                            alt=""
                            src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=774"
                        />
                    </AspectRatio>
                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                        }}
                    >
                        <Typography level="body2" mr={1}>
                            Shared with
                        </Typography>
                        <AvatarGroup size="sm" sx={{ "--Avatar-size": "24px" }}>
                            <Avatar
                                src="https://i.pravatar.cc/24?img=6"
                                srcSet="https://i.pravatar.cc/48?img=6 2x"
                            />
                            <Avatar
                                src="https://i.pravatar.cc/24?img=7"
                                srcSet="https://i.pravatar.cc/48?img=7 2x"
                            />
                            <Avatar
                                src="https://i.pravatar.cc/24?img=8"
                                srcSet="https://i.pravatar.cc/48?img=8 2x"
                            />
                            <Avatar
                                src="https://i.pravatar.cc/24?img=9"
                                srcSet="https://i.pravatar.cc/48?img=9 2x"
                            />
                        </AvatarGroup>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            gap: 2,
                            p: 2,
                            display: "grid",
                            gridTemplateColumns: "auto 1fr",
                            "& > *:nth-child(odd)": { color: "text.secondary" },
                        }}
                    >
                        <Typography level="body2">Type</Typography>
                        <Typography level="body2" textColor="text.primary">
                            Image
                        </Typography>

                        <Typography level="body2">Size</Typography>
                        <Typography level="body2" textColor="text.primary">
                            3,6 MB (3,258,385 bytes)
                        </Typography>

                        <Typography level="body2">Storage used</Typography>
                        <Typography level="body2" textColor="text.primary">
                            3,6 MB (3,258,385 bytes)
                        </Typography>

                        <Typography level="body2">Location</Typography>
                        <Typography level="body2" textColor="text.primary">
                            Travel pictures
                        </Typography>

                        <Typography level="body2">Owner</Typography>
                        <Typography level="body2" textColor="text.primary">
                            Michael Scott
                        </Typography>

                        <Typography level="body2">Modified</Typography>
                        <Typography level="body2" textColor="text.primary">
                            26 October 2016
                        </Typography>

                        <Typography level="body2">Created</Typography>
                        <Typography level="body2" textColor="text.primary">
                            5 August 2016
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ py: 2, px: 1 }}>
                        <Button
                            variant="plain"
                            size="sm"
                            endDecorator={<EditOutlinedIcon />}
                        >
                            Add a description
                        </Button>
                    </Box>
                </Sheet>
            </Layout.Root>
        </CssVarsProvider>
    );
}
