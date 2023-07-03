import bcrypt from "bcrypt";

import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { email, password } = await request.json();

    try {
        const existingUser = await User.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
            return NextResponse.json(
                {
                    msg: "User already exist",
                },
                { status: 409 }
            );
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user
        const newUser = User({
            email,
            password: hashedPassword,
            provider: "credentials",
        });
        await newUser.save();
        console.log(newUser);
        return NextResponse.json(
            {
                msg: "User created Successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { msg: `Internal Server Error: ${error}` },
            { status: 500 }
        );
    }
}
