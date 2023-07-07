import { create } from "zustand";

interface Props {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useAuth = create<Props>((set) => ({
	isOpen: true,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default useAuth;
