import { cn } from '@/lib/utils'
import { Check, ChevronDown, Clipboard, Github, Loader2, UploadIcon } from 'lucide-react'
import React from 'react'

export const Icons = {
  Copy: Clipboard,
  Done: Check,
  Loading: ({ className }: { className?: string }) => (
    <Loader2 className={cn("w-4 h-4 animate-spin", className)} />
  ),
  Upload: UploadIcon,
  Logo: ({ className }: { className?: string }) => (
    <h1 className={cn('font-cal text-5xl translate-y-[1px]', className)}>QuickUpload<span className='text-logo'>.dev</span></h1>
  ),
  DropDown: () => (
    <ChevronDown size={16} strokeWidth={2} aria-hidden="true" role="img" />
  ),
  Github
}
