import "./globals.css";
import { Figtree } from "next/font/google";
import SideBar from "@/components/SideBar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import { UserContextProvider } from "@/providers/UserContextProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongByUserId from "@/actions/getSongByUserId";
import Player from "@/components/Player";
const inter = Figtree({ subsets: ["latin"] });

export const metadata = {
	title: "Spotify Clone",
	description: "Listen to music",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const songs = await getSongByUserId();
	return (
		<html lang="en">
			<body className={inter.className}>
				<SupabaseProvider>
					<ToasterProvider />
					<UserContextProvider>
						<ModalProvider />
						<SideBar songs={songs}>{children}</SideBar>
						<Player />
					</UserContextProvider>
				</SupabaseProvider>
			</body>
		</html>
	);
}
