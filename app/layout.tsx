import "./globals.css";
import { Figtree } from "next/font/google";
import SideBar from "@/components/SideBar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import { UserContextProvider } from "@/providers/UserContextProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongByUserId from "@/actions/getSongByUserId";
import Player from "@/components/Player";
import getActiveProductsWithPrices from "@/actions/getActiveProductsWithPrices";
const inter = Figtree({ subsets: ["latin"] });

export const metadata = {
	title: "Spotify Clone",
	description: "Listen to music",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const songs = await getSongByUserId();
	const products = await getActiveProductsWithPrices();
	return (
		<html lang="en">
			<body className={inter.className}>
				<SupabaseProvider>
					<ToasterProvider />
					<UserContextProvider>
						<ModalProvider products={products} />
						<SideBar songs={songs}>{children}</SideBar>
						<Player />
					</UserContextProvider>
				</SupabaseProvider>
			</body>
		</html>
	);
}
