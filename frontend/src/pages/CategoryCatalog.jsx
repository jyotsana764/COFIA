import React, { useContext, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';

const categoryContent = {
  Jewellery: {
    eyebrow: 'COFIA · THE FINISHING TOUCH',
    title: 'Jewellery with a story',
    description: 'Discover occasion-ready pieces and everyday accents, selected to bring a little more meaning to the way you dress.',
    image: '/jewellery.png',
  },
  Perfumes: {
    eyebrow: 'COFIA · FIND YOUR SIGNATURE',
    title: 'Fragrance for every mood',
    description: 'Explore floral, fresh, woody, and warm scents made for quiet mornings and memorable evenings.',
    image: '/perfumes.png',
  },
};

const CategoryCatalog = ({ category }) => {
  const { products = [] } = useContext(ShopContext);
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sort, setSort] = useState('featured');
  const content = categoryContent[category];

  const categoryProducts = useMemo(
    () => products.filter((product) => product.category === category),
    [products, category]
  );

  const productTypes = useMemo(
    () => ['All', ...new Set(categoryProducts.map((product) => product.subcategory).filter(Boolean))],
    [categoryProducts]
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let result = categoryProducts.filter((product) => {
      const matchesType = selectedType === 'All' || product.subcategory === selectedType;
      const searchable = `${product.name} ${product.description} ${product.subcategory}`.toLowerCase();
      return matchesType && (!normalizedQuery || searchable.includes(normalizedQuery));
    });

    if (sort === 'price-low-high') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-high-low') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [categoryProducts, query, selectedType, sort]);

  if (!content) return null;

  return (
    <main className="pb-16">
      <section className="relative isolate mt-4 flex min-h-[330px] items-center overflow-hidden bg-[#f5eee6] sm:min-h-[390px]">
        <img
          src={content.image}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-35"
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
        <div className="max-w-2xl px-7 py-14 sm:px-14">
          <p className="text-xs font-semibold tracking-[0.24em] text-[#8e674f]">{content.eyebrow}</p>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-[#2d2925] sm:text-6xl">{content.title}</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#655c54] sm:text-base">{content.description}</p>
          <a href="#catalog" className="mt-7 inline-flex bg-[#302722] px-6 py-3 text-xs tracking-[0.14em] text-white hover:bg-[#795941]">
            EXPLORE THE COLLECTION
          </a>
        </div>
      </section>

      <section id="catalog" className="pt-12">
        <div className="flex flex-col gap-5 border-b border-[#e9e3dc] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.18em] text-[#9b785e]">CURATED FOR YOU</p>
            <h2 className="mt-2 font-serif text-3xl text-[#302722]">{category}</h2>
            <p className="mt-2 text-sm text-gray-500">{visibleProducts.length} pieces in this collection</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(190px,1fr)_170px_190px]">
            <label className="flex items-center gap-2 border border-gray-200 px-3">
              <Search size={16} className="text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${category.toLowerCase()}`}
                className="w-full py-3 text-sm outline-none"
              />
            </label>
            <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} className="border border-gray-200 bg-white px-3 py-3 text-sm">
              {productTypes.map((type) => <option key={type} value={type}>{type === 'All' ? 'All styles' : type}</option>)}
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="border border-gray-200 bg-white px-3 py-3 text-sm" aria-label="Sort products">
              <option value="featured">Sort: Featured</option>
              <option value="price-low-high">Price: Low to high</option>
              <option value="price-high-low">Price: High to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {visibleProducts.length ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductItem
                key={product.id || product._id}
                id={product.id || product._id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="font-serif text-2xl text-gray-800">No matching pieces</h3>
            <p className="mt-2 text-sm text-gray-500">Try another search or style filter.</p>
            <button
              type="button"
              onClick={() => { setQuery(''); setSelectedType('All'); }}
              className="mt-5 border border-gray-300 px-5 py-2 text-sm hover:border-black"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default CategoryCatalog;
