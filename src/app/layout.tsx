import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import "./globals.css";

const alteHaas = localFont({
	src: [
		{ path: "../../public/AlteHaasGroteskRegular.ttf", weight: "400", style: "normal" },
		{ path: "../../public/AlteHaasGroteskBold.ttf", weight: "700", style: "normal" },
	],
	variable: "--font-nexa",
});

export const metadata: Metadata = {
	title: "PixGarage — Image Tools",
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
			<body className={`${alteHaas.variable} font-sans antialiased bg-white text-gray-900`}>
				<Header />
				{children}
			</body>
		</html>
	);
}
