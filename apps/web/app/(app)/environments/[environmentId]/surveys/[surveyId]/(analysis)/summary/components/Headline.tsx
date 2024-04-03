interface HeadlineProps {
  headline: string;
}

export default function Headline({ headline }: HeadlineProps) {
  return (
    <h3 className="text-lg font-semibold text-slate-900 md:text-xl -ml-px mr-0 pl-[62.4297px] pt-[2.24219px] pb-[1.75px]">
      <span>{headline}</span>
    </h3>
  );
}
