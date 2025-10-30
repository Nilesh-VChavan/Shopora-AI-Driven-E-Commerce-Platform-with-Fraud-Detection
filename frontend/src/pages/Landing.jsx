import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      
      <svg
        className="absolute inset-0 w-full h-full -z-10"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cinemaGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#0f0622" />
            <stop offset="22%" stopColor="#2a0b3d" />
            <stop offset="48%" stopColor="#6b1f6e" />
            <stop offset="72%" stopColor="#ff6a3d" />
            <stop offset="100%" stopColor="#ffd56b" />
          </linearGradient>

          <radialGradient id="glow" cx="60%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="35%" stopColor="#ff9ab3" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="vignette" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
          </radialGradient>

          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
              seed="2"
              result="noise"
            />
            <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
            <feComponentTransfer in="mono" result="grain">
              <feFuncA type="table" tableValues="0 0.08" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="grain" mode="overlay" />
          </filter>

          <filter id="softBlur">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>

        
        <rect x="0" y="0" width="1920" height="1080" fill="url(#cinemaGrad)" />

        
        <g filter="url(#softBlur)" opacity="0.9">
          <ellipse cx="1300" cy="300" rx="620" ry="360" fill="#7b1b6f">
            <animate
              attributeName="cx"
              dur="18s"
              values="1400;1200;1350;1400"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              dur="20s"
              values="240;320;280;240"
              repeatCount="indefinite"
            />
          </ellipse>

          <ellipse
            cx="420"
            cy="760"
            rx="900"
            ry="420"
            fill="#ff6a3d"
            opacity="0.6"
          >
            <animate
              attributeName="cx"
              dur="22s"
              values="350;450;420;350"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              dur="26s"
              values="820;740;760;820"
              repeatCount="indefinite"
            />
          </ellipse>

          <ellipse cx="960" cy="520" rx="700" ry="380" fill="#1b1340" opacity="0.35" />
        </g>

        
        <rect x="0" y="0" width="1920" height="1080" fill="url(#glow)" opacity="0.8" />
        <rect x="0" y="0" width="1920" height="1080" fill="url(#vignette)" opacity="0.9" />

        
        <g style={{ mixBlendMode: "screen", opacity: 0.12 }}>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <rect
            x="-800"
            y="-200"
            width="600"
            height="1600"
            fill="url(#sweep)"
            transform="rotate(-20 0 0)"
          >
            <animate
              attributeName="x"
              dur="12s"
              values="-1200;2200"
              repeatCount="indefinite"
            />
          </rect>
        </g>

        
        <g filter="url(#grain)" opacity="0.06">
          <rect x="0" y="0" width="1920" height="1080" fill="#ffffff" />
        </g>

       
        <g opacity="0.07" style={{ mixBlendMode: "multiply" }}>
          <rect x="0" y="0" width="1920" height="60" fill="#000" />
          <rect x="0" y="1020" width="1920" height="60" fill="#000" />
        </g>
      </svg>

      
      <div className="relative z-10 min-h-screen pt-16 flex flex-col justify-center items-center text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="py-20"
        >
          <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-fuchsia-400 via-pink-500 to-orange-400 text-transparent bg-clip-text drop-shadow-lg">
            Welcome to Shopora
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90 leading-relaxed">
            Shopora brings AI-powered product discovery to life — find what fits your
            taste, style, and needs faster than ever before.
          </p>
          <Link
            to="/login"
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
