import Folder from "@/models/Folder";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { name, description } = await request.json();

    const session = await getServerSession();
    if (!session) {
        throw new Error("Please login to your account!");
    }

    const email = session.user.email;
    try {
        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ msg: "User not Found" });

        const newFolder = new Folder({
            user,
            name,
            description,
        });
        await newFolder.save();

        return NextResponse.json({
            msg: "New Folder Created Successfully",
            newFolder,
        });
    } catch (error) {
        console.error("Error creating folder:", error);
        return NextResponse.json(
            { msg: "Internal Server Error" },
            { status: 500 }
        );
    }
}
