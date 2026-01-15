"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

const posts = [
  {
    title: "Come Scrivere un Contratto Freelance Perfetto",
    excerpt: "Guida completa alle clausole essenziali per proteggere il tuo lavoro da freelancer.",
    date: "10 Gen 2026",
    category: "Guide",
  },
  {
    title: "NDA: Quando Serve e Come Funziona",
    excerpt: "Tutto quello che devi sapere sugli accordi di non divulgazione.",
    date: "8 Gen 2026",
    category: "Legale",
  },
  {
    title: "5 Errori da Evitare nei Contratti",
    excerpt: "Gli errori più comuni che possono costarti caro e come evitarli.",
    date: "5 Gen 2026",
    category: "Tips",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-400">
              Guide, consigli e news sul mondo dei contratti.
            </p>
          </div>

          <div className="space-y-6">
            {posts.map((post, index) => (
              <article 
                key={index}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-violet-400 font-medium group-hover:gap-2 transition-all">
                  Leggi <ArrowRight className="w-4 h-4" />
                </span>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500">Altri articoli in arrivo...</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
