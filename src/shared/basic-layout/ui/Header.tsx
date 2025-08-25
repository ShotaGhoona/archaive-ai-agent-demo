"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/shared";
import { User, Menu, X, LogOut, Settings, UserCircle } from "lucide-react";
import { headerNavigations, defaultUser } from "../constants";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSettings = () => {
    router.push('/setting/profile');
  };

  const handleLogout = () => {
    // TODO: ログアウト処理を実装
    console.log("ログアウト処理");
    // 例: signOut() や router.push('/login') など
  };

  return (
    <header className="bg-primary shadow-lg fixed w-full top-0 z-30">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[45px]">
          {/* Left side - Brand and Navigation */}
          <div className="flex items-center space-x-6">
            {/* Brand Name */}
            <Link href="/">
              <h1 className="text-lg font-bold text-white tracking-tight cursor-pointer">ARCH<span className="text-secondary">AI</span>VE</h1>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-1">
              {headerNavigations.map((navigation) => {
                const isActive = pathname.startsWith(navigation.href) && navigation.href !== '/';
                return (
                  <Link key={navigation.label} href={navigation.href}>
                    <div className={`relative flex items-center gap-2 px-3 py-1 text-sm font-medium hover:bg-white/10 rounded-md cursor-pointer group ${
                      isActive 
                        ? 'text-white bg-white/20 rounded-md' 
                        : 'text-white hover:text-white'
                    }`}>
                      {navigation.icon}
                      <span>{navigation.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side - User info */}
          <div className="ml-auto flex items-center space-x-3">
            {/* User section */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-2 p-1 text-white hover:text-white hover:bg-white/10 rounded-md"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="text-white w-3 h-3" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium text-white">{defaultUser.name}</p>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{defaultUser.name}</p>
                      <p className="text-xs text-gray-500">{defaultUser.email}</p>
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      onClick={handleSettings}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      設定
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      ログアウト
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden p-1.5 text-white hover:text-white hover:bg-white/10"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-2">
            <nav className="flex flex-col space-y-1">
              {headerNavigations.map((navigation) => {
                const isActive = pathname.startsWith(navigation.href) && navigation.href !== '/';
                return (
                  <Link key={navigation.label} href={navigation.href}>
                    <div className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer group ${
                      isActive 
                        ? 'text-white bg-white/10 rounded-md' 
                        : 'text-white hover:text-white'
                    }`}>
                      {navigation.icon}
                      <span>{navigation.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}