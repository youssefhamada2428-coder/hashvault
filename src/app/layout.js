import "./globals.css";
import TopNavBar from "@/components/TopNavBar";

export const metadata = {
  title: "HashVault",
  description: "Cryptographic hash generation and management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background font-body-base antialiased min-h-screen flex flex-col relative grid-bg overflow-x-hidden">
        <TopNavBar />
        <main className="flex-grow pt-24 pb-8 px-4 flex flex-col relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
