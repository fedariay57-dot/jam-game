import Link from "next/link";
import JamJar from "./JamJar";

export default function Hero() {
  return (
    <section
      className="
        min-h-screen
        flex
        flex-col
        items-center
        justify-center
        overflow-hidden
        px-5
        py-8
      "
    >

      {/* заголовок */}
      <h1
        className="
          text-center
          text-4xl
          font-bold
          leading-tight
          text-white
        "
      >
        Угадай вкус месяца
      </h1>


      {/* банка */}
      <div
        className="
          mt-5
          scale-90
        "
      >
        <JamJar />
      </div>


      {/* описание */}
      <p
        className="
          mt-2
          max-w-xs
          text-center
          text-base
          leading-relaxed
          text-white/75
        "
      >
        Попробуй джем
        <br />
        и доверься своим ощущениям
      </p>


      {/* кнопка */}
      <Link
  href="/game"
  className="
    mt-5
    rounded-full
    bg-gradient-to-r
    from-orange-400
    to-red-500
    px-8
    py-4
    text-base
    font-semibold
    text-white
    shadow-[0_10px_40px_rgba(255,120,40,0.45)]
  "
>
  Вперед
</Link>



    </section>
  );
}
