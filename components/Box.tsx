import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
	children: ReactNode;
	className?: string;
};
function Box({ children, className }: Props) {
	return <div className={twMerge(`bg-neutral-900 rounded-lg h-fit  w-full`, className)}>{children}</div>;
}

export default Box;
