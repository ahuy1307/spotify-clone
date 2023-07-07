"use client";
import { Subscription, UserDetails } from "@/types";
import { User } from "@supabase/auth-helpers-nextjs";
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type UserContextTypes = {
	accessToken: string | null;
	user: User | null;
	userDetails: UserDetails | null;
	isLoading: boolean;
	subscription: Subscription | null;
};

export const UserContext = createContext({} as UserContextTypes);

export interface Props {
	[propName: string]: any;
	children: ReactNode;
}

export const useUser = () => {
	return useContext(UserContext);
};

export const UserContextProvider = ({ props, children }: Props) => {
	const { session, isLoading: isLoadingUser, supabaseClient: supabase } = useSessionContext();
	const user = useSupaUser();
	const accessToken = session?.access_token ?? null;
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
	const [subscription, setSubscription] = useState<Subscription | null>(null);

	const getUserDetails = () => supabase.from("users").select("*").single();
	const getSubscriptions = () => supabase.from("subscriptions").select("*, prices(*, product(*))").in("status", ["trialing", "active"]).single();

	useEffect(() => {
		if (user && !isLoadingData && !userDetails && !subscription) {
			setIsLoadingData(true);
			Promise.allSettled([getUserDetails(), getSubscriptions()]).then((results) => {
				const promiseUser = results[0];
				const promiseSubscription = results[1];

				if (promiseUser.status === "fulfilled") {
					setUserDetails(promiseUser.value.data as UserDetails);
				}
				if (promiseSubscription.status === "fulfilled") {
					setSubscription(promiseSubscription.value.data as Subscription);
				}
			});
			setIsLoadingData(false);
		} else if (!user && !isLoadingData && !isLoadingUser) {
			setSubscription(null);
			setUserDetails(null);
		}
	}, [user, isLoadingUser]);

	return <UserContext.Provider value={{ accessToken, user, isLoading: isLoadingData || isLoadingUser, subscription, userDetails }}>{children}</UserContext.Provider>;
};
