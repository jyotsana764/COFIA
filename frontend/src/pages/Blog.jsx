
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import blog1 from '../assets/blog/blog1.png';
import blog2 from '../assets/blog/blog2.png';
import blog3 from '../assets/blog/blog3.png';
import blog4 from '../assets/blog/blog4.png';
import blogBanner from '../assets/blog/blog-banner.png';

const API_URL = (
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
).replace(/\/$/, '');

const sampleBlogs = [
  {
    _id: 'cofia-fashion-1',
    title: 'The Art of Effortless Everyday Style',
    slug: 'effortless-everyday-style',
    category: 'STYLE GUIDE',
    author: 'COFIA Editorial Team',
    publishedAt: '2026-10-01',
    coverImage: blog1,
    excerpt:
      'Discover how timeless pieces, comfortable silhouettes, and thoughtful details can make everyday dressing feel special.',
    content: `Great style does not have to be complicated. The secret is choosing pieces that make you feel comfortable, confident, and true to yourself.

START WITH TIMELESS ESSENTIALS

Build your wardrobe around versatile pieces that work together. A well-fitted top, classic trousers, a comfortable kurta, or a simple dress can become the foundation of many different looks.

PLAY WITH COLOURS AND TEXTURES

Neutral shades are easy to combine, while a favourite colour can add personality. Try mixing different fabrics and textures to create an outfit that feels interesting without being overwhelming.

MAKE IT YOUR OWN

Accessories, footwear, and small details can transform a simple outfit. Choose what feels natural to you rather than following every trend.

THE COFIA STYLE NOTE

Wear what makes you feel confident. Personal style is not about having the biggest wardrobe; it is about making thoughtful choices with the pieces you love.`,
  },
  {
    _id: 'cofia-fashion-2',
    title: 'Festive Looks to Celebrate in Style',
    slug: 'festive-looks',
    category: 'FESTIVE EDIT',
    author: 'COFIA Editorial Team',
    publishedAt: '2026-10-05',
    coverImage: blog2,
    excerpt:
      'From colourful celebrations to elegant evening gatherings, discover festive outfit inspiration that expresses your personality.',
    content: `Festive dressing is a wonderful opportunity to celebrate colour, craftsmanship, and your own sense of style.

CHOOSE YOUR FESTIVE MOOD

For daytime celebrations, consider lighter colours, breathable fabrics, and comfortable silhouettes. For evening occasions, richer tones and elegant details can create a more dramatic look.

BALANCE YOUR OUTFIT

If your outfit has detailed embroidery or bold prints, keep the accessories simple. If you prefer a minimal outfit, statement earrings, a beautiful bag, or distinctive footwear can add interest.

COMFORT IS ALWAYS IN STYLE

Choose clothing that lets you enjoy the celebration. Consider the weather, the venue, and how long you will be wearing the outfit.

THE COFIA STYLE NOTE

The best festive look is one that feels like you. Mix traditional inspiration with your personal preferences to create something memorable.`,
  },
  {
    _id: 'cofia-fashion-3',
    title: 'Building a Wardrobe You Truly Love',
    slug: 'wardrobe-you-love',
    category: 'WARDROBE NOTES',
    author: 'COFIA Editorial Team',
    publishedAt: '2026-10-10',
    coverImage: blog3,
    excerpt:
      'Learn simple ways to choose versatile wardrobe favourites and create more outfits from the clothes you already own.',
    content: `A thoughtful wardrobe begins with understanding what you enjoy wearing. Instead of buying every new trend, focus on pieces that suit your lifestyle.

DISCOVER YOUR FAVOURITES

Look at the outfits you reach for most often. Notice the colours, fits, and fabrics that make you feel good. These can guide your future wardrobe choices.

THINK IN OUTFITS

Before buying something new, consider at least two or three ways you could wear it with pieces you already own. Versatility helps you make more of your wardrobe.

CARE FOR YOUR CLOTHES

Follow care labels, store delicate garments carefully, and repair small issues when possible. Taking care of clothing helps your favourite pieces last longer.

THE COFIA STYLE NOTE

A wardrobe you love is built over time. Choose thoughtfully, experiment freely, and let your style evolve with you.`,
  },
  {
    _id: 'cofia-fashion-4',
    title: 'Little Details That Complete Your Look',
    slug: 'details-that-complete-your-look',
    category: 'STYLE INSPIRATION',
    author: 'COFIA Editorial Team',
    publishedAt: '2026-10-15',
    coverImage: blog4,
    excerpt:
      'Explore how accessories, thoughtful colour combinations, and small finishing touches can bring an outfit together.',
    content: `Sometimes, the smallest details make an outfit feel complete. Thoughtful styling is about finding the right balance between your clothing, accessories, and personal taste.

CHOOSE ACCESSORIES WITH PURPOSE

A handbag, a pair of earrings, a watch, or a scarf can add character to an outfit. Select pieces that complement rather than compete with your look.

CREATE A BALANCED COLOUR PALETTE

Choose colours that work well together. You can keep your outfit neutral and add one standout accessory, or combine complementary shades for a more expressive look.

PAY ATTENTION TO THE FINISH

Well-maintained clothing, suitable footwear, and a comfortable fit can make a simple outfit look polished.

THE COFIA STYLE NOTE

There is no single formula for great style. Experiment with the details you love and let them reflect your personality.`,
  },
];

const formatDate = (date) => {
  if (!date) return '';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '';

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBlogs, setExpandedBlogs] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    const loadBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog/list`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load stories.');
        }

        setBlogs(
          Array.isArray(data.blogs) && data.blogs.length > 0
            ? data.blogs
            : sampleBlogs
        );
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('COFIA blog error:', error);
          setBlogs(sampleBlogs);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => controller.abort();
  }, []);

  const toggleArticle = (id) => {
    setExpandedBlogs((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  return (
    <main className="bg-white text-gray-900">
      {/* Classic COFIA banner — reduced height */}
      <section
        className="relative mx-auto flex min-h-[280px] max-w-[1400px] items-center justify-center overflow-hidden bg-cover bg-center px-5 py-10 text-center sm:min-h-[320px]"
        style={{ backgroundImage: `url(${blogBanner})` }}
      >
        <div className="absolute inset-0 bg-white/10" />

        <div className="relative z-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-700 sm:text-sm">
            COFIA JOURNAL
          </p>

          <h1 className="mt-5 font-serif text-4xl font-medium text-gray-900 sm:text-6xl">
            #ReadMore
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-800 sm:text-base">
            Discover fashion inspiration, thoughtful styling tips, festive
            looks, and stories that celebrate your personal style.
          </p>
        </div>
      </section>

      {/* Article collection */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {loading ? (
          <p className="py-16 text-center text-gray-500">
            Discovering our latest fashion stories...
          </p>
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {blogs.map((blog) => {
              const id = blog._id || blog.slug;
              const isExpanded = Boolean(expandedBlogs[id]);
              const image = blog.coverImage || '';

              return (
                <article
                  key={id}
                  className="border-b border-gray-200 pb-10 sm:pb-14"
                >
                  <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] sm:gap-10">
                    <div className="overflow-hidden bg-gray-100">
                      {image ? (
                        <img
                          src={image}
                          alt={blog.title}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.03] sm:aspect-[5/4]"
                        />
                      ) : (
                        <div className="flex aspect-[4/3] flex-col items-center justify-center bg-stone-100 text-stone-500">
                          <span className="font-serif text-4xl">
                            COFIA
                          </span>
                          <span className="mt-2 text-xs tracking-[0.25em]">
                            THE STYLE JOURNAL
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="py-2 md:py-6">
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                        {blog.category || 'COFIA STORIES'}
                      </p>

                      <h2 className="mt-4 font-serif text-2xl leading-snug sm:text-3xl">
                        {blog.title}
                      </h2>

                      {formatDate(blog.publishedAt || blog.createdAt) && (
                        <p className="mt-3 text-xs text-gray-500">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </p>
                      )}

                      {blog.author && (
                        <p className="mt-2 text-xs text-gray-500">
                          By {blog.author}
                        </p>
                      )}

                      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
                        {blog.excerpt}
                      </p>

                      <button
                        type="button"
                        onClick={() => toggleArticle(id)}
                        aria-expanded={isExpanded}
                        className="mt-7 inline-flex border-b border-black pb-2 text-xs uppercase tracking-[0.2em] transition hover:border-gray-500 hover:text-gray-500"
                      >
                        {isExpanded ? 'SHOW LESS' : 'READ MORE'}
                        <span className="ml-2" aria-hidden="true">
                          {isExpanded ? '↑' : '→'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <section
                      aria-label={`Full article: ${blog.title}`}
                      className="mx-auto mt-8 max-w-3xl border-t border-gray-200 pt-8 sm:mt-12"
                    >
                      <h3 className="font-serif text-2xl leading-snug sm:text-3xl">
                        {blog.title}
                      </h3>

                      <div className="mt-6 whitespace-pre-line break-words text-sm leading-8 text-gray-700 sm:text-base">
                        {blog.content ||
                          blog.excerpt ||
                          'The full story will be available soon.'}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleArticle(id)}
                        className="mt-8 border-b border-black pb-2 text-xs uppercase tracking-[0.2em] transition hover:text-gray-500"
                      >
                        SHOW LESS ↑
                      </button>
                    </section>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            to="/collection"
            className="inline-block bg-black px-7 py-3 text-xs tracking-widest text-white transition hover:bg-gray-700"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Blog;
