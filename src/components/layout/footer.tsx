"use client";
import Link from 'next/link';
import { Github, Linkedin, Instagram, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-background border-t mt-auto w-full">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <div className="container mx-auto py-8 px-4 md:py-12 md:px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center sm:text-left">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-center sm:items-start space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/lug_logo.png"
                alt="LUG Logo"
                width={48}
                height={48}
                className="w-12 h-12"
                data-ai-hint="logo"
              />
              <div>
                <p className="text-lg font-bold leading-tight">Linux User Group</p>
                <p className="text-sm text-muted-foreground leading-tight">BITS Pilani, Dubai Campus</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The home of open-source enthusiasts, fostering innovation and collaboration.
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center sm:items-start space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              <Link
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                href="/about"
              >
                About Us
              </Link>
              <Link
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                href="/council"
              >
                Our Council
              </Link>
              <Link
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                href="/join-us"
              >
                Join Us
              </Link>
            </nav>
          </div>
          
          {/* Column 3: Connect */}
          <div className="flex flex-col items-center sm:items-start space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a
                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-muted"
                href="https://www.linkedin.com/company/lugbpdc/"
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Visit our LinkedIn page"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-muted"
                href="https://www.instagram.com/lugbpdc/"
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Visit our Instagram page"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer bottom */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Linux User Group BPDC. All Rights Reserved.
          </p>
          <Button
            className="flex items-center space-x-2 text-xs"
            onClick={scrollToTop}
            size="sm"
            variant="ghost"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
