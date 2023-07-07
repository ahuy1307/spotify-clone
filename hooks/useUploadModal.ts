import { create } from "zustand";
import useAuth from "./useAuth";

interface Props {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useUploadModal = create<Props>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default useUploadModal;
