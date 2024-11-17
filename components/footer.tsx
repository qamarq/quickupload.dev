import Link from 'next/link'
import React from 'react'

export const Footer = () => {
  return (
    <footer className="border-t py-5 w-full flex items-center justify-center">
      <h1 className="text-muted-foreground text-sm">Made with ❤️ by <Link href="https://kamilmarczak.pl" className="text-logo font-cal">Kamil Marczak</Link></h1>
    </footer>
  )
}
