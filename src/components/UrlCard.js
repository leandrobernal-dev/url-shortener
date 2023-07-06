import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, IconButton } from "@mui/joy";
import { BookmarkAdd, Visibility } from "@mui/icons-material";

export default function UrlCard({
    url,
    name,
    description,
    createdAt,
    clicks,
    urlRedirect,
}) {
    return (
        <Card variant="outlined" sx={{ width: 320 }}>
            <div>
                <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
                    {name} -{" "}
                    <a href={url}>
                        <Typography color="primary" level="body4">
                            {url}
                        </Typography>
                    </a>
                </Typography>
                <Typography level="body2">
                    {new Date(createdAt).toLocaleString()}
                </Typography>
                <IconButton
                    aria-label="bookmark Bahamas Islands"
                    variant="plain"
                    color="danger"
                    size="sm"
                    sx={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                    }}
                >
                    <DeleteForeverIcon />
                </IconButton>
            </div>
            <AspectRatio minHeight="120px" maxHeight="200px">
                <img
                    src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                    srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                    loading="lazy"
                    alt=""
                />
            </AspectRatio>
            <CardContent orientation="horizontal">
                <div>
                    <Typography level="body3">
                        Description: {description}
                    </Typography>
                    <Typography startDecorator={<Visibility />} level="body3">
                        {clicks}
                    </Typography>
                </div>
                <Button
                    variant="solid"
                    size="sm"
                    color="primary"
                    aria-label="Explore Bahamas Islands"
                    sx={{ ml: "auto", fontWeight: 600 }}
                >
                    Details
                </Button>
            </CardContent>
        </Card>
    );
}
