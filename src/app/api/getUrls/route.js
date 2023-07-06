import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import Url from "@/models/Url";
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
