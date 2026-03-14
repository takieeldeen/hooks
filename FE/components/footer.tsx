"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-48 w-full border-t border-white/5 bg-neutral-950 px-4 py-20 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="p-2 rounded-xl bg-indigo-600 group-hover:scale-110 transition-transform">
                <Icon icon="lucide:zap" className="size-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tighter">Hooks</span>
            </Link>
            <p className="text-neutral-500 max-w-sm leading-relaxed mb-8">
              The next-generation open source workflow engine. Build, orchestrate, and deploy automations with the power of world-class AI.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/takieeldeen/hooks" target="_blank" className="p-3 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                <Icon icon="mdi:github" className="size-5" />
              </Link>
              <Link href="#" className="p-3 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                <Icon icon="mdi:twitter" className="size-5" />
              </Link>
              <Link href="#" className="p-3 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                <Icon icon="ic:baseline-discord" className="size-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-neutral-500 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="text-neutral-500 hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="#" className="text-neutral-500 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-neutral-500 hover:text-white transition-colors">Enterprise</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-neutral-500 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-neutral-500 hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="#" className="text-neutral-500 hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="#" className="text-neutral-500 hover:text-white transition-colors">Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-600 text-sm">
            © {currentYear} Hooks. All rights reserved. Built with ❤️ for the open-source community.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-neutral-600 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-neutral-600 hover:text-white text-xs transition-colors">Terms of Service</Link>
            <Link href="#" className="text-neutral-600 hover:text-white text-xs transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
