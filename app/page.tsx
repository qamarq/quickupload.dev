import { Icons } from "@/components/icons";
import { UploadButton } from "@/components/upload-generator";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 w-full max-w-md">
        <Icons.Logo />
        <p className="text-base text-center text-balance text-muted-foreground mb-5">You can <strong className="text-primary">quickly share</strong> your files up to 500MB. Data will be <strong className="text-logo">deleted after 24h</strong>.</p>
        <UploadButton />
      </div>
    </div>
  );
}
