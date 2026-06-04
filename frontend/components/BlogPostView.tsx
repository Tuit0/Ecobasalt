"use client";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2, ArrowUpRight } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { blogImage } from "@/lib/sample-images";

type BlogPost = {
  id: number;
  slug: string;
  category: "tech" | "industry" | "project" | "eco";
  cover_image?: string;
  title_uz: string; title_ru: string; title_en: string;
  excerpt_uz: string; excerpt_ru: string; excerpt_en: string;
  body_uz: string; body_ru: string; body_en: string;
  min_read: number;
  published_at?: string;
};

export default function BlogPostView({ slug }: { slug: string }) {
  const { lang } = useLang();
  const { data: post, error } = useSWR<BlogPost>(`/api/blog/by-slug/${slug}`, fetcher);
  const { data: all = [] } = useSWR<BlogPost[]>("/api/blog", fetcher);

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="h-display text-pearl-100 text-4xl mb-4">404</h1>
        <Link href="/blog" className="btn-gold">
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
          {t(lang, "nav.blog")}
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="h-8 bg-onyx-800 w-32 mb-8" />
        <div className="aspect-video bg-onyx-800 mb-8" />
        <div className="h-12 bg-onyx-800 w-3/4" />
      </div>
    );
  }

  const related = all.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);
  const title = pickLang(post, lang, "title");
  const excerpt = pickLang(post, lang, "excerpt");
  const body = pickLang(post, lang, "body");

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
        year: "numeric", month: "long", day: "numeric"
      })
    : "";

  // Markdown-like: **bold** va paragraflar
  const renderBody = (b: string) =>
    b.split("\n\n").map((para, i) => {
      const html = para
        .replace(/^\*\*(.+?)\*\*/g, '<strong class="text-pearl-100 block mt-2 mb-1 font-semibold">$1</strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-pearl-100 font-semibold">$1</strong>');
      return (
        <p
          key={i}
          className="text-pearl-200 leading-relaxed mb-5 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    });

  return (
    <article className="py-12 sm:py-16 bg-onyx-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pearl-100/5 border border-pearl-100/10 text-pearl-200 hover:text-pearl-100 hover:bg-pearl-100/10 text-sm font-medium mb-10 transition-all backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {t(lang, "nav.blog")}
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="badge-pill mb-5">
            {t(lang, `blog.cat_${post.category}`)}
          </span>
          <h1 className="h-display text-pearl-100 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-5 sm:mb-6 text-balance leading-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs sm:text-sm text-pearl-300 font-medium">
            {dateStr && (
              <span className="flex items-center gap-2">
                <Calendar className="w-3 h-3" strokeWidth={2} />
                {dateStr}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Clock className="w-3 h-3" strokeWidth={2} />
              {post.min_read} {t(lang, "blog.min_read")}
            </span>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="aspect-[5/3] rounded-3xl border border-pearl-100/8 overflow-hidden mb-12 relative shadow-2xl shadow-black/30"
        >
          <img
            src={post.cover_image || blogImage(post.slug)}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/40 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none mb-16"
        >
          {excerpt && (
            <p className="text-pearl-100 text-xl leading-relaxed mb-8 font-medium border-l-2 border-gold-400 pl-6">
              {excerpt}
            </p>
          )}
          <div className="text-base md:text-lg">{body && renderBody(body)}</div>
        </motion.div>

        <div className="border-t border-b border-pearl-100/8 py-6 mb-16 flex items-center justify-between">
          <span className="text-xs text-pearl-300 font-semibold">SHARE</span>
          <div className="flex gap-2">
            {["Telegram", "Facebook", "LinkedIn"].map((s) => (
              <button
                key={s}
                className="px-3 py-1.5 rounded-full bg-pearl-100/5 border border-pearl-100/10 text-xs text-pearl-200 hover:text-gold-400 hover:border-gold-400/30 transition-all font-medium flex items-center gap-1.5"
              >
                <Share2 className="w-3 h-3" strokeWidth={2} />
                {s}
              </button>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <span className="badge-pill mb-6">RELATED ARTICLES</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group block overflow-hidden rounded-3xl bg-onyx-800/40 border border-pearl-100/5 hover:border-gold-400/40 transition-all duration-500 backdrop-blur-sm hover:-translate-y-1"
                >
                  <div className="aspect-[5/3] overflow-hidden relative">
                    <img
                      src={p.cover_image || blogImage(p.slug)}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="h-display text-pearl-100 text-base mb-2 group-hover:text-gold-400 transition-colors line-clamp-2 leading-tight">
                      {pickLang(p, lang, "title")}
                    </h3>
                    <div className="flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.1em] font-semibold mt-3">
                      {t(lang, "blog.read")}
                      <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
