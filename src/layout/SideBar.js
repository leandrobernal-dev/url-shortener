import { Add, Apps, LinkRounded, Menu, QrCode } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SideBar({ isOpen, setIsOpen, toggleNewUrlModalForm }) {
	const [activeNav, setActiveNav] = useState("/app");

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
	return (
		<div
			className={`h-full border-r  border-border bg-secondary px-2 text-white shadow-md ${
				isOpen ? "w-64 " : "w-14"
			}`}
		>
			<div className=" hidden h-14 items-center md:flex">
				<button
					className="p-2"
					onClick={() => setIsOpen((prevState) => !prevState)}
				>
					<Menu />
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
				{navLinks.map((link) => (
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
								router.push(link.href);
								setActiveNav(() => link.href);
							}}
						>
							{link.icon}
							<span
								className={`${
									isOpen
										? ""
										: "absolute left-full ml-4 hidden w-fit whitespace-nowrap rounded-sm bg-slate-300 p-1 text-black shadow-md group-hover:block"
								}  origin-left transition-all ease-in-out `}
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
				))}
			</ul>
			<hr className="my-4 text-slate-500" />
			<button className="w-full rounded-sm bg-primary p-2 hover:bg-primary/70 ">
				<AddIcon /> {isOpen ? "Shortcuts" : ""}
			</button>
		</div>
	);
}
