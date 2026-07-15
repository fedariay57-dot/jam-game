export default function Glow() {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-amber-500/20
            blur-[140px]
          "
        />
      </div>
    );
  }