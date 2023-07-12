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

    async function addClick() {
        const ip = await getIp();
        const location = await getLocation(ip);
        const urlId = await request.params.redirect;
        const deviceInfo = getOperatingSystemAndDevice(navigator.userAgent);
        console.log(deviceInfo);
        const os = deviceInfo.operatingSystem;
        const device = deviceInfo.deviceType;
        const referrer = !document.referrer ? "direct" : document.referrer;
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
