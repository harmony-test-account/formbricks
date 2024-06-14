interface HeadlineProps {
  headline: string;
}

export default function Headline({ headline }: HeadlineProps) {
  return (
    <h3 className="pb-1 text-lg font-semibold text-slate-900 md:text-xl">
      <span className="text-2xl">{headline}</span>
    </h3>
  );
}
