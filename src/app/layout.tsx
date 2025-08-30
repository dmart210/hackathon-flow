import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wagamama Smart Kitchen",
  description: "AI-powered waste management with FlowGlad integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="antialiased">
          {children}
        </div>
      </body>
    </html>
  );
}
