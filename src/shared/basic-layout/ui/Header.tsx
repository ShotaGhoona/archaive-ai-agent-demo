'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/shared';
import { User, Menu, X, LogOut, Settings, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { headerNavigations, defaultUser } from '../constants';

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
    console.log('ログアウト処理');
    // 例: signOut() や router.push('/login') など
  };

  return (
    <header className='bg-primary fixed top-0 z-30 w-full shadow-lg'>
      <div className='w-full px-4 sm:px-6 lg:px-6'>
        <div className='flex h-[60px] items-center'>
          {/* Left side - Brand and Navigation */}
          <div className='flex items-center space-x-6'>
            {/* Brand Logo */}
            <Link href='/'>
              <div className='flex cursor-pointer items-center space-x-2'>
                <Image
                  src='/logo.svg'
                  alt='ARCHAIVE Logo'
                  width={24}
                  height={24}
                  className='h-10 w-10'
                />
                <Image
                  src='/logo-text.svg'
                  alt='ARCHAIVE Logo'
                  width={120}
                  height={32}
                  className='h-10'
                />
                {/* <h1 className='text-lg font-bold tracking-tight text-white'>
                  ARCH<span className='text-secondary'>AI</span>VE
                </h1> */}
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className='hidden items-center space-x-1 md:flex'>
              {headerNavigations.map((navigation) => {
                const isActive =
                  pathname.startsWith(navigation.href) &&
                  navigation.href !== '/';
                return (
                  <Link key={navigation.label} href={navigation.href}>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-2 rounded-md px-3 py-1 text-lg font-medium hover:bg-white/10 ${
                        isActive
                          ? 'rounded-md bg-white/20 text-white'
                          : 'text-white hover:text-white'
                      }`}
                    >
                      {navigation.icon}
                      <span>{navigation.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side - User info */}
          <div className='ml-auto flex items-center space-x-3'>
            {/* User section */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center space-x-2 rounded-md p-1 text-white hover:bg-white/10 hover:text-white'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20'>
                    <User className='h-8 w-8 text-white' />
                  </div>
                  <div className='hidden sm:block'>
                    <p className='text-lg font-medium text-white'>
                      {defaultUser.name}
                    </p>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-56' align='end'>
                <div className='space-y-1'>
                  <div className='flex items-center space-x-3 p-2'>
                    <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                      <UserCircle className='text-primary h-4 w-4' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-900'>
                        {defaultUser.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {defaultUser.email}
                      </p>
                    </div>
                  </div>
                  <div className='border-t pt-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      onClick={handleSettings}
                    >
                      <Settings className='mr-2 h-4 w-4' />
                      設定
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700'
                      onClick={handleLogout}
                    >
                      <LogOut className='mr-2 h-4 w-4' />
                      ログアウト
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Mobile menu button */}
            <Button
              variant='ghost'
              size='sm'
              className='p-1.5 text-white hover:bg-white/10 hover:text-white md:hidden'
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className='h-4 w-4' />
              ) : (
                <Menu className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className='border-t border-white/20 py-2 md:hidden'>
            <nav className='flex flex-col space-y-1'>
              {headerNavigations.map((navigation) => {
                const isActive =
                  pathname.startsWith(navigation.href) &&
                  navigation.href !== '/';
                return (
                  <Link key={navigation.label} href={navigation.href}>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium ${
                        isActive
                          ? 'rounded-md bg-white/10 text-white'
                          : 'text-white hover:text-white'
                      }`}
                    >
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
