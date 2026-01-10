
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import "../styles/global.scss";
import localFont from "next/font/local";
import { Bungee } from "next/font/google";
import { CoinsLayout } from "../components/CoinsLayout/CoinsLayout";
import CloudReveal from "../utils/CloudReveal/CloudReveal";

const pocketMonk = localFont({
  src: "./fonts/pocket-monk.woff2",
  display: "swap",
});

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bungee",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pocketMonk.className} ${bungee.variable}`}>
        <div className="appContent">
          <Header />
          <CoinsLayout />
          {children} 
          <CloudReveal />
        </div>
        <Footer />
      </body>
    </html>
  );
}
