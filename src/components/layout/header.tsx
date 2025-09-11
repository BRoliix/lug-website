
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu, TerminalIcon, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import { Skeleton } from "../ui/skeleton"

const baseNavLinks = [
  { href: "/about", label: "About" },
  { href: "/council", label: "Council" },
  { href: "/events", label: "Events" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin, signOutUser, featureFlags } = useAuth();

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getDynamicNavLinks = () => {
    const dynamicLinks = [];
    const canShowGuestLinks = featureFlags?.showSignIn ?? true;

    if ((featureFlags?.showJoinUs && canShowGuestLinks) || isAdmin) {
      dynamicLinks.push({ href: "/join-us", label: "Join Us" });
    }
    // Events is now a base nav link; avoid adding a duplicate here
    if ((featureFlags?.showForum && canShowGuestLinks) || isAdmin) {
        dynamicLinks.push({ href: "/forum", label: "Forum" });
    }
    if (user) {
      dynamicLinks.push({ href: "/profile", label: "Profile" });
    }
    if (isAdmin) {
      dynamicLinks.push({ href: "/admin", label: "Admin" });
    }
    
    return dynamicLinks.filter((link, index, self) =>
        index === self.findIndex((l) => l.href === link.href)
    );
  };
  
  const showSignInButton = isClient ? (!user && (featureFlags?.showSignIn ?? true)) : false;
  const navLinks = isClient ? [...baseNavLinks, ...getDynamicNavLinks()] : baseNavLinks;

  const handleTerminalLink = () => {
    window.open("https://lug12.netlify.app/", "_blank");
  }
  
  const renderNavLinks = (links: {href: string, label: string}[], mobile = false) => (
    links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => mobile && setIsOpen(false)}
        className={cn(
          "transition-colors hover:text-foreground/80",
           mobile ? "hover:text-foreground" : "",
          pathname === link.href ? "text-foreground" : "text-foreground/60"
        )}
      >
        {link.label}
      </Link>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <Image src="/images/lug_logo.png" alt="LUG Logo" width={80} height={80} className="h-20 w-20" data-ai-hint="logo" priority />
            <div className="font-bold sm:inline-block relative whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out w-10 group-hover:w-52">
              <span className="opacity-100 group-hover:opacity-0 transition-opacity duration-300">LUG</span>
              <span className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Linux User Group BPDC
              </span>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium transition-all duration-300 ease-in-out">
             {renderNavLinks(baseNavLinks)}
             {isClient ? renderNavLinks(getDynamicNavLinks()) : <Skeleton className="h-6 w-48" />}
          </nav>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              A list of links to navigate the website.
            </SheetDescription>
            <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <Image src="/images/lug_logo.png" alt="LUG Logo" width={80} height={80} className="mr-2 h-20 w-20" data-ai-hint="logo" />
              <span className="font-bold">LUG</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {renderNavLinks(baseNavLinks, true)}
                {isClient ? renderNavLinks(getDynamicNavLinks(), true) : <Skeleton className="h-6 w-32 mt-3" />}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             {/* Future search bar can go here */}
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleTerminalLink} aria-label="Open Terminal View">
                <TerminalIcon className="h-5 w-5" />
            </Button>
            {isClient ? (
              user ? (
                  <Button variant="ghost" size="sm" onClick={signOutUser}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                  </Button>
              ) : (
                showSignInButton && (
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                )
              )
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
