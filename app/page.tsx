import { UploadButton } from "@/components/upload-generator";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-4xl">Enter filename & upload.</h1>
        <UploadButton />
      </div>
    </div>
  );
}
