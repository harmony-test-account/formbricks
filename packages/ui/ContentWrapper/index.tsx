import { cn } from "@formbricks/lib/cn";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentWrapper({ children, className }: ContentWrapperProps) {
  return <div /** __className_a0bdb8 ml-0 mr-[0.0075624px] pl-[23.1562px] pr-[24.7734px] pt-[23.1719px] pb-[97.3047px] */ className={cn("mx-auto max-w-7xl p-6", className)}>{children}</div>;
}
