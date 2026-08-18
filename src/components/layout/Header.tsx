"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GitFork, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/router";

import { useAuthRole } from "@/lib/useAuthRole";
import { handleLogout, sanitizeRedirectPath } from "@/lib/utils";

const getInitials = (value: string) => {
    const tokens = value.trim().split(/\s+/).filter(Boolean);

    if (tokens.length === 0) {
        return "U";
    }

    if (tokens.length === 1) {
        return tokens[0].slice(0, 2).toUpperCase();
    }

    return `${tokens[0][0]}${tokens[tokens.length - 1][0]}`.toUpperCase();
};

const Header = () => {
    const { role, user, isAdmin: roleIsAdmin } = useAuthRole();
    const router = useRouter();
    const [profileOpen, setProfileOpen] = useState(false);
    const isAdmin = router.pathname === "/admin/page" || roleIsAdmin;
    const isPanelist = role?.slug === "admin" || role?.slug?.includes("panel");
    const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? null;
    const displayEmail = user?.email ?? null;
    const avatarUrl =
        user?.user_metadata?.avatar_url ??
        user?.user_metadata?.picture ??
        user?.user_metadata?.avatarUrl ??
        null;
    const fallbackInitials = useMemo(() => {
        const baseLabel = displayName ?? displayEmail ?? "User";
        return getInitials(baseLabel);
    }, [displayEmail, displayName]);

    const handleGithubClick = () => {
        window.open("https://github.com/Robotics-PEC", "_blank");
    };

    const loginHref = `/login?redirect=${encodeURIComponent(sanitizeRedirectPath(router.asPath))}`;

    const handleProfileLogout = async () => {
        setProfileOpen(false);
        await handleLogout();
        router.replace("/login");
    };

    const navigation = [
        { name: "Home", path: "/" },
        { name: "Team", path: "/team"},
        { name: "Projects", path: "/project" },
        { name: "Activities", path: "/activities" },
        { name: "Events", path: "/events" },
        { name: "Apply", path: "/apply" },
        { name: "Contact", path: "/contact" },
        { name: "Resources", path: "/resources" }
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="PEC Robotics Logo"
                                width={120}
                                height={40}
                                className="object-contain"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {isPanelist && (
                                <Link
                                    href="/panelist/dashboard"
                                    className="text-sm font-medium text-primary hover:text-foreground transition-colors"
                                >
                                    Interview
                                </Link>
                            )}
                            {
                                isAdmin && (
                                    <>
                                        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                            View Website
                                        </Link>
                                    </>
                                )
                            }
                            {
                                isAdmin && (
                                    <>
                                        <Link href="/admin/page" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                            Admin
                                        </Link>
                                    </>
                                )
                            }
                        </nav>
                    </div>

                    {/* Buttons and Mobile Menu */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {!user ? (
                            <Button asChild variant="outline" className="border-border bg-background/80 hover:bg-accent">
                                <Link href={loginHref}>Login</Link>
                            </Button>
                        ) : (
                            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        aria-label="Open profile menu"
                                        className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-background shadow-sm ring-offset-background transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={avatarUrl ?? undefined} alt={displayName ?? displayEmail ?? "User profile"} />
                                            <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white">
                                                {fallbackInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent align="end" sideOffset={12} className="w-72 rounded-2xl border border-border/60 bg-background p-3 shadow-xl">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-3">
                                            <Avatar className="h-11 w-11">
                                                <AvatarImage src={avatarUrl ?? undefined} alt={displayName ?? displayEmail ?? "User profile"} />
                                                <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white">
                                                    {fallbackInitials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 space-y-0.5">
                                                {displayName && (
                                                    <p className="truncate text-sm font-semibold text-foreground">
                                                        {displayName}
                                                    </p>
                                                )}
                                                {displayEmail && (
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {displayEmail}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full justify-start gap-2 border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                            onClick={handleProfileLogout}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}

                        <Button
                            variant="outline"
                            onClick={handleGithubClick}
                            className="hidden md:flex items-center gap-2 hover:bg-accent"
                        >
                            <GitFork className="h-4 w-4" />
                            Repository
                        </Button>

                        {/* Mobile menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <div className="flex flex-col gap-4 mt-8">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.path}
                                            className="text-lg font-medium px-4 py-2 hover:bg-accent rounded-md transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    {isPanelist && (
                                        <Link
                                            href="/panelist/dashboard"
                                            className="text-lg font-medium px-4 py-2 hover:bg-accent rounded-md transition-colors text-primary"
                                        >
                                            Interview
                                        </Link>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
