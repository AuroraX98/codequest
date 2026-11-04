import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://codequest.aurorax.chatgpt.site"),
  title: "CodeQuest — Learn coding one step at a time",
  description:
    "Learn Python, JavaScript, HTML, CSS, SQL and more with short lessons, explained code examples and hands-on projects. Study online or download lessons for offline use.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
