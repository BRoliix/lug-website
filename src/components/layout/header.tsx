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

    if ((featureFlags?.showEvents && canShowGuestLinks) || isAdmin) {
      dynamicLinks.push({ href: "/events", label: "Events" });
    }

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
           mobile ? "hover:text-foreground text-base py-2" : "",
          pathname === link.href ? "text-foreground" : "text-foreground/60"
        )}
      >
        {link.label}
      </Link>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Desktop Logo and Nav */}
        <div className="mr-4 hidden md:flex items-center">
          <Link className="mr-6 flex items-center space-x-2 group" href="/">
            <Image
              alt="LUG Logo"
              className="h-12 w-12"
              data-ai-hint="logo"
              height={48}
              priority
              src="/images/lug_logo.png"
              width={48}
            />
            <div className="font-bold relative whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out w-10 group-hover:w-52">
              <span className="opacity-100 group-hover:opacity-0 transition-opacity duration-300">LUG</span>
              <span className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Linux User Group BPDC
              </span>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
             {renderNavLinks(baseNavLinks)}
             {isClient ? renderNavLinks(getDynamicNavLinks()) : <Skeleton className="h-6 w-48" />}
          </nav>
        </div>
        
        {/* Mobile Logo */}
        <div className="flex md:hidden items-center">
          <Link className="flex items-center space-x-2" href="/">
            <Image
              alt="LUG Logo"
              className="h-10 w-10"
              data-ai-hint="logo"
              height={40}
              src="/images/lug_logo.png"
              width={40}
            />
            <span className="font-bold text-lg">LUG</span>
          </Link>
        </div>
        
        {/* Mobile Navigation Sheet */}
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
          <SheetContent className="pr-0 w-full max-w-xs" side="left">
             <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              A list of links to navigate the website.
            </SheetDescription>
            <Link className="flex items-center mb-6" href="/" onClick={() => setIsOpen(false)}>
              <Image
                alt="LUG Logo"
                className="mr-2 h-12 w-12"
                data-ai-hint="logo"
                height={48}
                src="/images/lug_logo.png"
                width={48}
              />
              <span className="font-bold text-lg">Linux User Group</span>
            </Link>
            <div className="flex flex-col space-y-4 overflow-y-auto">
              {renderNavLinks(baseNavLinks, true)}
              {isClient ? renderNavLinks(getDynamicNavLinks(), true) : <Skeleton className="h-6 w-32 mt-3" />}
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Button
            aria-label="Open Terminal View"
            onClick={handleTerminalLink}
            size="icon"
            variant="ghost"
          >
              <TerminalIcon className="h-5 w-5" />
          </Button>
          {isClient ? (
            user ? (
                <Button onClick={signOutUser} size="sm" variant="ghost">
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
        </div>
      </div>
    </header>
  )
}
