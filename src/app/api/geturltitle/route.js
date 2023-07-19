import { NextResponse } from "next/server";
import http from "https";
import axios from "axios";
import { load } from "cheerio";

export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const { title, status } = await axios.get(url).then((response) => {
        const html = response.data;
        const $ = load(html);
        const title = $("title").text();
        const status = response.status;
        return { title, status };
    });
    return NextResponse.json({ title, status });
};
