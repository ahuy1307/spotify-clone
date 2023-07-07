"use client";

import { ReactNode, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types_db";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

interface Props {
	children: ReactNode;
}

const SupaBaseProvider = ({ children }: Props) => {
	const [supabaseClient] = useState(() => createClientComponentClient<Database>());
	return <SessionContextProvider supabaseClient={supabaseClient}>{children}</SessionContextProvider>;
};

export default SupaBaseProvider;
