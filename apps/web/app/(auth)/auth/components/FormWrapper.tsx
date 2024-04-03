import { Logo } from "@formbricks/ui/Logo";

export default function FormWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex flex-1 flex-col px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 justify-end pl-[95.9922px] pr-24 pt-[25.0234px] pb-[25.0469px]">
      <div className="mx-auto w-full max-w-sm rounded-xl bg-white p-8 shadow-xl lg:w-96">
        <div className="mb-8 text-center">
          <Logo className="mx-auto w-3/4" />
        </div>
        {children}
      </div>
    </div>
  );
}
