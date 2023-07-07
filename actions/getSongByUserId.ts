import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getSongByUserId = async (): Promise<Song[]> => {
	const supabase = await createServerComponentClient({
		cookies: cookies,
	});

	const { error: sessionError, data: sessionData } = await supabase.auth.getSession();

	if (sessionError) {
		console.log(sessionError);
		return [];
	}

	const { data, error } = await supabase.from("songs").select("*").eq("user_id", sessionData.session?.user.id).order("created_at", { ascending: false });

	if (error) {
		console.log(error);
	}

	return (data as any) || [];
};

export default getSongByUserId;
