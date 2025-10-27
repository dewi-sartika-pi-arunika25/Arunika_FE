"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function StudioScene() {
  return (
    <div className="relative w-full aspect-[5/4] max-w-2xl mx-auto">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(30rem 20rem at 70% 30%, color-mix(in oklab, var(--primary) 32%, transparent), transparent 70%), radial-gradient(24rem 16rem at 90% 70%, color-mix(in oklab, var(--accent-2) 26%, transparent), transparent 70%)",
        }}
      />

      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-3 w-[88%] h-8 rounded-[999px] blur-md opacity-60"
        style={{ background: "radial-gradient(60% 100% at 50% 50%, rgba(0,0,0,.18), transparent 70%)" }}
      />

      <motion.div
        className="absolute left-1/2 top-[22%] -translate-x-1/2"
        initial={{ rotateY: -14, rotateX: 8, y: 0 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        <div
          className="rounded-2xl shadow-2xl border bg-white/90 backdrop-blur p-3 md:p-4"
          style={{ width: "min(480px, 78vw)", borderColor: "var(--border)" }}
        >
          <div className="flex gap-2 pb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <Image src="/dashboard.png" alt="Dashboard" fill className="object-cover" priority />
          </div>

          
        </div>
      </motion.div>
    </div>
  );
}
