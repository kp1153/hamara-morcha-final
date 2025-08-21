import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title:
    "खुद कामता प्रसाद यानि कि https://www.web-developer-kp.com/ ने  इस वेबसाइट को नेक्स्ट.जेए पर विकसित किया है, जो पेशेवर वेब-डेवलपर हैं।",
  description:
    "हम लेटेस्ट टेक्नोलॉजी पर बनाते हैं, ऐसी वेबसाइट जिस पर नहीं आता कोई सालाना खर्च, इसी टेक्नोलॉजी पर बना है हमारा मोर्चा",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
