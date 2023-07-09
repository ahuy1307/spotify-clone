"use client";

import AuthModal from "@/components/AuthModal";
import SubscribeModal from "@/components/SubscribeModal";
import UploadModal from "@/components/UploadModal";
import { ProductWithPrice } from "@/types";
import { useEffect, useState } from "react";

function ModalProvider({ products }: { products: ProductWithPrice[] }) {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => setIsMounted(true), []);

	if (!isMounted) return null;

	return (
		<>
			<AuthModal></AuthModal>
			<UploadModal />
			<SubscribeModal products={products} />
		</>
	);
}

export default ModalProvider;
