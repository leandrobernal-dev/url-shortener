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

    const { searchParams } = new URL(request.url);

    // intercept data if 'id' is specified in the request and return urlById
    if (searchParams.get("id")) {
        const id = searchParams.get("id").toString();
        // const userData = await User.findOne({ email: user.email });
        const data = await Url.findById(id).populate("clicks");
        const currentYear = new Date().getFullYear();
        const clickPeriod = await Clicks.aggregate([
            {
                $match: {
                    url: data._id,
                    createdAt: {
                        $gte: new Date(currentYear, 0, 1), // Start of the year
                        $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
        ]);
        const device = await Clicks.aggregate([
            { $match: { url: data._id } },
            {
                $group: {
                    _id: "$device",
                    count: { $sum: 1 },
                },
            },
        ]);
        const os = await Clicks.aggregate([
            { $match: { url: data._id } },
            {
                $group: {
                    _id: "$os",
                    count: { $sum: 1 },
                },
            },
        ]);
        const location = await Clicks.aggregate([
            { $match: { url: data._id } },
            {
                $group: {
                    _id: "$location",
                    count: { $sum: 1 },
                },
            },
        ]);
        const referrer = await Clicks.aggregate([
            { $match: { url: data._id } },
            {
                $group: {
                    _id: "$referrer",
                    count: { $sum: 1 },
                },
            },
        ]);
        return NextResponse.json({
            data,
            device,
            os,
            location,
            referrer,
            clickPeriod,
        });
    }

    const userData = await User.findOne({ email: user.email }).populate({
        path: "urls",
        method: Url,
    });
    const data = await Url.find({ user: userData._id }).populate("clicks");
    return NextResponse.json({ data });
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
