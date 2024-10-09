import { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "@/src/styles/ThemeRegistry";
import TanstackProvider from "@/src/provider/TanstackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Designare",
  description:
    "Designare is a powerful no-code platform that empowers anyone to create professional-looking websites without writing a single line of code. Drag-and-drop components, customize themes, and publish your site in minutes. Elevate your online presence with Designare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <ThemeRegistry>
          <TanstackProvider>{children}</TanstackProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
