import dynamic from "next/dynamic";
import PreviewCard from '@component/components/PreviewCard'

export const metadata = {
  title: "LeetCode Stats Card",
  description:
    "Generate a beautiful LeetCode stats card for your GitHub README or portfolio",
};

export default function Home() {
  return (
    <main
      className="flex flex-col flex-1 items-center justify-center
                     min-h-screen bg-zinc-950 font-sans px-4 py-12"
    >
      <PreviewCard />
    </main>
  );
}
