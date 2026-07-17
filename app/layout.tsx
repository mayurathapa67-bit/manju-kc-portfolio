import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Manju KC — Digital Marketing Specialist & Brand Storyteller",
    template: "%s · Manju KC",
  },
  description:
    "Manju KC helps brands connect with their audience through authentic, data-driven marketing that feels human. Based in Brisbane & Bhaktapur.",
  keywords: [
    "digital marketing",
    "brand storytelling",
    "social media marketing",
    "content strategy",
    "Manju KC",
    "Brisbane marketing",
  ],
  authors: [{ name: "Manju KC" }],
  openGraph: {
    title: "Manju KC — Stories That Move People",
    description:
      "Authentic, data-driven marketing that feels human. Brand strategy, social media, content & campaigns.",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manju KC — Brand Storyteller",
    description: "Marketing that connects, not sells.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-ivory text-charcoal antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
