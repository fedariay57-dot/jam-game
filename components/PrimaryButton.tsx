type Props = {
    children: React.ReactNode;
  };
  
  export default function PrimaryButton({ children }: Props) {
    return (
      <button
        className="
          relative
          overflow-hidden
          rounded-full
          bg-gradient-to-r
          from-amber-400
          to-orange-500
          px-8
          py-4
          text-base
          font-semibold
          text-black
          shadow-[0_15px_40px_rgba(251,191,36,0.35)]
          transition
          duration-300
          hover:scale-105
          active:scale-95
        "
      >
        <span className="relative z-10">
          {children}
        </span>
  
        <span
          className="
            absolute
            inset-0
            translate-y-full
            bg-white/30
            transition-transform
            duration-500
            hover:translate-y-0
          "
        />
      </button>
    );
  }