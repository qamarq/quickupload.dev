import { cn } from '@/lib/utils'
import { Check, Clipboard, Loader2, UploadIcon } from 'lucide-react'
import React from 'react'

export const Icons = {
  Copy: Clipboard,
  Done: Check,
  Loading: ({ className }: { className?: string }) => (
    <Loader2 className={cn("w-4 h-4 animate-spin", className)} />
  ),
  Upload: UploadIcon,
  Logo: () => (
    <h1 className='font-cal text-5xl'>quickupload<span className='text-logo'>.dev</span></h1>
  ),
}
