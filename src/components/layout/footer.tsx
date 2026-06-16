"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderGit2, UserRound, Globe, Mail } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="gold-gradient">JW</span>
              <span className="text-white/60 ml-1">.</span>
            </Link>
            <p className="text-zinc-500 text-sm mt-2">
              Full Stack Developer & Creative Technologist
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/jebazwesley" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-gold transition-colors">
              <FolderGit2 size={20} />
            </a>
            <a href="https://linkedin.com/in/jebazwesley" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-gold transition-colors">
              <UserRound size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-gold transition-colors">
              <Globe size={20} />
            </a>
            <a href="mailto:jebazwesleyraj@gmail.com" className="text-zinc-400 hover:text-gold transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} Jebaz Wesley Raj. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <Link href="/projects" className="hover:text-zinc-400 transition-colors">Projects</Link>
            <Link href="/contact" className="hover:text-zinc-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
