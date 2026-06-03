"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
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

const quickLinks = [
	{ label: "Compress", href: "/compress" },
	{ label: "Resize", href: "/resize" },
	{ label: "Convert", href: "/convert" },
];

const secondaryLinks = [
	{ label: "Features", href: "/features" },
	{ label: "Contact", href: "/contact" },
];

function NavLink({ label, href, pathname }: { label: string; href: string; pathname: string }) {
	const isActive = pathname === href;
	return (
		<a
			href={href}
			className={`relative px-3.5 py-2 text-base font-semibold transition-colors duration-200 group
				${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
		>
			{label}
			{/* Left-to-right sweep underline */}
			<span className={`absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 origin-left transition-transform duration-300 ease-out
				${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
			/>
		</a>
	);
}

export default function Header() {
	const [toolsOpen, setToolsOpen] = useState(false);
	const pathname = usePathname();

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
				<nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
					{quickLinks.map(({ label, href }) => (
						<NavLink key={label} label={label} href={href} pathname={pathname} />
					))}

					{/* Tools dropdown */}
					<div className="relative">
						<button
							onClick={() => setToolsOpen(!toolsOpen)}
							onBlur={() => setTimeout(() => setToolsOpen(false), 150)}
							className="relative flex items-center gap-1 px-3.5 py-2 text-base font-semibold text-gray-500 hover:text-gray-900 transition-colors duration-200 group"
						>
							Tools
							<ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
							<span className={`absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 origin-left transition-transform duration-300 ease-out
								${toolsOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
							/>
						</button>

						{toolsOpen && (
							<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[580px] bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/80 p-5 grid grid-cols-2 gap-5">
								{toolCategories.map((cat) => (
									<div key={cat.label}>
										<p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{cat.label}</p>
										<div className="space-y-0.5">
											{cat.tools.map((tool) => (
												<a
													key={tool}
													href="#"
													className="block px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-100"
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
					<div className="w-px h-4 bg-gray-200 mx-1.5" />

					{secondaryLinks.map(({ label, href }) => (
						<NavLink key={label} label={label} href={href} pathname={pathname} />
					))}
				</nav>
			</div>
		</header>
	);
}
