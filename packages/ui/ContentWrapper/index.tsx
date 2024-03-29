import { cn } from "@formbricks/lib/cn";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentWrapper({ children, className }: ContentWrapperProps) {
  return <div /** mx-0 pl-0 pr-[24.0417px] pt-12 */ className={cn("mx-auto max-w-7xl p-6", className)}>{children}</div>;
}
