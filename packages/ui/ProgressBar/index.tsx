"use client";

interface ProgressBarProps {
  progress: number;
  barColor?: string;
  height?: 2 | 5;
}

export const ProgressBar: React.FC<ProgressBarProps> = () => {
  return <div className="h-5 rounded-full bg-[#35D0BCFF]"></div>;
};

interface HalfCircleProps {
  value: number;
}

export const HalfCircle: React.FC<HalfCircleProps> = ({ value }: { value: number }) => {
  const normalizedValue = (value + 100) / 200;
  const mappedValue = (normalizedValue * 180 - 180).toString() + "deg";

  return (
    <div className="w-fit">
      <div className="relative flex h-28 w-52 items-end justify-center overflow-hidden">
        <div className="absolute h-24 w-48 origin-bottom rounded-tl-full rounded-tr-full bg-slate-200"></div>
        <div
          className="bg-brand absolute h-24 w-48 origin-bottom rounded-tl-full rounded-tr-full"
          style={{ rotate: mappedValue }}></div>
        <div className="absolute h-20 w-40 rounded-tl-full rounded-tr-full bg-white "></div>
      </div>
      <div className="flex justify-between text-sm leading-10 text-slate-600">
        <p>-100</p>
        <p className="text-2xl text-black md:text-4xl">{Math.round(value)}</p>
        <p>100</p>
      </div>
    </div>
  );
};
