"use client";

import useAuth from "@/hooks/useAuth";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Modal from "./Modal";

function AuthModal() {
	const { isOpen, onClose } = useAuth();
	const supabaseClient = useSupabaseClient();
	const router = useRouter();
	const { session } = useSessionContext();

	useEffect(() => {
		if (session) {
			router.refresh();
			onClose();
		}
	}, [session, router, onClose]);

	return (
		<Modal
			title="Welcom back"
			description="Login to your account"
			onChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
			isOpen={isOpen}>
			<Auth
				supabaseClient={supabaseClient}
				magicLink
				appearance={{
					theme: ThemeSupa,
					variables: {
						default: {
							colors: {
								brand: "#404040",
								brandAccent: "#22c55e",
							},
						},
					},
				}}
				providers={["google", "github"]}
				theme="dark"
			/>
		</Modal>
	);
}

export default AuthModal;
