import React from 'react'
import { Icons } from './icons'
import { Button } from './ui/button'
import Link from 'next/link'

export const Topbar = () => {
  return (
    <header className='fixed top-0 inset-x-0 backdrop-blur-[12px] border-b'>
      <div className='container mx-auto py-4 flex items-center justify-between'>
        <Icons.Logo className="text-xl" />
        <Button size={"sm"} asChild>
          <Link href="https://github.com/qamarq/quickupload.dev" target='_blank'>
            <Icons.Github className="w-4 h-4" />Github Repo
          </Link>
        </Button>
      </div>
    </header>
  )
}
