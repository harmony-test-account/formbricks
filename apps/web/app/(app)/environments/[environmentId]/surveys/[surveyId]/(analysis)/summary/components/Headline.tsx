interface HeadlineProps {
  headline: string;
}

export default function Headline({ headline }: HeadlineProps) {
  return (
    <h3 className="pb-1 text-lg font-semibold text-slate-900 md:text-xl">
      /*Change inner text for span tag from You did it, Yay 🎉 to You did it, Yay! 🎉*/<span>{headline}</span>
    </h3>
  );
}
