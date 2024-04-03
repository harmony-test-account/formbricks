import { cn } from "@formbricks/lib/cn";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentWrapper({ children, className }: ContentWrapperProps) {
  return <div /** ml-0 mr-[0.0002501px] pt-12 px-0 */ className={cn("mx-auto max-w-7xl p-6", className)}>{children}</div>;
}
