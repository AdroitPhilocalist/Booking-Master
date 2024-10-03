import { Merriweather } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"]});

export const metadata = {
  title: "Booking Master",
  description: "One Click Hotel Booking Site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={merriweather.className}>{children}</body>
    </html>
  );
}
