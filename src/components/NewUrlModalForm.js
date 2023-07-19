import { UserDataContext } from "@/context/UserDataContext";
import { Add, Close } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";

export default function NewUrlModalForm({ open, setOpen }) {
	const [urlTitle, setUrlTitle] = useState("");
	const [isLoadingPageTitle, setIsLoadingPageTitle] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { setData } = useContext(UserDataContext);

	const [formErrors, setFormErrors] = useState({});

	function isValidURL(url) {
		const urlPattern =
			/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)*#?(:~:text=[^\s]*)*$/i;
		return urlPattern.test(url);
	}
	async function handleUrlInputChange(e) {
		const urlInput = e.target.value;
		const validUrl = isValidURL(urlInput);
		if (validUrl) {
			setIsLoadingPageTitle(true);
			fetch("/api/geturltitle?url=" + urlInput)
				.then((response) => {
					if (response.ok) {
						return response.json();
					} else {
						setIsLoadingPageTitle(false);
					}
				})
				.then((data) => {
					setIsLoadingPageTitle(false);
					setUrlTitle(data.title);
				})
				.catch((e) => {
					setIsLoadingPageTitle(false);
					console.log("Error: ", e);
				});
		}
	}

	async function handleNewUrlSubmit(e) {
		e.preventDefault();
		setFormErrors({});
		setIsSubmitting(true);
		const validationError = {};

		const {
			name: { value: name },
			url: { value: url },
			customBackHalf: { value: customBackHalf },
			generateQR: { checked: generateQR },
		} = e.currentTarget.elements;

		console.log(name, url, customBackHalf, generateQR);

		fetch("/api/urls", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				url,
				customBackHalf,
				generateQR,
			}),
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					if (response.status === 403) {
						console.log(response);
						setIsSubmitting(false);
						setFormErrors({
							customBackHalf: "Oops! Back-half already exist",
						});
					}
				}
			})
			.then((data) => {
				console.log(data.newUrl);
				setIsSubmitting(false);
				setData((prevState) => {
					const updatedData = [...prevState];
					updatedData.push(data.newUrl);
					return updatedData;
				});
				setOpen();
			})
			.catch((error) => console.log(error));
	}
	return (
		<>
			{open ? (
				<div
					onClick={(e) => {
						if (
							e.target.getAttribute("aria-label") ===
							"modal-overlay"
						)
							setOpen();
					}}
					aria-label="modal-overlay"
					className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/70 shadow-lg backdrop-blur-sm"
				>
					<form
						onSubmit={handleNewUrlSubmit}
						className="w-11/12 max-w-lg rounded bg-primary p-4 dark:text-white"
					>
						<div className="flex w-full items-center justify-between">
							<h1 className="py-3 text-2xl">Create New</h1>
							<button
								type="button"
								onClick={setOpen}
								className="rounded-sm p-2 dark:hover:bg-secondary"
							>
								<Close />
							</button>
						</div>

						<div className="flex flex-col gap-1 py-2">
							<label htmlFor="url-input">URL Destination</label>
							<input
								required
								name="url"
								type="url"
								id="url-input"
								className="w-full rounded border bg-transparent p-2"
								placeholder="https://website.com/long-url..."
								onChange={handleUrlInputChange}
								autoFocus
							/>
						</div>
						<div className="flex flex-col gap-1 py-2">
							<label
								htmlFor="url-name-input"
								className="flex items-center gap-1"
							>
								Name
								{isLoadingPageTitle ? (
									<CircularProgress size={16} />
								) : (
									""
								)}
							</label>
							<input
								required
								name="name"
								type="text"
								id="url-name-input"
								className="w-full rounded border bg-transparent p-2"
								value={urlTitle}
								onChange={(e) => setUrlTitle(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-1 py-2">
							<label htmlFor="customBackHalf">
								Custom back-half (optional)
							</label>
							<div className="flex items-start gap-4">
								<input
									name=""
									className="w-36 rounded border bg-transparent p-2"
									type="url"
									placeholder="https://link.short/"
									disabled
								/>
								<span className="flex-1">
									<input
										type="text"
										id="customBackHalf"
										className="w-full rounded border bg-transparent p-2"
										placeholder="my-collections..."
										minLength={8}
									/>
									{formErrors.customBackHalf && (
										<p className="mt-2 text-xs text-red-600 dark:text-red-500">
											{formErrors.customBackHalf}
										</p>
									)}
								</span>
							</div>
						</div>
						<div className=" py-2">
							<label className="relative mr-5 inline-flex cursor-pointer items-center">
								<input
									name="generateQR"
									type="checkbox"
									className="peer sr-only"
								/>
								<div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 dark:border-gray-600 dark:bg-gray-700 "></div>
								<span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
									Generate QR Code?
								</span>
							</label>
						</div>
						<div className=" flex justify-end py-2">
							<button
								type="submit"
								className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
							>
								{isSubmitting ? (
									<CircularProgress size={24} />
								) : (
									<>
										<Add />
										Create
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			) : (
				""
			)}
		</>
	);
}
