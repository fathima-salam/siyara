import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Siyara | Hijab Store",
  description: "Modest fashion for every occasion. Premium hijabs, scarves, shawls & abayas at Siyara.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
