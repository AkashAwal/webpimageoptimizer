export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
			<div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
				{/* Logo */}
				<a href="/" className="flex items-center gap-2.5 select-none">
					<div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect x="2" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.9" />
							<rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.5" />
							<rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.5" />
							<rect x="9" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.9" />
						</svg>
					</div>
					<span className="text-[15px] font-semibold text-gray-900 tracking-tight">
						Pix<span className="text-violet-600">Garage</span>
					</span>
				</a>

				{/* Nav */}
				<nav className="hidden sm:flex items-center gap-1">
					{[
						{ label: "Tools", href: "#" },
						{ label: "Pricing", href: "#" },
					].map(({ label, href }) => (
						<a
							key={label}
							href={href}
							className="px-3.5 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
						>
							{label}
						</a>
					))}
				</nav>
			</div>
		</header>
	);
}
