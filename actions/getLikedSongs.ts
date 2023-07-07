import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getLikedSongs = async (): Promise<Song[]> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	const { error, data } = await supabase.from("liked_songs").select("*, songs(*)").eq("user_id", session?.user.id).order("created_at", { ascending: false });
	// get all columns of "liked_songs" and all columns of "songs" (array)

	if (error) {
		console.log(error);
		return [];
	}

	if (!data) return [];

	return data.map((item) => ({
		...item.songs,
	})); // get only songs
};

export default getLikedSongs;
