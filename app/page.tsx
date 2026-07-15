import Hero from "@/components/Hero";
import Glow from "@/components/Glow";

export default function Home() {
  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#140b05]
      "
    >
      <Glow />
      <Hero />
    </main>
  );
}