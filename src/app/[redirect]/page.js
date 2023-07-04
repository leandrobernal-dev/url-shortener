import { notFound, redirect } from "next/navigation";
import Url from "@/models/urlsModel";

export default async function RedirectPage(request) {
    const redirectURLId = request.params.redirect;
    const url = await Url.findOne({ shortenedUrl: redirectURLId });

    if (url) {
        redirect(url.url);
    }

    return notFound();
}
