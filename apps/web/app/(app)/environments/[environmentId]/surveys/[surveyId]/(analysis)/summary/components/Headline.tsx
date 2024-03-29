interface HeadlineProps {
  headline: string;
}

export default function Headline({ headline }: HeadlineProps) {
  return (
    <h3 className="text-lg font-semibold text-slate-900 md:text-xl ml-[25px] py-0.5">
      <span>{headline}</span>
    </h3>
  );
}
