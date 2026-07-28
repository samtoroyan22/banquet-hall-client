import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "../providers/Providers";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/icons/favicon.svg",
    shortcut: "/icons/favicon.svg",
  },
  title: {
    absolute: "Резервирование банкетов",
    template: "%s | Резервирование банкетов",
  },
  description: "Резервирование банкетых залов в ресторанах",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${geistSans.variable} bg-background antialiased`}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
