"use client";

import Nav from "@/layout/Nav";
import SideBar from "@/layout/SideBar";
import { Suspense, useEffect, useState } from "react";
import NewUrlModalForm from "@/components/NewUrlModalForm";
import Loading from "@/components/Loading";

export default function AppLayout({ children }) {
	const [sideBarIsOpen, setSideBarIsOpen] = useState(true);

	useEffect(() => {
		setSideBarIsOpen(() => (window.innerWidth < 1280 ? false : true));
		window.addEventListener("resize", handleSideBarToggle);
		return () => {
			window.removeEventListener("resize", handleSideBarToggle);
		};
	}, []);
	function handleSideBarToggle() {
		setSideBarIsOpen(() => (window.innerWidth < 1280 ? false : true));
	}

	const [newUrlModalOpen, setNewUrlModalOpen] = useState(false);
	function toggleNewUrlModal() {
		handleSideBarToggle();
		setNewUrlModalOpen((prevState) => !prevState);
	}

	return (
		<div className={`flex h-screen`}>
			<SideBar
				handleSideBarToggle={handleSideBarToggle}
				toggleNewUrlModalForm={toggleNewUrlModal}
				isOpen={sideBarIsOpen}
				setIsOpen={setSideBarIsOpen}
			/>

			<div className="z-0 flex h-screen flex-1 flex-col">
				<Nav setIsOpen={setSideBarIsOpen} />
				<div className="h-full flex-1 border-b dark:text-white">
					<Suspense fallback={<Loading />}>{children}</Suspense>
				</div>
			</div>

			<NewUrlModalForm
				open={newUrlModalOpen}
				setOpen={toggleNewUrlModal}
			/>
		</div>
	);
}
