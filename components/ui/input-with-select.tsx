"use client"

import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileType } from "@/constants";

export function InputWithSelect({
  disabled,
  items,
  selectedItem,
  setSelectedItem,
  fileName,
  setFileName,
}: {
  disabled: boolean;
  items: FileType[];
  selectedItem: FileType;
  setSelectedItem: React.Dispatch<React.SetStateAction<FileType>>;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="space-y-2 w-full">
      <div className="flex rounded-lg shadow-sm shadow-black/5">
        <Input
          id="input-18"
          className="-me-px rounded-e-none shadow-none focus-visible:z-10 text-right"
          placeholder="your-file-name"
          type="text"
          disabled={disabled}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <div className="relative inline-flex">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="peer inline-flex h-full appearance-none items-center rounded-none rounded-e-lg border border-input bg-background pe-8 ps-3 text-sm text-muted-foreground ring-offset-background transition-shadow hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Domain suffix"
              disabled={disabled}
            >
              {selectedItem.extension}
              <span className="pointer-events-none absolute inset-y-0 end-0 z-10 flex h-full w-9 items-center justify-center text-muted-foreground/80 peer-disabled:opacity-50">
                <ChevronDown size={16} strokeWidth={2} aria-hidden="true" role="img" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {items.map((item) => (
                <DropdownMenuItem key={item.extension} onSelect={() => setSelectedItem(item)}>
                  {item.extension}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
