"use client";

import { useState } from "react";

const conversionTools = [
	{
		name: "JPG → WebP",
		description: "Convert JPEG photos to WebP. Up to 34% smaller than JPEG at comparable quality.",
		badge: "Lossy optimized",
		href: "/convert/jpg-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18" />
			</svg>
		),
	},
	{
		name: "PNG → WebP",
		description: "Convert PNG images to WebP format. Dramatically smaller files at the same visual quality.",
		badge: "Lossless source",
		href: "/convert/png-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18" />
			</svg>
		),
	},
	{
		name: "GIF → WebP",
		description: "Convert animated GIFs to WebP. Keeps animation intact with much smaller file sizes.",
		badge: "Animated",
		href: "/convert/gif-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 3h16.5M3.75 21h16.5" />
			</svg>
		),
	},
	{
		name: "HEIC → WebP",
		description: "Convert iPhone HEIC photos to WebP. Works in Chrome and Firefox via WebAssembly.",
		badge: "Cross-browser",
		href: "/convert/heic-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
			</svg>
		),
	},
	{
		name: "AVIF → WebP",
		description: "Convert AVIF images to WebP for broader browser compatibility without sacrificing much quality.",
		badge: "Modern format",
		href: "/convert/avif-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
			</svg>
		),
	},
	{
		name: "BMP → WebP",
		description: "Shrink bloated BMP bitmaps to WebP. Typically 10–20× smaller with no visible quality loss.",
		badge: "Huge savings",
		href: "/convert/bmp-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />
			</svg>
		),
	},
	{
		name: "TIFF → WebP",
		description: "Convert high-resolution TIFF files to web-ready WebP. Great for photography and print assets.",
		badge: "High resolution",
		href: "/convert/tiff-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
			</svg>
		),
	},
	{
		name: "SVG → WebP",
		description: "Rasterize SVG vector graphics to WebP at any resolution. Pick your output dimensions.",
		badge: "Custom size",
		href: "/convert/svg-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
			</svg>
		),
	},
	{
		name: "ICO → WebP",
		description: "Convert Windows ICO icon files to WebP images. Extracts the largest size automatically.",
		badge: "Icon format",
		href: "/convert/ico-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
			</svg>
		),
	},
	{
		name: "JFIF → WebP",
		description: "Convert JFIF images (a JPEG variant) to WebP. Same great compression, wider compatibility.",
		badge: "JPEG variant",
		href: "/convert/jfif-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18" />
			</svg>
		),
	},
	{
		name: "PDF → WebP",
		description: "Extract PDF pages as WebP images. Each page becomes a separate high-quality WebP file.",
		badge: "Per page",
		href: "/convert/pdf-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
			</svg>
		),
	},
	{
		name: "WebP → WebP",
		description: "Re-encode and compress existing WebP files. Squeeze out extra savings without re-uploading.",
		badge: "Re-optimize",
		href: "/convert/webp-to-webp",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
			</svg>
		),
	},
];

const tabs = ["Conversions", "Compress", "Edit", "AI Tools"];

function ToolCard({ name, description, badge, href, icon }: (typeof conversionTools)[0]) {
	return (
		<a
			href={href}
			className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
		>
			<div className="flex items-start justify-between">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-gray-200">
					{icon}
				</div>
				<span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
					{badge}
				</span>
			</div>
			<div className="flex flex-col gap-1">
				<h3 className="text-base font-semibold text-gray-900">{name}</h3>
				<p className="text-sm text-gray-500 leading-relaxed">{description}</p>
			</div>
			<div className="mt-auto rounded-xl bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors group-hover:bg-gray-700">
				Use tool →
			</div>
		</a>
	);
}

export default function Home() {
	const [activeTab, setActiveTab] = useState("Conversions");

	return (
		<main className="max-w-6xl mx-auto px-5 py-16">
			{/* Hero */}
			<div className="text-center mb-14">
				<h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
					Image tools,<br />in your browser.
				</h1>
				<p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed mb-7">
					Free, fast, and completely private. Convert and resize images client-side — nothing is ever uploaded to a server.
				</p>
				<a
					href="#tools"
					className="inline-block rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
				>
					Browse tools
				</a>
			</div>

			{/* Tabs */}
			<div id="tools" className="flex gap-1 border-b border-gray-200 mb-8">
				{tabs.map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
							activeTab === tab
								? "border-gray-900 text-gray-900"
								: "border-transparent text-gray-500 hover:text-gray-700"
						}`}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Cards */}
			{activeTab === "Conversions" && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{conversionTools.map((tool) => (
						<ToolCard key={tool.name} {...tool} />
					))}
				</div>
			)}

			{activeTab !== "Conversions" && (
				<p className="text-gray-400 text-sm py-12 text-center">Coming soon.</p>
			)}
		</main>
	);
}
