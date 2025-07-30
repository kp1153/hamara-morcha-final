import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "न्यूज पोर्टल 'हमारा मोर्चा'",
  description: "हमारा मोर्चा फाउंडेशन द्वारा संचालित",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
