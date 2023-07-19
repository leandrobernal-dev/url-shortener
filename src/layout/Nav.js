import ThemeToggle from "@/theme/ThemeToggle";

export default function Nav() {
	return (
		<nav className="h-14  border-b shadow dark:border-border dark:bg-secondary dark:text-white">
			<ThemeToggle />
		</nav>
	);
}
