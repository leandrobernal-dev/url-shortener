import { notFound, redirect } from "next/navigation";
import Url from "@/models/Url";
import Clicks from "@/models/Clicks";

export default async function RedirectPage(request) {
    const redirectURLId = request.params.redirect;
    const url = await Url.findOne({ shortenedUrl: redirectURLId });

    if (url) {
        const newClick = new Clicks({
            url: url._id,
            location: null,
        });
        await newClick.save();
        redirect(url.url);
    }

    return notFound();
}
