"use client";

import Nav from "@/layout/Nav";
import SideBar from "@/layout/SideBar";
import { Suspense, useEffect, useState } from "react";
import NewUrlModalForm from "@/components/NewUrlModalForm";
import Loading from "@/components/Loading";
import UserDataContextProvider from "@/context/UserDataContext";

export default function AppLayout({ children }) {
	const [sideBarIsOpen, setSideBarIsOpen] = useState(true);

	const [data, setData] = useState({});
	const [activeLink, setActiveLink] = useState("");

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
	const [sideBarWidth, setSideBarWidth] = useState("64");
	useEffect(() => {
		setSideBarWidth(sideBarIsOpen ? "64" : "14");
	}, [sideBarIsOpen]);

	const navHeight = "14";

	return (
		<UserDataContextProvider
			value={{ activeLink, setActiveLink, data, setData, sideBarIsOpen }}
		>
			<div
				className={`pl-0 pt-14
				${sideBarIsOpen ? "md:pl-64" : "md:pl-14"}
			`}
			>
				<SideBar
					width={sideBarWidth}
					handleSideBarToggle={handleSideBarToggle}
					toggleNewUrlModalForm={toggleNewUrlModal}
					isOpen={sideBarIsOpen}
					setIsOpen={setSideBarIsOpen}
				/>

				<div className={`z-0`}>
					<Nav
						sideBarOpen={sideBarIsOpen}
						sideBarWidth={sideBarWidth}
						height={navHeight}
						setIsOpen={setSideBarIsOpen}
					/>
					<div className={`dark:text-white`}>
						<Suspense fallback={<Loading />}>{children}</Suspense>
					</div>
				</div>

				<NewUrlModalForm
					open={newUrlModalOpen}
					setOpen={toggleNewUrlModal}
				/>
			</div>
		</UserDataContextProvider>
	);
}
