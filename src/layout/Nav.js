import ThemeToggle from "@/theme/ThemeToggle";
import { Menu } from "@mui/icons-material";

export default function Nav({ setIsOpen, height, sideBarOpen }) {
	return (
		<nav
			className={`fixed left-0 ${
				sideBarOpen ? "md:left-64" : "md:left-14"
			} right-0 top-0 z-10 flex w-full h-${height} items-center border-b px-2 shadow dark:border-border dark:bg-secondary dark:text-white`}
		>
			<div className="flex h-14 items-center md:hidden">
				<button
					className="p-2"
					onClick={() => setIsOpen((prevState) => !prevState)}
				>
					<Menu />
				</button>
			</div>
			<ThemeToggle />
		</nav>
	);
}
