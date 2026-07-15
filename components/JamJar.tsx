export default function JamJar() {
    return (
      <div className="relative flex items-center justify-center">
  
        {/* тень под банкой */}
        <div
          className="
            absolute
            bottom-0
            h-20
            w-64
            rounded-full
            bg-orange-500/30
            blur-3xl
          "
        />
  
        <svg
          width="320"
          height="360"
          viewBox="0 0 320 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
  
          <defs>
  
            {/* стекло */}
            <linearGradient id="glass" x1="0" x2="1">
              <stop stopColor="white" stopOpacity="0.55" />
              <stop offset="0.45" stopColor="white" stopOpacity="0.08" />
              <stop offset="1" stopColor="white" stopOpacity="0.4" />
            </linearGradient>
  
  
            {/* джем */}
            <linearGradient id="fruit" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#FF7950" />
              <stop offset="0.35" stopColor="#D9362B" />
              <stop offset="1" stopColor="#760C0C" />
            </linearGradient>
  
  
            {/* крышка */}
            <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#FFE6A0" />
              <stop offset="0.4" stopColor="#D6A72D" />
              <stop offset="1" stopColor="#9A6500" />
            </linearGradient>
  
  
            {/* бумага этикетки */}
            <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#FFF9EC" />
              <stop offset="1" stopColor="#EFE1C4" />
            </linearGradient>
  
  
            {/* тень знака */}
            <filter id="shadow">
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="3"
                floodOpacity="0.25"
              />
            </filter>
  
          </defs>
  
  
          {/* крышка */}
          <ellipse
            cx="160"
            cy="55"
            rx="90"
            ry="22"
            fill="url(#lid)"
          />
  
          <rect
            x="70"
            y="55"
            width="180"
            height="45"
            rx="18"
            fill="url(#lid)"
          />
  
  
          {/* тело банки */}
          <path
            d="
              M65 95
              C65 75 255 75 255 95
              L265 270
              C265 330 55 330 55 270
              Z
            "
            fill="url(#glass)"
            stroke="white"
            strokeOpacity="0.45"
            strokeWidth="4"
          />
  
  
          {/* джем внутри */}
          <path
            d="
              M72 170
              C110 155 210 155 248 170
              L255 270
              C255 315 65 315 65 270
              Z
            "
            fill="url(#fruit)"
          />
  
  
          {/* поверхность джема */}
          <ellipse
            cx="160"
            cy="170"
            rx="88"
            ry="18"
            fill="#E95B3C"
            opacity="0.8"
          />
  
  
          {/* блики стекла */}
          <path
            d="
              M95 120
              C80 170 85 245 105 285
            "
            stroke="white"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.45"
          />
  
  
          <path
            d="
              M220 130
              C235 180 235 230 220 260
            "
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.3"
          />
  
  
          {/* этикетка */}
          <rect
            x="82"
            y="190"
            width="156"
            height="95"
            rx="18"
            fill="url(#paper)"
          />
  
  
          {/* тонкая рамка */}
          <rect
            x="92"
            y="200"
            width="136"
            height="75"
            rx="12"
            stroke="#C79A55"
            strokeWidth="1"
          />
  
  
          {/* вопросительный знак */}
          <text
            x="160"
            y="255"
            textAnchor="middle"
            fontSize="48"
            fontWeight="600"
            fill="#7B1E2B"
            fontFamily="serif"
            filter="url(#shadow)"
          >
            ?
          </text>
  
  
        </svg>
  
      </div>
    );
  }