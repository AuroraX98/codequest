import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://codequest.aurorax.chatgpt.site"),
  title: "CodeQuest — Learn coding one step at a time",
  description:
    "Learn to code with short lessons in Python, HTML, CSS and more. Search by lesson title, tap a word for help, and try what you learn in quizzes and small projects.",
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
