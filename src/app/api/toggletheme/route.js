import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function GET(req) {
    const cookieStore = cookies();
    const theme = cookieStore.get("theme");
    if (!theme) {
        cookieStore.set("theme", "light");
    } else {
        cookieStore.set("theme", theme.value !== "light" ? "light" : "dark");
    }
    return NextResponse.json({ theme });
}
