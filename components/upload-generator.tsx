"use client"

import React from 'react'
import { Button } from "@/components/ui/button";
import { Clipboard, Loader2, UploadIcon } from "lucide-react";
import { Textarea } from './ui/textarea';
import { InputWithSelect } from './ui/input-with-select';
import { FILE_TYPES } from '@/constants';
import { generateNewFile } from '@/actions/files';
import { Label } from './ui/label';

export const UploadButton = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [curlCommand, setCurlCommand] = React.useState("");
  const [downloadLink, setDownloadLink] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState(FILE_TYPES[0]);
  const [fileName, setFileName] = React.useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const { curl, downloadLink } = await generateNewFile({ fileName, fileType: selectedItem });
      setCurlCommand(curl);
      setDownloadLink(downloadLink);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <div className='w-full flex items-center gap-3'>
        <InputWithSelect 
          disabled={isGenerating}
          selectedItem={selectedItem} 
          setSelectedItem={setSelectedItem}
          items={FILE_TYPES} 
          fileName={fileName}
          setFileName={setFileName}
        />
        <Button variant={fileName === "" ? "default" : "rainbow"} onClick={handleGenerate} className="" disabled={isGenerating || fileName === ""}>
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadIcon className="w-4 h-4" />} Upload
        </Button>
      </div>

      {curlCommand !== "" && (
        <div className='grid gap-4 w-full'>
          <div className='relative w-full grid gap-2'>
            <Label>cURL command:</Label>
            <Textarea
              className="read-only:bg-muted/50 font-mono w-full resize-none"
              value={curlCommand}
              readOnly
              rows={7}
              placeholder="Leave a comment"
            />
            
            <Button 
              variant={"ghost"} 
              size={"icon"} 
              onClick={() => navigator.clipboard.writeText(curlCommand)} 
              className="absolute bottom-1 right-1"
            >
              <Clipboard className='w-4 h-4' />
            </Button>
          </div>
          <div className='relative w-full grid gap-2'>
            <Label>Download link:</Label>
            <Textarea
              className="read-only:bg-muted/50 font-mono w-full resize-none"
              value={downloadLink}
              readOnly
              rows={1}
              placeholder="Leave a comment"
            />
            
            <Button 
              variant={"ghost"} 
              size={"icon"} 
              onClick={() => navigator.clipboard.writeText(downloadLink)} 
              className="absolute bottom-1 right-1"
            >
              <Clipboard className='w-4 h-4' />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
