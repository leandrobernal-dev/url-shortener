"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import http from "http";

export default function RedirectPage(request) {
    const router = useRouter();
    const getIp = async () => {
        return new Promise((resolve) => {
            http.get(
                { host: "api.ipify.org", port: 80, path: "/" },
                function (resp) {
                    resp.on("data", function (ip) {
                        resolve(String(ip));
                    });
                }
            );
        });
    };
    async function getLocation(ip) {
        return new Promise((resolve) => {
            http.get({ host: "ip2c.org", port: 80, path: "/" + ip }, (resp) => {
                resp.on("data", (loc) => {
                    resolve(String(loc));
                });
            });
        });
    }
    function getOperatingSystemAndDevice(userAgent) {
        if (/android/i.test(userAgent)) {
            return {
                operatingSystem: "Android",
                deviceType: "Mobile",
            };
        } else if (/iphone/i.test(userAgent)) {
            return {
                operatingSystem: "iOS",
                deviceType: "Mobile",
            };
        } else if (/windows/i.test(userAgent)) {
            return {
                operatingSystem: "Windows",
                deviceType: "Desktop",
            };
        } else if (/mac/i.test(userAgent)) {
            return {
                operatingSystem: "Mac",
                deviceType: "Desktop",
            };
        } else if (/linux/i.test(userAgent)) {
            return {
                operatingSystem: "Linux",
                deviceType: "Desktop",
            };
        } else {
            return {
                operatingSystem: "Unknown",
                deviceType: "Unknown",
            };
        }
    }
    function getReferrerName() {
        const referrer = document.referrer.toLowerCase();
        try {
            const referrerUrl = new URL(referrer);
            const hostname = referrerUrl.hostname.toLowerCase();

            if (hostname.includes("facebook.com")) {
                return "Facebook";
            } else if (hostname.includes("twitter.com")) {
                return "Twitter";
            } else if (hostname.includes("youtube.com")) {
                return "YouTube";
            } else if (hostname.includes("instagram.com")) {
                return "Instagram";
            } else if (hostname.includes("linkedin.com")) {
                return "LinkedIn";
            } else if (hostname.includes("pinterest.com")) {
                return "Pinterest";
            } else if (hostname.includes("tumblr.com")) {
                return "Tumblr";
            } else if (hostname.includes("reddit.com")) {
                return "Reddit";
            } else if (hostname.includes("snapchat.com")) {
                return "Snapchat";
            } else if (hostname.includes("whatsapp.com")) {
                return "WhatsApp";
            } else if (hostname.includes("tiktok.com")) {
                return "TikTok";
            } else if (hostname.includes("spotify.com")) {
                return "Spotify";
            } else if (hostname.includes("github.com")) {
                return "GitHub";
            } else if (hostname.includes("stackoverflow.com")) {
                return "Stack Overflow";
            } else if (hostname.includes("medium.com")) {
                return "Medium";
            } else if (hostname.includes("quora.com")) {
                return "Quora";
            }
        } catch (error) {
            console.error("Error parsing referrer URL:", error);
        }

        if (referrer === "") {
            return "Direct";
        } else {
            return "Others";
        }
    }

    async function addClick() {
        const ip = await getIp();
        const location = await getLocation(ip);
        const urlId = await request.params.redirect;
        const deviceInfo = getOperatingSystemAndDevice(navigator.userAgent);
        console.log(deviceInfo);
        const os = deviceInfo.operatingSystem;
        const device = deviceInfo.deviceType;
        const referrer = getReferrerName();
        const body = { urlId, ip, location, os, device, referrer };
        console.log(body);
        fetch("/api/clicks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    router.push("/404");
                }
            })
            .then((data) => {
                router.push(data.data.url);
            })
            .catch(() => {
                router.push("/404");
            });
    }
    useEffect(() => {
        addClick();
    }, []);
}

// import { notFound, redirect } from "next/navigation";
// import Url from "@/models/Url";
// import Clicks from "@/models/Clicks";
// import http from "http";

// export default async function RedirectPage(request) {
//     const redirectURLId = request.params.redirect;
//     const getIp = async () => {
//         return new Promise((resolve) => {
//             http.get(
//                 { host: "api.ipify.org", port: 80, path: "/" },
//                 function (resp) {
//                     resp.on("data", function (ip) {
//                         resolve(String(ip));
//                     });
//                 }
//             );
//         });
//     };
//     async function getLocation(ip) {
//         return new Promise((resolve) => {
//             http.get({ host: "ip2c.org", port: 80, path: "/" + ip }, (resp) => {
//                 resp.on("data", (loc) => {
//                     resolve(String(loc));
//                 });
//             });
//         });
//     }
//     const ip = await getIp();
//     const loc = await getLocation(ip);
//     console.log({ ip, loc });
//     return;
//     const url = await Url.findOne({ shortenedUrl: redirectURLId });

//     if (url) {
//         const newClick = new Clicks({
//             url: url._id,
//             location: null,
//         });
//         await newClick.save();
//         redirect(url.url);
//     }

//     return notFound();
// }
