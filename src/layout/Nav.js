import ThemeToggle from "@/theme/ThemeToggle";
import { Menu } from "@mui/icons-material";

export default function Nav({ setIsOpen }) {
	return (
		<nav className="flex h-14 border-b px-2 shadow dark:border-border dark:bg-secondary dark:text-white">
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
