import { NextResponse } from "next/server";

import shortid from "shortid";
import Url from "@/models/Url";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import Clicks from "@/models/Clicks";
import Folder from "@/models/Folder";

export async function GET(request) {
    const { user } = await getServerSession();

    if (!user) {
        throw new Error("Pleaes login to your account");
    }

    const userData = await User.findOne({ email: user.email }).populate({
        path: "urls",
        method: Url,
    });
    const urls = await Url.find({ user: userData._id }).populate("clicks");

    const data = await Folder.find({ user: userData._id }).populate({
        path: "urls",
        populate: {
            path: "clicks",
        },
    });
    const unassignedUrl = await Url.find({
        folder: { $exists: false },
        user: userData._id,
    }).populate("clicks");
    data.push({
        name: "Unassigned",
        urls: unassignedUrl,
        _id: "unassigned_urls_folder",
    });
    return NextResponse.json({ urls, data });
}

export async function POST(request) {
    const { name, description, url } = await request.json();
    const session = await getServerSession();

    if (!session) {
        throw new Error("Please login to your account!");
    }
    const email = session.user.email;

    try {
        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ msg: "User not Found" });

        const urlId = shortid.generate(); // Generate a unique URL
        const newUrl = new Url({
            user: user._id,
            name: name,
            url: url,
            shortenedUrl: urlId,
            description: description,
        });
        await newUrl.save();

        console.log("Url created:", newUrl);
        return NextResponse.json({ msg: "Url Generated Successfully", newUrl });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { msg: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    const session = await getServerSession();
    if (!session) {
        throw new Error("Please login to your account!");
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id").toString();
    if (!id) {
        return NextResponse.json(
            {
                msg: "Please Provide a valid URL id",
            },
            { status: 400 }
        );
    }

    const url = await Url.findOne({ _id: id });

    if (!url) {
        return NextResponse.json({ msg: "Url not Found!" }, { status: 404 });
    }

    try {
        await Clicks.deleteMany({ url });
        await url.deleteOne();
        return NextResponse.json({ msg: "success" });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                msg: "Internal Server Error",
                error,
            },
            { status: 500 }
        );
    }
}
