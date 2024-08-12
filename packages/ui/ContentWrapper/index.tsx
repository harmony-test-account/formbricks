import { cn } from "@formbricks/lib/cn";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentWrapper({ children, className }: ContentWrapperProps) {
  return <div className={cn("max-w-7xl p-6 mx-0", className)}>{children}</div>;
}
