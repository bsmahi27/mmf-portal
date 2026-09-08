import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/state";
import { DrawerProvider } from "@/lib/drawer";

export const metadata: Metadata = {
  title: "MM Factory Portal — MVP",
  description: "Mid-Market Factory Portal — NCE · MVP prototype",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <DrawerProvider>{children}</DrawerProvider>
        </AppProvider>
      </body>
    </html>
  );
}
