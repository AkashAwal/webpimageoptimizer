"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const toolCategories = [
	{
		label: "Compress",
		tools: ["Compress JPG", "Compress PNG", "Compress WebP", "Compress GIF", "Compress to target size", "Bulk compress"],
	},
	{
		label: "Convert",
		tools: ["JPG to PNG", "PNG to JPG", "Convert to WebP", "WebP to JPG", "Convert to AVIF", "HEIC to JPG", "PNG to SVG", "Image to PDF"],
	},
	{
		label: "Edit",
		tools: ["Resize", "Crop", "Rotate & Flip", "Add Watermark", "Add Text", "Filters & Effects", "Round Corners"],
	},
	{
		label: "AI Tools",
		tools: ["Background Remover", "AI Upscaler", "Object Eraser", "Photo Restoration", "Colorize", "Auto Alt-Text"],
	},
];

export default function Header() {
	const [toolsOpen, setToolsOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
			<div className="px-6 h-20 flex items-center justify-between relative">
				{/* Logo */}
				<a href="/" className="flex items-center select-none flex-shrink-0">
					<Image
						src="/hori-logo-svg.svg"
						alt="Image Garage"
						width={200}
						height={50}
						className="h-20 w-auto"
						priority
					/>
				</a>

				{/* Nav — absolutely centered */}
				<nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
					{/* Quick links */}
					{[
						{ label: "Compress", href: "#" },
						{ label: "Resize", href: "#" },
						{ label: "Convert", href: "#" },
					].map(({ label, href }) => (
						<a
							key={label}
							href={href}
							className="px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
						>
							{label}
						</a>
					))}

					{/* Tools dropdown */}
					<div className="relative">
						<button
							onClick={() => setToolsOpen(!toolsOpen)}
							onBlur={() => setTimeout(() => setToolsOpen(false), 150)}
							className="flex items-center gap-1 px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
						>
							Tools
							<ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
						</button>

						{toolsOpen && (
							<div className="absolute top-full left-0 mt-1.5 w-[600px] bg-white border border-gray-100 rounded-2xl shadow-lg p-4 grid grid-cols-2 gap-4">
								{toolCategories.map((cat) => (
									<div key={cat.label}>
										<p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-1">{cat.label}</p>
										<div className="space-y-0.5">
											{cat.tools.map((tool) => (
												<a
													key={tool}
													href="#"
													className="block px-2.5 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
												>
													{tool}
												</a>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Divider */}
					<div className="w-px h-4 bg-gray-200 mx-1" />

					{[
						{ label: "Features", href: "#" },
						{ label: "Contact", href: "#" },
					].map(({ label, href }) => (
						<a
							key={label}
							href={href}
							className="px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
						>
							{label}
						</a>
					))}
				</nav>
			</div>
		</header>
	);
}
