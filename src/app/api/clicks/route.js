import Clicks from "@/models/Clicks";
import Url from "@/models/Url";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    const { urlId, ip, location, os, device, referrer } = await request.json();

    const data = await Url.findOne({ shortenedUrl: urlId });
    if (!data) {
        return NextResponse.json({ msg: "Error 404" }, { status: 404 });
    }
    const url = data._id;
    try {
        const newClick = new Clicks({
            url,
            location,
            os,
            device,
            ip,
            referrer,
        });
        await newClick.save();
    } catch (error) {
        return NextResponse.json(
            { msg: "Internal Server Error" },
            { status: 500 }
        );
    }

    return NextResponse.json({ data });
};
