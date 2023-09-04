"use client";

import { useState, useEffect, useRef } from 'react';

import Link from "next/link";

import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signIn, signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Team Management', href: '/team_management' },
  { name: 'Order Filler Details', href: '/order_filler_details' },
  { name: 'Trip Management', href: '/trip_management' },
];

export default function Navbar({ user }: { user: any }) {  
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  // After mounting, we have access to the theme
  // This prevents hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, []);

  // If user clicks outside of the menu on mobile, close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render the navbar on the homepage
  const pathname = usePathname();
  if (pathname === '/') return;

  return (
    <div className="mx-auto sm:px-6 lg:px-8 xl:px-32 2xl:px-96 border-b-2 shadow-md dark:shadow-sm dark:shadow-gray-800 bg-background">
      <div className="hidden md:flex md:h-16 md:justify-between">
        <div className="flex flex-shrink-0 items-center">
          <NavigationMenu>
            <NavigationMenuList>
              { navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Sign in/sign out dialog and button */}
        <div className="flex flex-shrink-0 justify-end items-center mr-4">
          {/* <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                {user ? (
                  <>
                    <div className="flex items-center px-3">
                      <NavigationMenuTrigger>
                        <div className="flex-shrink-0">
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={user.image}
                            height={32}
                            width={32}
                            alt={`${user.name} avatar`}
                          />
                        </div>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="m-4 w-fit">
                          <div className="text-primary-background font-medium">
                            {user.name}
                          </div>
                          <div className="text-sm font-medium text-muted-foreground">
                            {user.email}
                          </div>
                        </div>

                        <Separator />

                        <div className="m-2">
                          <Button
                            onClick={() => signOut()}
                            variant="ghost"
                            className='justify-center w-full'
                          >
                            Sign out
                          </Button>
                        </div>
                      </NavigationMenuContent>
                    </div>
                  </>
                ) : (
                  <div className="m-2">
                    <Dialog>
                      <DialogTrigger>
                        <span className='ghost-button hover:bg-accent transition-colors font-medium text-sm'>
                          Sign in
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogDescription>
                          <AuthenticationPage />
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu> */}

            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? (
                <>
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <span className="sr-only">Toggle theme</span>
                </>
              ) : (
                <>
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </>
              )}
            </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="flex justify-between">
          <div className='p-2 pl-0'>
            <span className="sr-only">Open main menu</span>
            <Button variant="ghost" onClick={() => setOpen(!open)}>
              {open ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>

          {open && (
            <div ref={menuRef} className="absolute top-0 mt-14 inset-x-0 p-0 md:hidden">
              <div className="shadow-lg ring-1 ring-black ring-opacity-5 bg-background divide-y-2">
                {navigation.map((item) => (
                  <div key={item.name} className="" onClick={() => setOpen(false)}>
                    <Link href={item.href} legacyBehavior passHref>
                      <a className="block px-4 py-2 text-md font-medium text-foreground">
                        {item.name}
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='p-2 pr-3'>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? (
                <>
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle theme</span>
                </>
              ) : (
                <>
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle theme</span>
                </>
              )}
            </Button>
          </div>  
        </div>
      </div>
    </div>
  );
}