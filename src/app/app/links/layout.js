"use client";

import { useEffect, useState } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import Loading from "@/components/Loading";

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
		<main className="m-0 flex h-full w-full dark:text-white">
			<div className="flex w-64 flex-col gap-3 border-r p-1 shadow dark:border-border dark:bg-tertiary">
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
									className={` relative flex rounded p-2 ${
										activeLink === url.shortenedUrl
											? "shadow-lg dark:bg-primary"
											: ""
									}`}
								>
									<span className="absolute left-0 top-0 z-0 flex h-full w-8 items-center justify-center dark:bg-slate-600">
										<input type="checkbox" name="" id="" />
									</span>

									<div className="flex flex-1 flex-col justify-start">
										<span>
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

			<div className="w-full flex-1">
				{children}
				{/* <Suspense fallback={<Loading />}></Suspense> */}
			</div>
		</main>
	);
}
