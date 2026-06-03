import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: "Image Garage — Image Tools",
	description: "Fast, free image compression, conversion and editing tools.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className={`${inter.variable} antialiased bg-white text-gray-900`}>
				<Header />
				{children}
			</body>
		</html>
	);
}
