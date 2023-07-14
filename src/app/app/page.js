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
    Card,
    CardContent,
    Divider,
    Avatar,
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
import {
    Add,
    CalendarMonth,
    ContentCopy,
    EditRounded,
    MoreHoriz,
    Sell,
} from "@mui/icons-material";
import NewUrlModalForm from "@/components/NewUrlModal";
import UrlCard from "@/components/UrlCard";
import DeleteUrlModal from "@/components/DeleteUrlModal";
import DoughnutChart from "@/components/DoughnutChart";
import LineChart from "@/components/LineChart";
import MapChart from "@/components/MapChart";
import BarChart from "@/components/BarChart";

export default function App() {
    const { data: session, status } = useSession({ required: true });
    const [userData, setUserData] = React.useState([]);

    const [newUrlModalFormOpen, setNewUrlModalFormOpen] = React.useState(false);
    const [deleteUrlModalOpen, setDeleteUrlModalOpen] = React.useState(false);

    const [loadingData, setLoadingData] = React.useState(true);
    const [newUrlLoadingButton, setNewUrlLoadingButton] = React.useState(false);

    const [deleteUrlId, setDeleteUrlId] = React.useState(null);

    const [activeUrl, setActiveUrl] = React.useState(null);
    const [activeUrlData, setActiveUrlData] = React.useState({});
    const [devicesData, setDeviceData] = React.useState({
        labels: [],
        values: [],
        colors: ["#ff6384", "#36a2eb", "#ffce56"],
    });
    const [osData, setOsData] = React.useState({
        labels: [],
        values: [],
        colors: ["#ff6384", "#36a2eb", "#ffce56"],
    });
    const [clickPeriodData, setClickPeriodData] = React.useState({
        labels: [],
        values: [],
    });
    const [referrerData, setReferrerData] = React.useState({
        labels: [],
        values: [],
        colors: ["#ff6384", "#36a2eb", "#ffce56"],
    });
    const [locationData, setLocationData] = React.useState({
        labels: [],
        values: [],
        colors: ["#ff6384", "#36a2eb", "#ffce56"],
    });
    const [locationMapData, setLocationMapData] = React.useState([]);

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
    async function getUrlById() {
        if (!activeUrl) return;
        const res = await fetch("/api/urls?id=" + activeUrl);
        const data = await res.json();

        if (res.ok) {
            console.log(data);
            setActiveUrlData(() => data);
            setLoadingData(() => false);
        } else {
            console.log(data);
        }
    }

    // inital get urls
    React.useEffect(() => {
        getUrls();
    }, []);

    // save analytics data
    React.useEffect(() => {
        if (activeUrlData) {
            const months = [...Array(12)].map((_, index) => {
                const date = new Date(2000, index, 1);
                return date.toLocaleDateString("default", { month: "long" });
            });

            const updatedClickPeriodata = {
                title: "Timeline",
                labels: months,
                values: activeUrlData.clickPeriod
                    ? Array.from({ length: 12 }, (_, index) => {
                          const foundObject = activeUrlData.clickPeriod.find(
                              (obj) => obj._id === index + 1
                          );
                          return foundObject ? foundObject.count : 0;
                      })
                    : [],
                colors: ["#ff6384", "#36a2eb", "#ffce56"],
            };
            const updatedDevicesData = {
                title: "Devices",
                labels: activeUrlData.device
                    ? activeUrlData.device
                          .sort((a, b) => b.count - a.count)
                          .map((url) => (url._id ? url._id : "Others"))
                    : [],
                values: activeUrlData.device
                    ? activeUrlData.device
                          .sort((a, b) => b.count - a.count)
                          .map((url) => url.count)
                    : [],
                colors: ["#ff6384", "#36a2eb", "#ffce56"],
            };
            const updatedOsData = {
                title: "Operating System",
                labels: activeUrlData.os
                    ? activeUrlData.os
                          .sort((a, b) => b.count - a.count)
                          .map((device) => (device._id ? device._id : "Others"))
                    : [],
                values: activeUrlData.os
                    ? activeUrlData.os
                          .sort((a, b) => b.count - a.count)

                          .map((os) => os.count)
                    : [],
                colors: ["#ff6384", "#36a2eb", "#ffce56"],
            };
            const updatedReferrerData = {
                title: "Referer",
                labels: activeUrlData.referrer
                    ? activeUrlData.referrer
                          .sort((a, b) => b.count - a.count)
                          .map((referrer) =>
                              referrer._id ? referrer._id : "Others"
                          )
                    : [],
                values: activeUrlData.referrer
                    ? activeUrlData.referrer
                          .sort((a, b) => b.count - a.count)
                          .map((referrer) => referrer.count)
                    : [],
                colors: ["#ff6384", "#36a2eb", "#ffce56"],
            };
            const updatedLocationData = {
                title: "Top Locations",
                labels: activeUrlData.location
                    ? activeUrlData.location
                          .sort((a, b) => b.count - a.count)
                          .map((location) =>
                              location._id
                                  ? String(location._id).split(";")[2]
                                  : "Others"
                          )
                    : [],
                values: activeUrlData.location
                    ? activeUrlData.location
                          .sort((a, b) => b.count - a.count)
                          .map((location) => location.count)
                    : [],
                colors: ["#ff6384", "#36a2eb", "#ffce56"],
            };

            const updatedLocationMapData = activeUrlData.location
                ? activeUrlData.location
                      .map((item) => {
                          if (!item._id) return null;
                          const id = item._id.split(";")[1]; // Extract the country code from the _id
                          return {
                              id,
                              count: item.count,
                          };
                      })
                      .filter(Boolean)
                : [];
            setLocationMapData(() => updatedLocationMapData);
            setLocationData(updatedLocationData);
            setDeviceData(updatedDevicesData);
            setOsData(updatedOsData);
            setClickPeriodData(updatedClickPeriodata);
            setReferrerData(updatedReferrerData);
        }
    }, [activeUrlData]);

    // get url by id onChange(activeUrl)
    React.useEffect(() => {
        setLoadingData(() => true);
        getUrlById();
    }, [activeUrl]);

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
    const [copyUrlText, setCopyUrlText] = React.useState("Copy");

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
                        activeUrl={activeUrl}
                        setActiveUrl={setActiveUrl}
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
                    ) : activeUrlData.data ? (
                        <div className="flex flex-col gap-4">
                            <Card sx={{ width: "100%" }}>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar
                                                alt={
                                                    String(
                                                        activeUrlData.data.url
                                                            .name
                                                    ).toUpperCase()[0]
                                                }
                                                src={
                                                    new URL(
                                                        activeUrlData.data.url
                                                    ).protocol +
                                                    "//" +
                                                    new URL(
                                                        activeUrlData.data.url
                                                    ).host +
                                                    "/favicon.ico"
                                                }
                                            />
                                            <div>
                                                <Typography
                                                    level="h1"
                                                    fontSize="lg"
                                                    sx={{ mb: 0.5 }}
                                                >
                                                    {String(
                                                        activeUrlData.data.name
                                                    )}
                                                </Typography>
                                                <a
                                                    href={
                                                        window.location.origin +
                                                        "/" +
                                                        activeUrlData.data
                                                            .shortenedUrl
                                                    }
                                                    target="blank"
                                                >
                                                    <Typography
                                                        color="primary"
                                                        level="body2"
                                                    >
                                                        {window.location
                                                            .origin +
                                                            "/" +
                                                            activeUrlData.data
                                                                .shortenedUrl}
                                                    </Typography>
                                                </a>
                                                <a
                                                    href={
                                                        activeUrlData.data.url
                                                    }
                                                    target="blank"
                                                >
                                                    <Typography level="body3">
                                                        {activeUrlData.data.url}
                                                    </Typography>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <IconButton
                                                size="sm"
                                                variant="outlined"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        window.location.origin +
                                                            "/" +
                                                            activeUrlData.data
                                                                .shortenedUrl
                                                    );
                                                    setCopyUrlText("Copied!");
                                                    setTimeout(() => {
                                                        setCopyUrlText("Copy");
                                                    }, 2000);
                                                }}
                                            >
                                                <ContentCopy fontSize="small" />{" "}
                                                {copyUrlText}
                                            </IconButton>
                                            <IconButton
                                                size="sm"
                                                variant="outlined"
                                            >
                                                <EditRounded />
                                            </IconButton>
                                            <IconButton
                                                size="sm"
                                                variant="outlined"
                                            >
                                                <MoreHoriz />
                                            </IconButton>
                                        </div>
                                    </div>
                                    <Divider inset="none" />
                                    <div className="flex gap-6">
                                        <Typography
                                            level="body3"
                                            className="flex gap-1 items-center"
                                        >
                                            <CalendarMonth />
                                            {new Date(
                                                activeUrlData.data.createdAt
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </Typography>
                                        <Typography
                                            level="body3"
                                            className="flex gap-1 items-center"
                                        >
                                            <Sell />
                                            No Tags
                                        </Typography>
                                    </div>
                                </div>
                            </Card>
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                {[
                                    <MapChart data={locationMapData} />,
                                    <DoughnutChart data={locationData} />,
                                    <LineChart data={clickPeriodData} />,
                                    <DoughnutChart data={devicesData} />,
                                    <DoughnutChart data={osData} />,
                                    <DoughnutChart data={referrerData} />,
                                ].map((el, index) => (
                                    <Card
                                        key={el + index + "analytics-cards"}
                                        sx={{
                                            position: "relative",
                                            height: "600px",
                                        }}
                                    >
                                        {el}
                                    </Card>
                                ))}
                            </div>
                        </div>
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
