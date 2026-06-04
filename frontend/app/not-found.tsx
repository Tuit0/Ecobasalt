"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-onyx-950 relative overflow-hidden pt-20">
      <div className="orb orb-red w-[600px] h-[600px] -top-40 -left-40 opacity-50" />
      <div className="orb orb-warm w-[500px] h-[500px] bottom-0 -right-40 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 flex justify-center"
          >
            <img
              src="/logo.png?v=4"
              alt="ECO BASALT"
              width={120}
              height={120}
              style={{ objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(220, 38, 38, 0.4))" }}
            />
          </motion.div>

          <div className="h-display text-pearl-100 text-[120px] sm:text-[180px] leading-none font-bold mb-4">
            <span className="text-gradient-red">404</span>
          </div>

          <h1 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl mb-5 text-balance">
            Sahifa topilmadi
          </h1>

          <p className="text-pearl-200 text-base sm:text-lg mb-10 max-w-xl mx-auto">
            Bu sahifa mavjud emas yoki ko'chirilgan. Bosh sahifaga qaytib mahsulotlarimiz bilan tanishing.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/" className="btn-solid-gold !text-base !py-3.5 !px-7">
              <Home className="w-4 h-4 mr-2" strokeWidth={2} />
              Bosh sahifa
            </Link>
            <Link href="/products" className="btn-gold !text-base !py-3.5 !px-7">
              <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
              Mahsulotlar
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
