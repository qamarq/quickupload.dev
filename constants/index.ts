export interface FileType {
  extension: string;
  type: string;
}

export const FILE_TYPES: FileType[] = [
  { extension: ".zip", type: "application/zip" },
  { extension: ".txt", type: "text/plain" },
  { extension: ".json", type: "application/json" },
  { extension: ".pdf", type: "application/pdf" },
  { extension: ".tar", type: "application/x-tar" },
  { extension: ".tar.gz", type: "application/gzip" },
  { extension: ".tar.xz", type: "application/x-xz" },
] 