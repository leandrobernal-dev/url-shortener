import { NextResponse } from "next/server";

import shortid from "shortid";
import Url from "@/models/urlsModel";
import User from "@/models/userModel";

export async function POST(request) {
    const { email } = await request.json();

    try {
        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ msg: "User not Found" });

        const userId = user._id;
        const urlId = shortid.generate(); // Generate a unique URL
        const newUrl = new Url({
            user: userId,
            caption: caption,
            images: images,
            url: urlId, // Assign the generated URL
        });
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
