"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/shadcnui";
import { Bell, Settings, User, Menu, X } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-primary shadow-lg fixed w-full top-0 z-50">
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
              <Link href="/blueprints">
                <div className="relative px-3 py-1 text-sm font-medium text-white hover:text-white cursor-pointer group">
                  図面管理
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></div>
                </div>
              </Link>
              <Link href="/projects">
                <div className="relative px-3 py-1 text-sm font-medium text-white hover:text-white cursor-pointer group">
                  案件管理
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></div>
                </div>
              </Link>
              <Link href="/customers">
                <div className="relative px-3 py-1 text-sm font-medium text-white hover:text-white cursor-pointer group">
                  顧客管理
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></div>
                </div>
              </Link>
              <Link href="/admin">
                <div className="relative px-3 py-1 text-sm font-medium text-white hover:text-white cursor-pointer group">
                  管理画面
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></div>
                </div>
              </Link>
            </nav>
          </div>

          {/* Right side - Icons and User info */}
          <div className="ml-auto flex items-center space-x-3">
            {/* Notification */}
            <Button variant="ghost" size="sm" className="relative p-1.5 text-white hover:text-white hover:bg-white/10">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-secondary rounded-full"></span>
            </Button>
            
            {/* Settings */}
            <Button variant="ghost" size="sm" className="p-1.5 text-white hover:text-white hover:bg-white/10">
              <Settings className="w-4 h-4" />
            </Button>

            {/* User section */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <User className="text-white w-3 h-3" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-white">田中 太郎</p>
              </div>
            </div>

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
              <Link href="/blueprints">
                <div 
                  className="relative w-full px-4 py-2 text-sm font-medium text-white hover:text-white cursor-pointer group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  図面管理
                  <div className="absolute bottom-0 left-4 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-8"></div>
                </div>
              </Link>
              <Link href="/projects">
                <div 
                  className="relative w-full px-4 py-2 text-sm font-medium text-white hover:text-white cursor-pointer group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  案件管理
                  <div className="absolute bottom-0 left-4 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-8"></div>
                </div>
              </Link>
              <Link href="/customers">
                <div 
                  className="relative w-full px-4 py-2 text-sm font-medium text-white hover:text-white cursor-pointer group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  顧客管理
                  <div className="absolute bottom-0 left-4 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-8"></div>
                </div>
              </Link>
              <Link href="/admin">
                <div 
                  className="relative w-full px-4 py-2 text-sm font-medium text-white hover:text-white cursor-pointer group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  管理画面
                  <div className="absolute bottom-0 left-4 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-8"></div>
                </div>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
