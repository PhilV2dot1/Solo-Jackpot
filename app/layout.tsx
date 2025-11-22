import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://solo-jackpot.vercel.app";

export const metadata: Metadata = {
  title: "Solo Jackpot - Crypto Jackpot on Celo",
  description: "Spin the wheel and win on Celo blockchain! Test your luck with our crypto jackpot game featuring BTC, ETH, XRP, and more.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Solo Jackpot - Spin & Win on Celo",
    description: "Test your luck with our crypto jackpot game on Celo blockchain",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Solo Jackpot - Crypto Casino Game",
      },
    ],
    type: "website",
    siteName: "Solo Jackpot",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solo Jackpot - Crypto Jackpot on Celo",
    description: "Spin the wheel and win on Celo blockchain!",
    images: [`${baseUrl}/og-image.png`],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  other: {
    // Farcaster Mini App Frame metadata
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${baseUrl}/og-image.png`,
      button: {
        title: "Play Now",
        action: {
          type: "launch_miniapp",
          name: "Solo Jackpot",
          url: baseUrl,
        },
      },
    }),
    // Frame metadata for backwards compatibility
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${baseUrl}/og-image.png`,
      button: {
        title: "Play Now",
        action: {
          type: "launch_miniapp",
          name: "Solo Jackpot",
          url: baseUrl,
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
