"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const toolCategories = [
	{
		label: "Compress",
		tools: [
			{ name: "Compress JPG", color: "bg-orange-500", icon: "🗜" },
			{ name: "Compress PNG", color: "bg-blue-500", icon: "🗜" },
			{ name: "Compress WebP", color: "bg-green-500", icon: "🗜" },
			{ name: "Compress GIF", color: "bg-purple-500", icon: "🗜" },
			{ name: "Target file size", color: "bg-red-500", icon: "🎯" },
			{ name: "Bulk compress", color: "bg-yellow-500", icon: "📦" },
		],
	},
	{
		label: "Convert",
		tools: [
			{ name: "JPG to PNG", color: "bg-blue-400", icon: "🔄" },
			{ name: "PNG to JPG", color: "bg-orange-400", icon: "🔄" },
			{ name: "To WebP", color: "bg-green-400", icon: "🔄" },
			{ name: "To AVIF", color: "bg-violet-500", icon: "🔄" },
			{ name: "HEIC to JPG", color: "bg-gray-600", icon: "🔄" },
			{ name: "PNG to SVG", color: "bg-pink-500", icon: "🔄" },
			{ name: "Image to PDF", color: "bg-red-600", icon: "📄" },
			{ name: "PDF to Image", color: "bg-red-400", icon: "📄" },
		],
	},
	{
		label: "Edit",
		tools: [
			{ name: "Resize", color: "bg-blue-500", icon: "↔" },
			{ name: "Crop", color: "bg-green-600", icon: "✂" },
			{ name: "Rotate & Flip", color: "bg-yellow-500", icon: "↩" },
			{ name: "Add Watermark", color: "bg-indigo-500", icon: "💧" },
			{ name: "Add Text", color: "bg-orange-500", icon: "T" },
			{ name: "Round Corners", color: "bg-pink-500", icon: "◻" },
			{ name: "Add Border", color: "bg-teal-500", icon: "⬜" },
			{ name: "Filters", color: "bg-purple-500", icon: "🎨" },
		],
	},
	{
		label: "AI Tools",
		tools: [
			{ name: "Background Remover", color: "bg-violet-600", icon: "✨" },
			{ name: "AI Upscaler", color: "bg-blue-600", icon: "⬆" },
			{ name: "Object Eraser", color: "bg-red-500", icon: "🧹" },
			{ name: "Photo Restoration", color: "bg-amber-500", icon: "🖼" },
			{ name: "Colorize", color: "bg-pink-600", icon: "🎨" },
			{ name: "Auto Alt-Text", color: "bg-green-600", icon: "💬" },
		],
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
		<a href={href} className="relative px-3.5 py-2 text-base font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-150 group">
			{label}
			<span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gray-900 transition-all duration-300 ${isActive ? "w-4" : "w-0 group-hover:w-7"}`} />
		</a>
	);
}

export default function Header() {
	const [toolsOpen, setToolsOpen] = useState(false);
	const pathname = usePathname();

	return (
		<>
			<header
				className="sticky top-0 z-50 w-full bg-white border-b border-gray-100"
				onMouseLeave={() => setToolsOpen(false)}
			>
				<div className="px-6 h-20 flex items-center justify-between">
					{/* Logo */}
					<a href="/" className="flex items-center select-none flex-shrink-0">
						<Image src="/hori-logo-svg.svg" alt="Image Garage" width={200} height={50} className="h-20 w-auto" priority />
					</a>

					{/* Nav — centered */}
					<nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
						{quickLinks.map(({ label, href }) => (
							<NavLink key={label} label={label} href={href} pathname={pathname} />
						))}

						<button
							onMouseEnter={() => setToolsOpen(true)}
							className="relative flex items-center gap-1 px-3.5 py-2 text-base font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-150 group"
						>
							Tools
							<ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
							<span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gray-900 transition-all duration-300 ${toolsOpen ? "w-4" : "w-0 group-hover:w-7"}`} />
						</button>

						<div className="w-px h-4 bg-gray-200 mx-1.5" />

						{secondaryLinks.map(({ label, href }) => (
							<NavLink key={label} label={label} href={href} pathname={pathname} />
						))}
					</nav>
				</div>

				{/* Mega menu — direct child of header, no transform parent */}
				{toolsOpen && (
					<div className="w-full bg-white border-t border-gray-100 shadow-md">
						<div className="w-full px-12 py-5 grid grid-cols-4">
							{toolCategories.map((cat, i) => (
								<div key={cat.label} className={`px-6 ${i !== 0 ? "border-l border-gray-100" : ""}`}>
									<p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">{cat.label}</p>
									<div className="space-y-0.5">
										{cat.tools.map((tool) => (
											<a key={tool.name} href="#" className="flex items-center gap-3 py-1 group/item">
												<span className={`w-7 h-7 rounded-md ${tool.color} flex items-center justify-center text-white text-xs flex-shrink-0`}>
													{tool.icon}
												</span>
												<span className="text-sm font-medium text-gray-700 group-hover/item:text-gray-900 transition-colors">
													{tool.name}
												</span>
											</a>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</header>
		</>
	);
}
