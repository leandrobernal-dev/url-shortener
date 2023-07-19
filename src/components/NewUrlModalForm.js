import { Add, Close } from "@mui/icons-material";

export default function NewUrlModalForm({ open, setOpen }) {
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
					<form className="w-full max-w-lg rounded bg-primary p-4 dark:text-white">
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
						<div className="container py-2">
							<label htmlFor="url-input">URL Destination</label>
							<input
								required
								name="url"
								type="url"
								id="url-input"
								className="w-full rounded border bg-transparent p-2"
								placeholder="https://website.com/long-url..."
							/>
						</div>
						<div className="container py-2">
							<label htmlFor="url-name-input">Name</label>
							<input
								required
								name="name"
								type="text"
								id="url-name-input"
								className="w-full rounded border bg-transparent p-2"
							/>
						</div>
						<div className="container py-2">
							<label htmlFor="url-back-half-input">
								Custom back-half (optional)
							</label>
							<div className="flex items-center gap-4">
								<input
									name="custom-back-half"
									className="w-36 rounded border bg-transparent p-2"
									type="url"
									placeholder="https://link.short"
									disabled
								/>
								<span>/</span>
								<input
									type="text"
									id="url-back-half-input"
									className="flex-1 rounded border bg-transparent p-2"
								/>
							</div>
						</div>
						<div className="container py-2">
							<label className="relative mr-5 inline-flex cursor-pointer items-center">
								<input
									name="generate-qr-code"
									type="checkbox"
									value=""
									className="peer sr-only"
								/>
								<div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 dark:border-gray-600 dark:bg-gray-700 "></div>
								<span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
									Generate QR Code?
								</span>
							</label>
						</div>
						<div className="container flex justify-end py-2">
							<button
								type="submit"
								className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
							>
								<Add />
								Create
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
