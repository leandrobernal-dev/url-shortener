"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import Loading from "@/components/Loading";
import { AdsClick, Sell } from "@mui/icons-material";
import { UserDataContext } from "@/context/UserDataContext";

export default function App({ children }) {
	const router = useRouter();
	const segment = useSelectedLayoutSegment();

	const { activeLink, setActiveLink, data, setData, sideBarIsOpen } =
		useContext(UserDataContext);
	const [isLoading, setIsLoading] = useState(true);

	async function getUrls() {
		const res = await fetch("/api/urls");

		if (res.ok) {
			const userData = await res.json();
			console.log(userData);

			setData(() => userData.data);
			setIsLoading(() => false);
		}
	}

	function handleSort(e) {
		setData((prevState) => {
			const sortedArray = [...prevState];
			sortedArray.sort((a, b) => {
				if (e.target.value === "clicks") {
					return b.clicks - a.clicks;
				} else {
					return new Date(a.createdAt) - new Date(b.createdAt);
				}
			});
			console.log(sortedArray);
			return sortedArray;
		});
	}

	// inital get urls
	useEffect(() => {
		if (segment) setActiveLink(segment);
		getUrls();
	}, []);

	return (
		<main className="h-full w-full dark:text-white">
			<div
				className={`fixed bottom-0 left-0 top-14 z-10 flex w-full  flex-col gap-3 py-2 pr-1  shadow dark:border-border dark:bg-tertiary sm:w-80 sm:border-r
				${sideBarIsOpen ? "md:left-14 xl:left-64" : "md:left-14"}
			`}
			>
				{isLoading ? (
					<Loading />
				) : (
					<>
						<div className="flex items-center gap-2 p-2 shadow">
							<strong className="text-sm">Sort By:</strong>
							<div
								className="grid flex-1 grid-cols-2 gap-2 rounded bg-primary p-1"
								onChange={handleSort}
							>
								<div>
									<input
										type="radio"
										name="sort-by-input"
										id="sort-by-date-option"
										value="date"
										className="peer hidden"
										defaultChecked
									/>
									<label
										htmlFor="sort-by-date-option"
										className="block cursor-pointer select-none rounded p-1 text-center text-sm peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white"
									>
										Date
									</label>
								</div>

								<div>
									<input
										type="radio"
										name="sort-by-input"
										id="sort-by-clicks-option"
										value="clicks"
										className="peer hidden"
									/>
									<label
										htmlFor="sort-by-clicks-option"
										className="block cursor-pointer select-none rounded p-1 text-center text-sm peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white"
									>
										Clicks
									</label>
								</div>
							</div>
						</div>

						<div className=" small-scrollbar flex h-full flex-col gap-2 overflow-y-scroll px-2">
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
										className={`relative flex w-full rounded p-2 shadow hover:bg-primary/80 hover:text-white dark:text-white dark:hover:bg-primary ${
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

										<div className="flex w-full flex-1 flex-col gap-2 text-start">
											<div className="flex items-center justify-between text-xs">
												<span className="opacity-70">
													{new Date(
														url.createdAt,
													).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
															year: "numeric",
														},
													)}
												</span>
											</div>
											<span>{url.name}</span>

											<span className="flex  items-center justify-between gap-2 text-xs opacity-60">
												<span className="opacity-100">
													{process.env.hostname +
														url.shortenedUrl}
												</span>
												<span className="flex w-11 items-center gap-1">
													<AdsClick
														sx={{
															fontSize: "0.9rem",
														}}
													/>
													{url.clicks
														? url.clicks
														: 0}
												</span>
											</span>

											<span className="flex items-center gap-1 py-1 text-xs">
												<Sell
													sx={{
														fontSize: "0.9rem",
														opacity: "80%",
													}}
												/>
												<strong>&#183;</strong>
												<span className="opacity-60">
													No Tags
												</span>
											</span>
										</div>
									</button>
								);
							})}
						</div>
					</>
				)}
			</div>

			<div
				className={`fixed bottom-0 left-0 top-0 z-30 h-full w-full bg-white pl-0 dark:bg-primary sm:top-14 sm:z-0 sm:pl-80
					${segment ? "" : "hidden sm:block"}
					${sideBarIsOpen ? "md:left-[376px] xl:left-64" : "md:left-14"}
					`}
			>
				{children}
				{/* <Suspense fallback={<Loading />}></Suspense> */}
			</div>
		</main>
	);
}
