import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const useGetSongById = (id?: string) => {
	const { supabaseClient } = useSessionContext();
	const [isLoading, setIsLoading] = useState(false);
	const [song, setSong] = useState<Song | undefined>(undefined);

	useEffect(() => {
		if (!id) return;

		const fetchSong = async () => {
			setIsLoading(true);

			const { error, data } = await supabaseClient.from("songs").select("*").eq("id", id).single();

			if (error) {
				setIsLoading(false);
				toast.error(error.message);
			}

			setSong(data as Song);
			setIsLoading(false);
		};

		fetchSong();
	}, [id, supabaseClient]);

	return useMemo(
		() => ({
			isLoading,
			song,
		}),
		[isLoading, song]
	);
};

export default useGetSongById;
