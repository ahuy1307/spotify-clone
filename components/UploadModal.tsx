import Modal from "./Modal";
import Input from "./Input";
import useUploadModal from "@/hooks/useUploadModal";

import uniqid from "uniqid";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Button from "./Button";
import toast from "react-hot-toast";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/providers/UserContextProvider";
import { useRouter } from "next/navigation";

function UploadModal() {
	const uploadModal = useUploadModal();
	const [isLoading, setIsLoading] = useState(false);
	const supabase = useSupabaseClient();
	const { session } = useSessionContext();
	const router = useRouter();
	const { reset, register, handleSubmit } = useForm<FieldValues>({
		defaultValues: {
			author: "",
			title: "",
			song: null,
			image: null,
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = async (values) => {
		try {
			setIsLoading(true);

			const songFile = values.song?.[0];
			const imageFile = values.image?.[0];
			const uniqedId = uniqid();
			if (!songFile || !imageFile || !session?.user) {
				toast.error("Missing field!");
				return;
			}
			//Upload songs to bucket
			const { data: songData, error: songError } = await supabase.storage.from("songs").upload(`song-${values.title}-${uniqedId}`, songFile, {
				cacheControl: "3600",
				upsert: false,
			});

			if (songError) {
				setIsLoading(false);
				return toast.error("Failed song upload!");
			}

			//Upload image to bucket
			const { data: imageData, error: imageError } = await supabase.storage.from("images").upload(`image-${values.title}-${uniqedId}`, imageFile, {
				cacheControl: "3600",
				upsert: false,
			});

			if (imageError) {
				setIsLoading(false);
				return toast.error("Failed image upload!");
			}

			//Insert to songs table
			const { error: supabaseError } = await supabase.from("songs").insert({
				user_id: session?.user?.id,
				title: values.title,
				author: values.author,
				song_path: songData?.path,
				image_path: imageData?.path,
			});

			if (supabaseError) {
				setIsLoading(false);
				return toast.error("Failed upload song");
			}

			router.refresh();
			reset();
			setIsLoading(false);
			uploadModal.onClose();
			toast.success("Create song successfully!");
		} catch (error) {
			toast.error("Some thing wents wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			title="Add a song"
			description="Upload an mp3 file"
			isOpen={uploadModal.isOpen}
			onChange={() => {
				if (uploadModal.isOpen) {
					reset();
					uploadModal.onClose();
				}
			}}>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
				<Input disabled={isLoading} id="title" placeholder="Song title" {...register("title", { required: true })} />
				<Input disabled={isLoading} id="author" placeholder="Song author" {...register("author", { required: true })} />
				<div>
					<div className="pb-1">Select a song file</div>
					<Input disabled={isLoading} id="song" {...register("song", { required: true })} type="file" accept=".mp3" />
				</div>
				<div>
					<div className="pb-1">Select a image file</div>
					<Input disabled={isLoading} id="image" {...register("image", { required: true })} type="file" accept="image/*" />
				</div>
				<Button disabled={isLoading} type="submit">
					Create
				</Button>
			</form>
		</Modal>
	);
}

export default UploadModal;
