"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Heart,
  ShoppingBag,
  Users,
  User,
  Search,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useCart } from "@/app/context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/lib/api/messages";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/adopt", label: "Adopt", icon: Heart },
  { path: "/shop", label: "Shop", icon: ShoppingBag },
  { path: "/services", label: "Services", icon: Users },
  { path: "/community", label: "Community", icon: User },
];

export function Header() {
  const pathname = usePathname();

  const { data: session } = useSession();
  const { itemCount } = useCart();
  const isSignedIn = Boolean(session?.user);
  const userEmail = session?.user?.email;
  const userInitial = userEmail?.charAt(0).toUpperCase();
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    enabled: isSignedIn,
  });
  const unreadMessages = conversations.reduce(
    (sum, conversation) => sum + conversation.unread,
    0
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 hidden border-b bg-white lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <span className="font-semibold text-lg">CatHub</span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search cats, products, services..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.path ||
                  (item.path !== "/" && pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`text-sm transition-colors ${
                      isActive
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="flex items-center gap-3 ml-2 pl-6 border-l">
                {isSignedIn ? (
                  <>
                    <Link href="/messages" aria-label="Messages">
                      <Button variant="ghost" size="icon" className="relative">
                        <MessageSquare className="w-5 h-5" />
                        {unreadMessages > 0 && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </Button>
                    </Link>

                    <Link href="/cart" aria-label="Cart">
                      <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="w-5 h-5" />
                        {itemCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {itemCount > 99 ? "99+" : itemCount}
                          </span>
                        )}
                      </Button>
                    </Link>

                    <Link href="/profile" aria-label="Profile">
                      <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 ring-primary transition-all">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${userEmail}`}
                        />
                        <AvatarFallback>
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button size="sm">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-3">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex shrink-0 items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <span className="font-semibold truncate">CatHub</span>
          </Link>

          {isSignedIn ? (
            <div className="flex shrink-0 items-center gap-1.5">
              <Link href="/messages" aria-label="Messages">
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <MessageSquare className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </Link>

              <Link href="/cart" aria-label="Cart">
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Link href="/profile" aria-label="Profile">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${userEmail}`}
                  />
                  <AvatarFallback>
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-2">
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="h-9 px-3 text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="h-9 px-3 text-xs">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.path ||
              (item.path !== "/" && pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex flex-col items-center justify-center flex-1 h-full min-w-0 px-1"
              >
                <Icon
                  className={`w-5 h-5 mb-1 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`max-w-full truncate text-[11px] ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
