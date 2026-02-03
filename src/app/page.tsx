'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-brand-primary/5 blur-[120px] rounded-full -z-10 animate-float" />
      <div className="absolute bottom-[5%] right-[-5%] w-[50%] h-[50%] bg-brand-accent/5 blur-[120px] rounded-full -z-10 animate-float" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 md:pt-44 pb-20 md:pb-32 flex flex-col items-center text-center">
        {/* Logo Showcase - Premium Sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-20 relative"
        >
          {/* Decorative Background Elements for Logos */}
          <div className="absolute inset-0 bg-brand-primary/5 blur-[100px] -z-10 rounded-full scale-150" />

          {[
            { src: "/images/logos/smkn11.jpg", alt: "SMKN 11", size: 100, label: "SMKN 11 Bandung" },
            { src: "/images/logos/osis.jpg", alt: "OSIS", size: 140, label: "OSIS SMKN 11" },
            { src: "/images/logos/mpk.jpg", alt: "MPK", size: 140, label: "MPK SMKN 11" }
          ].map((logo, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group/item flex flex-col items-center gap-4"
            >
              <div className="logo-orb w-24 h-24 md:w-40 md:h-40 p-4 md:p-8 bg-white dark:bg-slate-900 border-2 border-border-strong/30 group-hover/item:border-brand-primary transition-all">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.size}
                  height={logo.size}
                  className="object-contain w-full h-full filter drop-shadow-lg group-hover/item:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-foreground/40 group-hover/item:text-brand-primary transition-colors">
                {logo.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold tracking-[0.2em] uppercase glass rounded-full text-brand-secondary border-brand-secondary/10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
          </span>
          Official Website OSIS-MPK SMKN 11 Bandung
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-foreground leading-[0.95] max-w-5xl"
        >
          Membangun <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-blue-600 to-brand-accent">Inspirasi</span>,<br />
          Mewujudkan <span className="text-brand-primary">Masa Depan</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl text-xl text-foreground/60 mb-12 leading-relaxed"
        >
          Platform sinergi bagi seluruh siswa SMKN 11 Bandung untuk berkolaborasi, berinovasi, dan berkontribusi nyata melalui kepemimpinan yang berintegritas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-5"
        >
          <Link
            href="/vision-mission"
            className="group relative px-10 py-5 bg-gradient-primary text-white font-black rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Mulai Penjelajahan
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-vibrant opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          <Link
            href="/structure"
            className="px-10 py-5 glass premium-border text-foreground font-bold rounded-2xl hover:bg-foreground/5 hover:glow-primary transition-all"
          >
            Kenal Lebih Dekat
          </Link>
        </motion.div>
      </section>

      {/* Feature Cards with Premium Hover */}
      <section className="container mx-auto px-6 py-32 border-t border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Inovatif",
              desc: "Mengembangkan program kerja yang kreatif dan solutif, beradaptasi dengan teknologi dan tren masa kini.",
              icon: "01",
              iconBg: "bg-blue-500/10",
              iconColor: "text-blue-500"
            },
            {
              title: "Integritas",
              desc: "Membangun kepercayaan melalui kejujuran, transparansi, dan tanggung jawab penuh di setiap amanah.",
              icon: "02",
              iconBg: "bg-amber-500/10",
              iconColor: "text-amber-500"
            },
            {
              title: "Inklusif",
              desc: "Merangkul setiap keberagaman dan aspirasi, memastikan setiap suara warga sekolah didengar.",
              icon: "03",
              iconBg: "bg-emerald-500/10",
              iconColor: "text-emerald-500"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group p-10 glass rounded-[2.5rem] hover:bg-white dark:hover:bg-slate-900 border-[1.5px] border-border-strong/20 hover:border-brand-primary/50 transition-all relative overflow-hidden"
            >
              <div className={`${item.iconBg} ${item.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl mb-8 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
              <p className="text-foreground/70 leading-relaxed font-medium">{item.desc}</p>

              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.12] transition-opacity">
                <span className="text-8xl font-black">{item.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] md:rounded-[4rem] bg-brand-primary p-10 md:p-24 overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl shadow-brand-primary/30 border-2 border-white/20"
        >
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Siap Berkontribusi untuk SMKN 11?</h2>
            <p className="text-white/70 text-lg mb-0 font-medium italic">"Together we lead, forever we inspire. Bergabunglah dalam perjalanan inspiratif ini."</p>
          </div>
          <Link
            href="/login"
            className="relative z-10 px-10 py-5 bg-brand-accent text-brand-primary font-black rounded-2xl hover:scale-105 transition-transform shadow-xl"
          >
            Login Portal Siswa
          </Link>

          {/* Decor */}
          <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-white/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[200px] h-[200px] bg-brand-accent/20 blur-[60px] rounded-full" />
        </motion.div>
      </section>
    </main>
  );
}
