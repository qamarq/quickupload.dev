import { Icons } from "@/components/icons";
import { UploadButton } from "@/components/upload-generator";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Icons.Logo />
        <UploadButton />
      </div>
    </div>
  );
}
