"use client"

import { useState, useEffect } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import Image from 'next/image'
import { useTheme } from "next-themes"

export const dynamic = 'force-dynamic';

export default function IndexPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const {theme} = useTheme();
  const [imageUrl, setImageUrl] = useState('/logo-dark.png');

  
  useEffect(() => {
    const imageSrc = theme === 'dark'
      ? '/logo-dark.png'
      : '/logo.png'
    setImageUrl(imageSrc)
  }, [theme]);

  return (
    <div className="h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#1089fc] to-[#5089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-3xl py-4 md:py-36">
          <div className="mb-8 flex justify-center">  
            <div className="relative rounded-full mt-16 mb-8 px-3 py-1 text-sm leading-6 text-slate-800 dark:text-slate-300 ring-1 ring-gray-900/20 dark:ring-black/30 dark:bg-slate-800 dark:glass hover:ring-gray-900/40">
              Currently in Development: {' '}
              <Dialog>
                <DialogTrigger>
              <a href="#" className="font-semibold" style={{ color: '#008bff' }}>
                <span className="absolute inset-0 font-semibold" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a> 
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Currently in Development</DialogTitle>
                    <DialogDescription className='text-md font-normal text-left'>
                      <p className='pb-4'>
                        This project was created this project as part of a 4-week hackathon and is currently in development.
                      </p>                      
                      <p className='pt-2'>
                        For more information, please visit this <a href="https://github.com/charlesmorrisjr/SupplyManager" target='_blank' style={{color: '#008bff' }}>link</a>.
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="text-center">
            <Image
              src={imageUrl}
              width={785}
              height={162}
              alt="Supply Manager Logo"
              priority={true}
            />

            {/* <h1 className="mb-16 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Supply chain order filling management.
            </h1>
            <p className="mt-6 text-lg font-medium leading-8 text-gray-600">
              
            </p> */}
            <div className="mt-16 flex items-center justify-center gap-x-6">
              <a
                href="dashboard"
                style={{ backgroundColor: '#008bff' }}
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Try Live Demo
              </a>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1089fc] to-[#5089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
