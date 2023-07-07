import { useUser } from "@/providers/UserContextProvider";
import { Song } from "@/types";
import useAuth from "./useAuth";
import usePlayer from "./usePlayer";

const useOnPlay = (songs: Song[]) => {
	const authModal = useAuth();
	const player = usePlayer();
	const { user } = useUser();

	const onPlay = (id: string) => {
		if (!user) return authModal.onOpen();

		player.setId(id);
		player.setIds(songs.map((song) => song.id));
	};

	return onPlay;
};

export default useOnPlay;
