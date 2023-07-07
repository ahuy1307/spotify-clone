"use client";

import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import qs from "query-string";
import Input from "./Input";

function SearchInput() {
	const [value, setValue] = useState<string>("");
	const debounceValue = useDebounce<string>(value, 500);
	const router = useRouter();

	useEffect(() => {
		const url = qs.stringifyUrl({
			url: "/search",
			query: { title: value },
		});

		router.push(url);
	}, [debounceValue, router]);

	return <Input value={value} placeholder="What do you want to listen?" onChange={(e) => setValue(e.target.value)} />;
}

export default SearchInput;
