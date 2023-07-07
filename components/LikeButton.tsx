"use client";

import useAuth from "@/hooks/useAuth";
import { useUser } from "@/providers/UserContextProvider";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface Props {
	songId: string;
}
function LikeButton({ songId }: Props) {
	const supabase = useSupabaseClient();
	const authModal = useAuth();
	const { user } = useUser();
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		if (!user?.id) return;

		const fetchData = async () => {
			const { data, error } = await supabase.from("liked_songs").select("*").eq("user_id", user.id).eq("song_id", songId).single();

			if (!error && data) setIsLiked(true);
		};

		fetchData();
	}, [user?.id, songId, supabase]);

	const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

	const handleLike = async () => {
		if (!user?.id) {
			authModal.onOpen();
			return;
		}

		if (isLiked) {
			const { error } = await supabase.from("liked_songs").delete().eq("song_id", songId);

			if (error) {
				toast.error(error.message);
			} else {
				setIsLiked(false);
			}
		} else {
			const { error } = await supabase.from("liked_songs").insert({
				song_id: songId,
				user_id: user?.id,
			});

			if (error) {
				toast.error(error.message);
			} else {
				setIsLiked(true);
				toast.success("Liked!");
			}
		}
		router.refresh();
	};

	return (
		<button
			className="
        cursor-pointer 
        hover:opacity-75 
        transition
      "
			onClick={handleLike}>
			<Icon color={isLiked ? "#22c55e" : "white"} size={25} />
		</button>
	);
}

export default LikeButton;
