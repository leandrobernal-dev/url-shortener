import { NextResponse } from "next/server";

import shortid from "shortid";
import Url from "@/models/Url";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import Clicks from "@/models/Clicks";

export async function GET(request) {
    const { user } = await getServerSession();

    if (!user) {
        throw new Error("Pleaes login to your account");
    }

    const userData = await User.findOne({ email: user.email }).populate({
        path: "urls",
        method: Url,
    });
    const urls = await Url.find({ user: userData._id })
        .populate({
            path: "clicks",
            model: Clicks,
        })
        .exec();

    return NextResponse.json({ urls });
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
