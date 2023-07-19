"use client";

import DoughnutChart from "@/components/DoughnutChart";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UrlDetails() {
	const params = useParams();
	const urlId = String(params.url);

	const [isLoading, setIsLoading] = useState(true);

	const [activeUrlData, setActiveUrlData] = useState({});
	const [locationData, setLocationData] = useState({
		labels: [],
		values: [],
		colors: ["#ff6384", "#36a2eb", "#ffce56"],
	});

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
		setLocationData(updatedLocationData);
	}, [activeUrlData]);

	return (
		<div
			className={` h-full w-full p-2 dark:text-white ${
				isLoading ? "" : "grid grid-cols-1 gap-4 lg:grid-cols-2"
			}`}
		>
			{isLoading ? (
				<Loading />
			) : (
				<div className="container relative aspect-square rounded-lg p-2 shadow-lg dark:bg-secondary">
					<DoughnutChart data={locationData} />
				</div>
			)}
		</div>
	);
}
