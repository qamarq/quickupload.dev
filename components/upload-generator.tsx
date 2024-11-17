"use client"

import React, { useMemo, useRef } from 'react'
import { Button } from "@/components/ui/button";
import { Textarea } from './ui/textarea';
import { FILE_TYPES } from '@/constants';
import { generateNewFile } from '@/actions/files';
import { Label } from './ui/label';
import { CopyButton } from './copy-button';
import { Icons } from './icons';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestSchema } from '@/schemas';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Captcha from 'react-google-recaptcha';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';

export const UploadButton = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [prepareResult, setPrepareResult] = React.useState<{ id: string, name: string, type: string } | null>(null);
  const [downloadLink, setDownloadLink] = React.useState("");
  const [selectedOutputType, setSelectedOutputType] = React.useState<"curl" | "powershell">("curl");
  const captchaRef = useRef<Captcha>(null);

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: "",
      extension: ".zip",
      type: "",
      captcha: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof requestSchema>) => {
    setIsGenerating(true);
    
    try {
      const captcha = await captchaRef.current?.executeAsync();
      if (!captcha) {
        toast.error('Captcha error');
        return;
      }
      values.captcha = captcha
      values.type = FILE_TYPES.find((item) => item.extension === values.extension)?.type || "";
      captchaRef.current?.reset();
      
      const res = await generateNewFile(values);
      if (res?.data?.success) {
        setPrepareResult(res.data.prepared);
        setDownloadLink(res.data.downloadLink);
        toast.success("File generated successfully");
      } else {
        toast.error(res?.data?.message || "An error occurred");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  const fileName = form.watch('name');

  const copyCommand = useMemo(() => {
    if (!prepareResult) return "";
    return `curl${selectedOutputType === "powershell" ? ".exe" : ""} -X "POST" "${process.env.NEXT_PUBLIC_URL}/api/v1/upload" -H "accept: application/json" -H "Content-Type: multipart/form-data" -H "x-access-token: ${prepareResult.id}" -F "file=@${prepareResult.name};type=${prepareResult.type}"`
  }, [prepareResult, selectedOutputType])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex items-center gap-3" >
          <Captcha
              ref={captchaRef}
              size="invisible"
              className='hidden'
              sitekey={process.env.NEXT_PUBLIC_CAPTCHA!}
          />
          <div className="space-y-2 w-full">
            <div className="flex rounded-lg shadow-sm shadow-black/5">
              <FormField
                control={form.control}
                disabled={isGenerating}
                name="name"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        className="-me-px rounded-e-none shadow-none focus-visible:z-10 relative text-right"
                        placeholder="your-file-name"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={isGenerating}
                name="extension"
                render={({ field }) => (
                  <FormItem className='relative inline-flex'>
                    <DropdownMenu>
                      <FormControl>
                        <DropdownMenuTrigger
                          className="peer inline-flex h-full appearance-none items-center rounded-none rounded-e-lg border border-l-0 border-input bg-background pe-8 ps-3 text-sm text-muted-foreground ring-offset-background transition-shadow hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Domain suffix"
                          disabled={isGenerating}
                        >
                          {field.value}
                          <span className="pointer-events-none absolute inset-y-0 end-0 z-10 flex h-full w-9 items-center justify-center text-muted-foreground/80 peer-disabled:opacity-50">
                            <Icons.DropDown />
                          </span>
                        </DropdownMenuTrigger>
                      </FormControl>
                      <DropdownMenuContent>
                        {FILE_TYPES.map((item) => (
                          <DropdownMenuItem key={item.extension} onSelect={() => field.onChange(item.extension)}>
                            {item.extension}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button variant={fileName === "" ? "default" : "rainbow"} type="submit" disabled={isGenerating || fileName === ""}>
            {isGenerating ? <Icons.Loading /> : <Icons.Upload className="w-4 h-4" />} Upload
          </Button>
        </form>
      </Form>

      {prepareResult && (
        <div className='grid gap-4 w-full mt-5'>
          <div className='relative w-full grid gap-2'>
            <div className='flex items-center justify-between'>
              <Label className='font-semibold'>cURL command:</Label>
              
              <DropdownMenu>
                <DropdownMenuTrigger><Button size={"sm"} variant={"outline"}>{selectedOutputType} <Icons.DropDown /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => setSelectedOutputType("curl")}>cURL</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedOutputType("powershell")}>PowerShell</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Textarea
              className="read-only:bg-muted/50 font-mono w-full resize-none"
              value={copyCommand}
              readOnly
              rows={7}
              placeholder="Leave a comment"
            />

            <CopyButton text={copyCommand} className="absolute bottom-1 right-1" />
          </div>
          <div className='relative w-full grid gap-2'>
            <Label className='font-semibold'>Download link:</Label>
            <Textarea
              className="read-only:bg-muted/50 font-mono w-full resize-none"
              value={downloadLink}
              readOnly
              rows={1}
              placeholder="Leave a comment"
            />
            
            <CopyButton text={downloadLink} className="absolute bottom-1 right-1" />
          </div>
        </div>
      )}
    </>
  )
}
