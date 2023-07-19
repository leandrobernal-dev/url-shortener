"use client";

import { useEffect, useState } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import Loading from "@/components/Loading";
import SideBarLinkContextProvider from "@/context/SideBarLinkContextProvider";

export default function App({ children }) {
	const router = useRouter();
	const segment = useSelectedLayoutSegment();

	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [activeLink, setActiveLink] = useState("");

	async function getUrls() {
		const res = await fetch("/api/urls");

		if (res.ok) {
			const userData = await res.json();
			console.log(userData);

			setData(() => userData.data);
			setIsLoading(() => false);
		}
	}

	// inital get urls
	useEffect(() => {
		if (segment) setActiveLink(segment);
		getUrls();
	}, []);

	return (
		<SideBarLinkContextProvider value={{ activeLink, setActiveLink }}>
			<main className="flex h-full w-full dark:text-white">
				<div className="flex w-full flex-col gap-3 p-1 shadow dark:border-border dark:bg-tertiary sm:w-64 sm:border-r md:w-80">
					{isLoading ? (
						<Loading />
					) : (
						<>
							{data.map((url) => {
								return (
									<button
										key={url._id}
										onClick={() => {
											setActiveLink(url.shortenedUrl);
											router.push(
												`/app/links/${url.shortenedUrl}`,
											);
										}}
										className={` relative flex rounded p-2 shadow hover:bg-primary/80 hover:text-white dark:text-white dark:hover:bg-primary ${
											segment === url.shortenedUrl
												? "bg-primary/80 text-white shadow-lg dark:bg-primary"
												: ""
										}`}
									>
										{/* <span className="absolute left-0 top-0 z-0 flex h-full w-8 items-center justify-center dark:bg-slate-600">
											<input
												type="checkbox"
												name=""
												id=""
											/>
										</span> */}

										<div className="flex w-full flex-1 flex-col text-start">
											<span className="text-xs">
												{new Date(
													url.createdAt,
												).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
												})}
											</span>
											<span>{url.name}</span>
										</div>
									</button>
								);
							})}
						</>
					)}
				</div>

				<div
					className={`fixed left-0 top-0  h-full w-full bg-white dark:bg-primary sm:relative sm:flex-1 
					${segment ? "" : "hidden sm:block"}`}
				>
					{children}
					{/* <Suspense fallback={<Loading />}></Suspense> */}
				</div>
			</main>
		</SideBarLinkContextProvider>
	);
}
