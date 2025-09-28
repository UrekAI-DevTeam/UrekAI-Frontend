"use client";
import React from 'react';
import Link from 'next/link';
// import { Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface backdrop-blur-xl p-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between">
            <nav className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 text-sm">
              <Link href="/solutions" className="text-text-secondary hover:underline">Solutions</Link>
              <Link href="/about" className="text-text-secondary hover:underline">About us</Link>
              <Link href="/help" className="text-text-secondary hover:underline">Help</Link>
              <Link href="/terms" className="text-text-secondary hover:underline">Terms</Link>
              <Link href="/privacy" className="text-text-secondary hover:underline">Privacy Policy</Link>
              <span className="text-text-muted">© {new Date().getFullYear()} UrekAI</span>
            </nav>
            {/* <div className="flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-hover transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-hover transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-hover transition-colors">
                <Github className="w-4 h-4" />
              </a> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};


