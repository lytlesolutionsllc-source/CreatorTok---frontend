import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-white/10 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <span>🎵</span>
              <span className="gradient-text">CreatorTok</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The all-in-one TikTok management platform for creators, agencies,
              and brands.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CreatorTok. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span>Built for TikTok creators 🎵</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
