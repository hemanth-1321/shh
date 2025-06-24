import { Hero } from "@/components/Hero";
import { Marquees } from "@/components/Marque";

export default function Home() {
  return (
    <div>
      <section className=" bg-black w-full h-auto overflow-hidden ">
        <Marquees />

        <Hero />
      </section>
    </div>
  );
}
