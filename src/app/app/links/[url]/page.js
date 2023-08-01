"use client";

import DoughnutChart from "@/components/DoughnutChart";
import Loading from "@/components/Loading";
import {
	Close,
	ContentCopy,
	Delete,
	EditRounded,
	Info,
	Sell,
} from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "@/context/UserDataContext";
import { Avatar, Divider, IconButton } from "@mui/material";
import MapChart from "@/components/MapChart";

export default function UrlDetails() {
	const router = useRouter();
	const params = useParams();
	const urlId = String(params.url);

	const [copyUrlText, setCopyUrlText] = useState("Copy");

	const { activeLink, data, setActiveLink } = useContext(UserDataContext);

	const [isLoading, setIsLoading] = useState(true);

	const [activeUrlData, setActiveUrlData] = useState({});
	const [locationData, setLocationData] = useState({
		labels: [],
		values: [],
		colors: ["#ff6384", "#36a2eb", "#ffce56"],
	});

	const [locationMapData, setLocationMapData] = useState([]);

	async function getUrlById() {
		setIsLoading(true);
		const res = await fetch("/api/urls?id=" + urlId);

		if (res.ok) {
			const data = await res.json();
			console.log(data);
			setActiveUrlData(() => data);
			setIsLoading(false);
		} else {
			console.log(res);
		}
	}
	useEffect(() => {
		getUrlById();
	}, []);

	useEffect(() => {
		const updatedLocationData = {
			title: "Top Locations",
			labels: activeUrlData.location
				? activeUrlData.location
						.sort((a, b) => b.count - a.count)
						.map((location) =>
							location._id
								? String(location._id).split(";")[2]
								: "Others",
						)
				: [],
			values: activeUrlData.location
				? activeUrlData.location
						.sort((a, b) => b.count - a.count)
						.map((location) => location.count)
				: [],
			colors: ["#ff6384", "#36a2eb", "#ffce56"],
		};
		const updatedLocationMapData = activeUrlData.location
			? activeUrlData.location
					.map((item) => {
						if (!item._id) return null;
						const id = item._id.split(";")[1]; // Extract the country code from the _id
						return {
							id,
							count: item.count,
						};
					})
					.filter(Boolean)
			: [];
		setLocationData(updatedLocationData);
		setLocationMapData(() => updatedLocationMapData);
	}, [activeUrlData]);

	return (
		<div className="h-full w-full p-2">
			<nav className="fixed left-0 top-0 z-30 flex h-14 w-full items-center justify-between border-b px-2 shadow dark:border-border dark:bg-secondary sm:hidden">
				<h1 className="flex items-center gap-1">
					<Info fontSize="small" />
					DETAILS
				</h1>
				<button
					type="button"
					onClick={() => {
						router.push("/app/links");
						setActiveLink(() => "");
					}}
					className="rounded-sm p-2 dark:hover:bg-primary"
				>
					<Close />
				</button>
			</nav>

			<div className="flex flex-col gap-2 pt-14 sm:pt-0">
				{!isLoading && data ? (
					<>
						<div className="w-full rounded p-2 shadow-lg dark:bg-secondary dark:text-white">
							<div className="flex flex-col gap-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<Avatar
											alt={String(
												activeUrlData.data.name,
											)[0].toUpperCase()}
											src={
												new URL(activeUrlData.data.url)
													.protocol +
												"//" +
												new URL(activeUrlData.data.url)
													.host +
												"/favicon.ico"
											}
										/>
										<div className="">
											<p>
												{String(
													activeUrlData.data.name,
												)}
											</p>
											<span className="flex flex-col">
												<a
													href={
														window.location.origin +
														"/" +
														activeUrlData.data
															.shortenedUrl
													}
													target="blank"
													className="text-[10px] text-blue-700"
												>
													<span>
														{window.location
															.origin +
															"/" +
															activeUrlData.data
																.shortenedUrl}
													</span>
												</a>
												<a
													href={
														activeUrlData.data.url
													}
													target="blank"
													className="text-[10px] text-gray-600"
												>
													<span>
														{activeUrlData.data.url}
													</span>
												</a>
											</span>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<button
											className="flex items-center gap-1 rounded p-2 text-sm dark:bg-primary dark:hover:bg-primary/50"
											onClick={() => {
												navigator.clipboard.writeText(
													window.location.origin +
														"/" +
														activeUrlData.data
															.shortenedUrl,
												);
												setCopyUrlText("Copied!");
												setTimeout(() => {
													setCopyUrlText("Copy");
												}, 2000);
											}}
										>
											<ContentCopy fontSize="small" />
											{copyUrlText}
										</button>
										<button className="flex items-center gap-1 rounded p-2 text-sm dark:bg-primary dark:hover:bg-primary/50">
											<EditRounded fontSize="small" />
										</button>
										<button className="flex items-center gap-1 rounded p-2 text-sm dark:bg-primary dark:hover:bg-primary/50">
											<Delete fontSize="small" />
										</button>
									</div>
								</div>
								<hr className="text-primary" />
								<span className="flex items-center gap-1 text-xs">
									<Sell
										sx={{
											fontSize: "0.9rem",
											opacity: "80%",
										}}
									/>
									<strong>&#183;</strong>
									<span className="opacity-60">No Tags</span>
								</span>
							</div>
						</div>

						<div className="w-full rounded p-2 shadow-lg dark:bg-secondary dark:text-white">
							<MapChart data={locationMapData} />
						</div>

						{/*  */}
						<div
							className={` h-full w-full dark:text-white ${
								isLoading
									? ""
									: "grid grid-cols-1 gap-4 lg:grid-cols-2"
							}`}
						>
							<div className="h-full w-full">
								<div className="relative aspect-square rounded-lg p-2 shadow-lg dark:bg-secondary">
									<DoughnutChart data={locationData} />
								</div>
							</div>
						</div>
					</>
				) : (
					<Loading />
				)}
			</div>
		</div>
	);
}
