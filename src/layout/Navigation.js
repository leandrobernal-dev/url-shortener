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
import { Button, Menu, MenuItem, Typography } from "@mui/joy";
import { LinkRounded, Folder, Visibility } from "@mui/icons-material";

export default function Navigation({
    data,
    setNewUrlModalFormOpen,
    activeUrl,
    setActiveUrl,
}) {
    const [newFolderModalOpen, setNewFolderModalOpen] = React.useState(false);

    async function handleNewFolder(e) {
        e.preventDefault();
        setNewFolderModalOpen(() => false);

        const formElements = e.currentTarget.elements;
        const name = formElements.name.value;
        const description = formElements.description.value;

        const response = await fetch("/api/folder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.log(response);
        }
    }

    const addNewButtonRef = React.useRef(null);
    const [addNewMenuOpen, setAddNewMenuOpen] = React.useState(false);
    function handleAddNewMenuClose() {
        setAddNewMenuOpen(() => false);
    }

    return (
        <>
            <NewFolderModalForm
                loading={false}
                open={newFolderModalOpen}
                setOpen={setNewFolderModalOpen}
                handleSubmit={handleNewFolder}
            />
            <List
                size="sm"
                sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}
            >
                <ListItem nested>
                    <ListSubheader>
                        Browse
                        <Button
                            ref={addNewButtonRef}
                            id="basic-demo-button"
                            aria-controls={"basic-menu"}
                            aria-haspopup="true"
                            aria-expanded={addNewMenuOpen ? "true" : undefined}
                            onClick={() => setAddNewMenuOpen((open) => !open)}
                            size="sm"
                            variant="plain"
                            color="primary"
                            sx={{ "--IconButton-size": "24px", ml: "auto" }}
                        >
                            <AddIcon fontSize="medium" color="primary" />
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={addNewButtonRef.current}
                            open={addNewMenuOpen}
                            onClose={handleAddNewMenuClose}
                            aria-labelledby="basic-demo-button"
                        >
                            <MenuItem
                                onClick={() =>
                                    setNewUrlModalFormOpen(() => true)
                                }
                            >
                                <Typography startDecorator={<LinkRounded />}>
                                    URL
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() =>
                                    setNewFolderModalOpen(() => true)
                                }
                            >
                                <Typography startDecorator={<FolderOpenIcon />}>
                                    Folder
                                </Typography>
                            </MenuItem>
                        </Menu>
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
                                borderRadius: "0 20px 20px 0",
                            },
                        }}
                    >
                        <ListItem nested>
                            {data.map((folder) => {
                                return (
                                    <div key={folder._id}>
                                        <ListItemButton variant="plain">
                                            <ListItemDecorator>
                                                <Folder fontSize="lg" />
                                            </ListItemDecorator>
                                            {folder.name}
                                            <Typography level="body3">
                                                {` : (${folder.urls.length})`}
                                            </Typography>
                                        </ListItemButton>
                                        {folder.urls.map((url, urlIndex) => {
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
                                                                    () =>
                                                                        url._id
                                                                )
                                                            }
                                                        >
                                                            <ListItemDecorator>
                                                                <LinkRounded fontSize="lg" />
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
                                    </div>
                                );
                            })}
                        </ListItem>
                        <ListItem>
                            <ListItemButton>
                                <ListItemDecorator
                                    sx={{ color: "neutral.500" }}
                                >
                                    <DeleteRoundedIcon fontSize="small" />
                                </ListItemDecorator>
                                <ListItemContent>Trash</ListItemContent>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </ListItem>
                {/*  */}
            </List>
        </>
    );
}
