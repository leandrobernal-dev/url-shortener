import * as React from "react";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator, {
    listItemDecoratorClasses,
} from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";

// Icons import
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddIcon from "@mui/icons-material/Add";
import NewFolderModalForm from "@/components/NewFolderModal";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    Input,
    Menu,
    MenuItem,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    Typography,
    tabClasses,
} from "@mui/joy";
import {
    LinkRounded,
    Folder,
    Visibility,
    SearchRounded,
} from "@mui/icons-material";

export default function Navigation({
    data,
    setNewUrlModalFormOpen,
    activeUrl,
    setActiveUrl,
}) {
    const addNewButtonRef = React.useRef(null);
    return (
        <div>
            <Tabs
                size="sm"
                defaultValue={0}
                sx={(theme) => ({
                    width: "100%",
                    "--Tabs-gap": "0px",
                    overflow: "auto",
                })}
            >
                <TabList
                    sx={{
                        "--ListItem-radius": "0px",
                        borderRadius: 0,
                        [`& .${tabClasses.root}`]: {
                            fontWeight: "lg",
                            flex: 1,
                            bgcolor: "background.body",
                            position: "relative",
                            [`&.${tabClasses.selected}`]: {
                                color: "primary.500",
                            },
                            [`&.${tabClasses.selected}:before`]: {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                bottom: -1,
                                width: "100%",
                                height: 2,
                                bgcolor: "primary.400",
                            },
                            [`&.${tabClasses.focusVisible}`]: {
                                outlineOffset: "-3px",
                            },
                        },
                    }}
                >
                    <Tab sx={{ py: 1.5 }}>
                        URL's{" "}
                        <Chip
                            size="sm"
                            variant="soft"
                            color={"neutral"}
                            sx={{ ml: 1 }}
                        >
                            {data.length}
                        </Chip>
                    </Tab>
                    <Tab>
                        Trash{" "}
                        <Chip
                            size="sm"
                            variant="soft"
                            color={"neutral"}
                            sx={{ ml: 1 }}
                        >
                            0
                        </Chip>
                    </Tab>
                </TabList>
                <TabPanel value={0} sx={{ px: 3 }}>
                    <List
                        size="sm"
                        sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}
                    >
                        <ListItem nested>
                            <Input
                                size="sm"
                                placeholder="Search anything…"
                                startDecorator={
                                    <SearchRounded color="primary" />
                                }
                                sx={{ width: "100%" }}
                                className="mt-2"
                            />
                            <ListSubheader>
                                Browse
                                <Button
                                    ref={addNewButtonRef}
                                    onClick={() =>
                                        setNewUrlModalFormOpen(() => true)
                                    }
                                    size="sm"
                                    variant="plain"
                                    color="primary"
                                    sx={{
                                        "--IconButton-size": "24px",
                                        ml: "auto",
                                    }}
                                >
                                    <AddIcon
                                        fontSize="medium"
                                        color="primary"
                                    />
                                </Button>
                            </ListSubheader>

                            {/* <LinearProgress /> */}

                            <List
                                aria-label="Sidebar"
                                sx={{
                                    // ...applyRadiusOnEdges({ target: 'deepest' | 'nested' }),
                                    "--ListItem-paddingLeft": "0px",
                                    "--ListItemDecorator-size": "64px",
                                    "--ListItemDecorator-color": (theme) =>
                                        theme.vars.palette.text.secondary,
                                    "--ListItem-minHeight": "32px",
                                    "--List-nestedInsetStart": "13px",
                                    [`& .${listItemDecoratorClasses.root}`]: {
                                        justifyContent: "flex-end",
                                        pr: "18px",
                                    },
                                    '& [role="button"]': {
                                        // borderRadius: "0 20px 20px 0",
                                    },
                                }}
                            >
                                <ListItem nested>
                                    {data.map((url, urlIndex) => {
                                        return (
                                            <List key={url._id}>
                                                <ListItem>
                                                    <ListItemButton
                                                        selected={
                                                            activeUrl ===
                                                            url._id
                                                        }
                                                        variant={
                                                            activeUrl ===
                                                            url._id
                                                                ? "soft"
                                                                : "plain"
                                                        }
                                                        color={
                                                            activeUrl ===
                                                            url._id
                                                                ? "primary"
                                                                : undefined
                                                        }
                                                        onClick={() =>
                                                            setActiveUrl(
                                                                () => url._id
                                                            )
                                                        }
                                                    >
                                                        <ListItemDecorator>
                                                            <Avatar
                                                                size="sm"
                                                                alt={
                                                                    String(
                                                                        url.name
                                                                    ).toUpperCase()[0]
                                                                }
                                                                src={
                                                                    new URL(
                                                                        url.url
                                                                    ).protocol +
                                                                    "//" +
                                                                    new URL(
                                                                        url.url
                                                                    ).host +
                                                                    "/favicon.ico"
                                                                }
                                                            />
                                                            {/* <LinkRounded fontSize="lg" /> */}
                                                        </ListItemDecorator>
                                                        <ListItemContent>
                                                            {url.name}
                                                        </ListItemContent>
                                                        <Typography
                                                            startDecorator={
                                                                <Visibility />
                                                            }
                                                            level="body3"
                                                        >
                                                            {url.clicks}
                                                        </Typography>
                                                    </ListItemButton>
                                                </ListItem>
                                            </List>
                                        );
                                    })}
                                </ListItem>
                            </List>
                        </ListItem>
                        {/*  */}
                    </List>
                </TabPanel>
                <TabPanel value={1} sx={{ p: 3 }}>
                    <Typography>
                        Deleted Urls will be moved here and automatically
                        disappear after 30 days. You can restore them by
                        clicking Restore Url.
                    </Typography>
                </TabPanel>
            </Tabs>
        </div>
    );
}
