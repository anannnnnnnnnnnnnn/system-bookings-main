import localFont from "next/font/local";
import "./globals.css";
import { ConfigProvider } from "antd";
import 'antd/dist/reset.css';

// กำหนดฟอนต์ที่คุณใช้งาน
const geistSans = localFont({
  src: "/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const kanitFont = localFont({
  src: "/fonts/Kanit-Regular.ttf",
  variable: "--font-kanit",
  weight: "100 900",
});
const sarabunFont = localFont({
  src: "/fonts/Sarabun-Regular.ttf",
  variable: "--font-sarabun", // ใช้ชื่อที่ตรงนี้
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kanitFont.variable} ${sarabunFont.variable} antialiased`} // เพิ่มฟอนต์ Sarabun
      >
        <ConfigProvider theme={{ token: { fontFamily: 'var(--font-kanit)', }, }} // ใช้ฟอนต์ Sarabun ใน theme
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
