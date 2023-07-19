"use client";

import Nav from "@/layout/Nav";
import SideBar from "@/layout/SideBar";
import { useEffect, useState } from "react";
import NewUrlModalForm from "@/components/NewUrlModalForm";

export default function AppLayout({ children }) {
	const [sideBarIsOpen, setSideBarIsOpen] = useState(true);

	useEffect(() => {
		setSideBarIsOpen(() => (window.innerWidth < 1200 ? false : true));
		window.addEventListener("resize", handleWindowResize);
		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, []);
	function handleWindowResize() {
		setSideBarIsOpen(() => (window.innerWidth < 1200 ? false : true));
	}

	const [newUrlModalOpen, setNewUrlModalOpen] = useState(false);
	function toggleNewUrlModal() {
		setNewUrlModalOpen((prevState) => !prevState);
	}

	return (
		<div className={`flex h-screen`}>
			<SideBar
				toggleNewUrlModalForm={toggleNewUrlModal}
				isOpen={sideBarIsOpen}
				setIsOpen={setSideBarIsOpen}
			/>

			<div className="flex h-screen flex-1 flex-col">
				<Nav />
				<div className="h-full flex-1 border-b dark:text-white">
					{/* <Suspense fallback={<Loading />}></Suspense> */}
					{children}
				</div>
			</div>
			<NewUrlModalForm
				open={newUrlModalOpen}
				setOpen={toggleNewUrlModal}
			/>
		</div>
	);
}
