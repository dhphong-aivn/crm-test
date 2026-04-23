import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Pro — Sales Intelligence",
  description:
    "Hệ thống quản trị khách hàng thông minh được thiết kế để mang lại sự tinh tế và hiệu quả cho quy trình bán hàng.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=block"
        />
      </head>
      <body className="min-h-screen bg-parchment text-near-black font-body">
        {children}
      </body>
    </html>
  );
}
