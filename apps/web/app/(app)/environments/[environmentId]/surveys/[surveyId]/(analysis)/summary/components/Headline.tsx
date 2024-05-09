interface HeadlineProps {
  headline: string;
}

export default function Headline({ headline }: HeadlineProps) {
  return (
    <h3 className="pb-1 text-lg font-semibold text-slate-900 md:text-xl mr-[9px]">
      <span>{headline}</span>
    </h3>
  );
}
