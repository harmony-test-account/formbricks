import { fonts } from "@/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { HarmonySetup } from "harmony-ai-editor";
import { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Formbricks",
    default: "Formbricks",
  },
  description: "Open-Source Survey Suite",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {process.env.VERCEL === "1" && <SpeedInsights sampleRate={0.1} />}
      <body className={`flex h-screen flex-col ${fonts[0].id}`}>
        {children}
        <HarmonySetup repositoryId="b50578e5-4a0c-4f3b-ba15-61c0f7be186c" fonts={fonts} />
      </body>
    </html>
  );
}
