import Image from "next/image";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
			<div className="px-6 h-24 flex items-center justify-between">
				{/* Logo */}
				<a href="/" className="flex items-center select-none">
					<Image
						src="/hori-logo-svg.svg"
						alt="Image Garage"
						width={200}
						height={50}
						className="h-20 w-auto"
						priority
					/>
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
