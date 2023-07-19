import { Apps, Close, LinkRounded, Menu, QrCode } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function SideBar({
	isOpen,
	setIsOpen,
	toggleNewUrlModalForm,
	handleSideBarToggle,
}) {
	const pathname = usePathname();
	const router = useRouter();
	const navLinks = [
		{ name: "Dashboard", href: "/app", icon: <Apps /> },
		{
			name: "Links",
			href: "/app/links",
			icon: <LinkRounded />,
		},
		{
			name: "QR Codes",
			href: "/app/qrcodes",
			icon: <QrCode />,
		},
	];
	const currentPath = () => {
		function calculateJaccardSimilarity(arr1, arr2) {
			const set1 = new Set(arr1);
			const set2 = new Set(arr2);
			const intersectionSize = new Set(
				[...set1].filter((item) => set2.has(item)),
			).size;
			const unionSize = new Set([...set1, ...set2]).size;
			return intersectionSize / unionSize;
		}

		const currentPath = pathname.split("/").filter(Boolean);
		currentPath.unshift("/");
		const paths = navLinks.map((link) => {
			const targetPath = link.href.split("/").filter(Boolean);
			targetPath.unshift("/");
			return targetPath;
		});

		const active = paths
			.map((href, index) => ({
				index: index,
				similarity: calculateJaccardSimilarity(currentPath, href),
			}))
			.reduce((prev, current) =>
				current.similarity > prev.similarity ? current : prev,
			).index;
		return navLinks[active].href;
	};

	const [activeNav, setActiveNav] = useState(currentPath);

	return (
		<div
			className={`fixed left-0  top-0 z-10 h-full w-full bg-secondary px-2 text-white shadow-md md:relative md:border-r md:border-border 
				${isOpen ? "" : "hidden md:block"} 
				md:${isOpen ? "w-64" : "w-14"}`}
		>
			<div className="flex h-14 items-center">
				<button
					className="p-2"
					onClick={() => setIsOpen((prevState) => !prevState)}
				>
					<Menu className="hidden md:block" />
					<Close className="block md:hidden" />
				</button>
			</div>
			<button
				onClick={toggleNewUrlModalForm}
				className="w-full rounded-sm bg-primary p-2 hover:bg-primary/70 "
			>
				<AddIcon /> {isOpen ? "Create new" : ""}
			</button>
			<hr className="my-4 text-slate-500" />
			<ul className="flex flex-col gap-2">
				{navLinks.map((link) => {
					return (
						<li
							key={link.name + link.href}
							className={`group relative flex`}
						>
							<button
								className={`${
									activeNav === link.href
										? "bg-primary text-white"
										: ""
								} relative z-10 flex h-full  w-full items-center gap-1 rounded-sm p-2 hover:bg-primary/70`}
								onClick={() => {
									handleSideBarToggle();
									router.push(link.href);
									setActiveNav(() => link.href);
								}}
							>
								{link.icon}
								<span
									className={`${
										isOpen
											? ""
											: "whitespace-nowrap rounded-sm p-1 md:absolute md:left-full md:ml-4 md:hidden md:bg-slate-300 md:text-black md:shadow-md md:group-hover:block"
									}  origin-left`}
								>
									{link.name}
								</span>
								<span
									className={`absolute bottom-0 left-0 top-0 w-1 bg-slate-700  ${
										activeNav === link.href ? "" : "hidden"
									}`}
								></span>
							</button>
						</li>
					);
				})}
			</ul>
			<hr className="my-4 text-slate-500" />
			<button className="w-full rounded-sm bg-primary p-2 hover:bg-primary/70 ">
				<AddIcon /> {isOpen ? "Shortcuts" : ""}
			</button>
		</div>
	);
}
