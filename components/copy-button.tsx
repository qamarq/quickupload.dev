"use client"

import React from 'react'
import { Button } from './ui/button';
import { Icons } from './icons';

export const CopyButton = ({
  text,
  className
}: {
  text: string;
  className?: string;
}) => {
  const [copied, setCopied] = React.useState(false);
  return (
    <Button 
      variant={"ghost"} 
      size={"icon"} 
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }} 
      disabled={copied}
      className={className}
    >
      {copied ? <Icons.Done className='w-4 h-4 text-logo' /> : <Icons.Copy className='w-4 h-4' />}
    </Button>
  )
}
