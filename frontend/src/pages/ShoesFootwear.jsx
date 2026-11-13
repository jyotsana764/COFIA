import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { footwearProducts } from "../data/footwearProducts";

const formatPrice = (price) =>
  `₹${Number(price).toLocaleString("en-IN")}`;

const ShoesFootwear = () => {
  const navigate = useNavigate();
  const shopContext = useContext(ShopContext) || {};

  const wishlistItems = Array.isArray(shopContext.wishlistItems)
    ? shopContext.wishlistItems
    : [];

  const toggleWishlist = shopContext.toggleWishlist;

  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [searchTerm, setSearchTerm] = useState("");

  const availableCategories = useMemo(() => {
    const categories = footwearProducts
      .filter(
        (product) =>
          selectedGender === "All" ||
          product.gender === selectedGender
      )
      .map((product) => product.category);

    return [...new Set(categories)];
  }, [selectedGender]);

  const filteredProducts = useMemo(() => {
    let result = footwearProducts.filter((product) => {
      const matchesGender =
        selectedGender === "All" ||
        product.gender === selectedGender;

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesPrice = product.price <= maxPrice;
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.gender.toLowerCase().includes(search) ||
        product.subcategory.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search);

      return (
        matchesGender &&
        matchesCategory &&
        matchesPrice &&
        matchesSearch
      );
    });

    if (sortBy === "price-low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [
    selectedGender,
    selectedCategory,
    maxPrice,
    searchTerm,
    sortBy,
  ]);

  const changeGender = (gender) => {
    setSelectedGender(gender);
    setSelectedCategory("All");
  };

  const clearFilters = () => {
    setSelectedGender("All");
    setSelectedCategory("All");
    setSortBy("featured");
    setMaxPrice(3000);
    setSearchTerm("");
  };

  const openProductDetails = (product) => {
    navigate(`/product/${product.id}`, {
      state: { product },
    });
  };

  const isWishlisted = (productId) =>
    wishlistItems.some(
      (item) =>
        String(item?._id || item?.id || item) === String(productId)
    );

  const handleWishlist = (productId) => {
    if (typeof toggleWishlist === "function") {
      toggleWishlist(productId);
    }
  };

  return (
    <>
      <style>{`
        .footwear-page { color:#24201e; background:#fff; overflow:hidden; font-family:inherit; }
        .footwear-page * { box-sizing:border-box; }
        .footwear-hero { min-height:520px; display:grid; grid-template-columns:1fr .85fr; background:#f4eee8; }
        .footwear-hero-content { display:flex; flex-direction:column; justify-content:center; align-items:flex-start; padding:65px 9%; }
        .footwear-eyebrow,.footwear-section-eyebrow { color:#9b725c; font-size:11px; font-weight:700; letter-spacing:3px; }
        .footwear-hero h1 { margin:18px 0; font-size:clamp(38px,5vw,66px); line-height:1.12; font-weight:500; }
        .footwear-hero h1 span,.footwear-section-heading h2 span { color:#a16d51; font-family:Georgia,serif; font-style:italic; }
        .footwear-hero-description { max-width:470px; color:#70665f; font-size:14px; line-height:1.9; }
        .footwear-shop-button,.footwear-promo button { border:1px solid #29221e; background:#29221e; color:white; padding:15px 24px; margin-top:20px; font-size:11px; letter-spacing:1.5px; cursor:pointer; transition:.25s; }
        .footwear-shop-button:hover,.footwear-promo button:hover { background:#a16d51; border-color:#a16d51; }
        .footwear-highlights { display:flex; flex-wrap:wrap; gap:16px; margin-top:35px; color:#756960; font-size:11px; }
        .footwear-highlights span::before { content:"✓"; color:#a16d51; margin-right:6px; }
        .footwear-hero-image { position:relative; min-height:520px; overflow:hidden; background:#e8ddd2; }
        .footwear-hero-image>img { width:100%; height:100%; min-height:520px; object-fit:cover; display:block; }
        .footwear-image-label { position:absolute; bottom:25px; left:25px; display:flex; flex-direction:column; gap:8px; padding:18px 24px; background:rgba(255,255,255,.92); }
        .footwear-image-label span { font-size:9px; letter-spacing:2px; color:#96715b; }
        .footwear-image-label strong { font-family:Georgia,serif; font-size:22px; font-weight:500; }
        .footwear-collection { max-width:1450px; margin:auto; padding:75px 5%; }
        .footwear-section-heading { text-align:center; margin-bottom:35px; }
        .footwear-section-heading h2 { margin:12px 0; font-size:clamp(30px,4vw,43px); font-weight:500; }
        .footwear-section-heading>p:last-child { color:#827870; font-size:13px; }
        .footwear-gender-filters { display:flex; justify-content:center; flex-wrap:wrap; gap:12px; margin:30px 0; }
        .footwear-gender-button { border:1px solid #e1d8d1; background:white; padding:12px 25px; cursor:pointer; color:#4b4039; font-size:12px; transition:.2s; }
        .footwear-gender-button:hover,.footwear-gender-button.active { color:white; background:#302722; border-color:#302722; }
        .footwear-toolbar { display:grid; grid-template-columns:2fr 1fr 1fr; gap:12px; margin:30px 0 20px; }
        .footwear-search,.footwear-select { width:100%; min-width:0; padding:13px 14px; border:1px solid #e4ddd7; background:white; color:#38312d; outline:none; font:inherit; font-size:12px; }
        .footwear-search:focus,.footwear-select:focus { border-color:#a16d51; }
        .footwear-price-filter { display:flex; align-items:center; gap:25px; padding:15px 0; color:#655b54; font-size:12px; }
        .footwear-price-filter input { flex:1; accent-color:#9d7055; cursor:pointer; }
        .footwear-results-header { display:flex; justify-content:space-between; align-items:center; margin:20px 0; font-size:12px; color:#766b63; }
        .footwear-clear-button { border:0; background:transparent; color:#94694f; text-decoration:underline; cursor:pointer; font-size:12px; }
        .footwear-product-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:28px 18px; }
        .footwear-product-card { min-width:0; background:#fff; border:1px solid #eee8e3; transition:transform .25s,box-shadow .25s; }
        .footwear-product-card:hover { transform:translateY(-4px); box-shadow:0 12px 30px rgba(50,35,25,.09); }
        .footwear-product-image { position:relative; overflow:hidden; background:#f5f1ed; aspect-ratio:4/5; }
        .footwear-image-button { display:block; width:100%; height:100%; padding:0; border:0; background:transparent; cursor:pointer; }
        .footwear-image-button img { display:block; width:100%; height:100%; object-fit:cover; transition:transform .45s; }
        .footwear-product-card:hover .footwear-image-button img { transform:scale(1.05); }
        .footwear-product-badge { position:absolute; top:12px; left:12px; background:rgba(255,255,255,.94); padding:7px 10px; font-size:10px; color:#51453d; pointer-events:none; }
        .footwear-wishlist { position:absolute; top:10px; right:10px; width:35px; height:35px; display:grid; place-items:center; border:0; border-radius:50%; background:white; color:#4d4038; font-size:23px; cursor:pointer; }
        .footwear-wishlist.active { color:#b53e47; }
        .footwear-quick-view { position:absolute; bottom:0; left:0; width:100%; padding:13px; border:0; background:rgba(42,33,28,.94); color:white; font-size:10px; letter-spacing:2px; cursor:pointer; opacity:0; transform:translateY(100%); transition:.25s; }
        .footwear-product-card:hover .footwear-quick-view,.footwear-quick-view:focus { opacity:1; transform:translateY(0); }
        .footwear-product-info { padding:17px 15px; }
        .footwear-product-category { margin:0 0 9px; color:#a07861; font-size:10px; text-transform:uppercase; letter-spacing:1px; }
        .footwear-product-name { display:block; width:100%; padding:0; border:0; background:transparent; text-align:left; color:#302722; font-size:14px; font-weight:600; cursor:pointer; }
        .footwear-product-name:hover { color:#a16d51; }
        .footwear-product-description { min-height:36px; margin:9px 0 15px; color:#827870; font-size:11px; line-height:1.65; }
        .footwear-product-bottom { display:flex; align-items:center; justify-content:space-between; gap:8px; border-top:1px solid #f0ebe7; padding-top:13px; }
        .footwear-product-bottom strong { color:#342a24; font-size:14px; }
        .footwear-product-bottom button { border:0; background:transparent; color:#9b7056; cursor:pointer; font-size:10px; white-space:nowrap; }
        .footwear-empty-state { text-align:center; padding:70px 20px; background:#faf7f4; }
        .footwear-empty-icon { font-size:45px; color:#a16d51; }
        .footwear-empty-state h3 { font-family:Georgia,serif; font-size:27px; font-weight:500; }
        .footwear-empty-state p { color:#827870; font-size:13px; }
        .footwear-empty-state button { margin-top:15px; padding:12px 22px; border:0; background:#302722; color:white; cursor:pointer; }
        .footwear-promo { text-align:center; padding:65px 20px; background:#eee4dc; }
        .footwear-promo>p { color:#9b7056; font-size:10px; letter-spacing:3px; }
        .footwear-promo h2 { margin:15px 0; font-family:Georgia,serif; font-size:clamp(30px,4vw,44px); font-weight:500; }
        .footwear-promo span { color:#756960; font-size:13px; }
        .footwear-promo button { display:block; margin:25px auto 0; }
        @media(max-width:1000px) { .footwear-product-grid { grid-template-columns:repeat(3,minmax(0,1fr)); } .footwear-hero-content { padding:45px 7%; } }
        @media(max-width:700px) { .footwear-hero { grid-template-columns:1fr; } .footwear-hero-content { padding:45px 7%; } .footwear-hero-image,.footwear-hero-image>img { min-height:350px; height:350px; } .footwear-collection { padding:50px 5%; } .footwear-toolbar { grid-template-columns:1fr; } .footwear-product-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px 12px; } .footwear-product-info { padding:12px 10px; } .footwear-product-name { font-size:12px; } .footwear-product-description { font-size:10px; } .footwear-product-bottom { flex-wrap:wrap; } .footwear-price-filter { align-items:flex-start; flex-direction:column; gap:12px; } .footwear-price-filter input { width:100%; flex:auto; } }
        @media(max-width:380px) { .footwear-product-grid { grid-template-columns:1fr; } }
        @media(hover:none) { .footwear-quick-view { opacity:1; transform:translateY(0); } }
      `}</style>

      <main className="footwear-page">
        <section className="footwear-hero">
          <div className="footwear-hero-content">
            <p className="footwear-eyebrow">COFIA · STEP INTO STYLE</p>

            <h1>
              Find Your <span>Perfect Pair</span>
            </h1>

            <p className="footwear-hero-description">
              Discover footwear for every moment, from everyday
              essentials and modern sneakers to elegant heels
              and traditional festive styles.
            </p>

            <button
              type="button"
              className="footwear-shop-button"
              onClick={() =>
                document
                  .getElementById("footwear-products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              SHOP THE COLLECTION →
            </button>

            <div className="footwear-highlights">
              <span>Everyday Comfort</span>
              <span>Modern Designs</span>
              <span>Styles for Everyone</span>
            </div>
          </div>

          <div className="footwear-hero-image">
            <img
              src="/uploads/04_womens_embellished_block_heels.png"
              alt="COFIA footwear collection"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "https://placehold.co/800x900/f5f1ec/555555?text=COFIA+Footwear";
              }}
            />

            <div className="footwear-image-label">
              <span>THE FOOTWEAR EDIT</span>
              <strong>Style every step.</strong>
            </div>
          </div>
        </section>

        <section
          id="footwear-products"
          className="footwear-collection"
        >
          <header className="footwear-section-heading">
            <p className="footwear-section-eyebrow">
              MADE FOR EVERY STEP
            </p>

            <h2>
              Shoes & <span>Footwear</span>
            </h2>

            <p>
              Explore stylish, comfortable footwear for women,
              men, and kids.
            </p>
          </header>

          <nav
            className="footwear-gender-filters"
            aria-label="Filter footwear by collection"
          >
            {["All", "Women", "Men", "Kids"].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => changeGender(gender)}
                className={
                  selectedGender === gender
                    ? "footwear-gender-button active"
                    : "footwear-gender-button"
                }
              >
                {gender === "All" ? "All Collections" : gender}
              </button>
            ))}
          </nav>

          <div className="footwear-toolbar">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search shoes, sandals, sneakers..."
              aria-label="Search footwear"
              className="footwear-search"
            />

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              className="footwear-select"
              aria-label="Filter by footwear category"
            >
              <option value="All">All Categories</option>

              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="footwear-select"
              aria-label="Sort footwear"
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <div className="footwear-price-filter">
            <label htmlFor="footwear-price">
              Maximum Price: <strong>{formatPrice(maxPrice)}</strong>
            </label>

            <input
              id="footwear-price"
              type="range"
              min="500"
              max="3000"
              step="100"
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(Number(event.target.value))
              }
            />
          </div>

          <div className="footwear-results-header">
            <p>
              Showing <strong>{filteredProducts.length}</strong> products
            </p>

            <button
              type="button"
              className="footwear-clear-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="footwear-product-grid">
              {filteredProducts.map((product) => {
                const wishlisted = isWishlisted(product.id);

                return (
                  <article
                    key={product.id}
                    className="footwear-product-card"
                  >
                    <div className="footwear-product-image">
                      <button
                        type="button"
                        className="footwear-image-button"
                        onClick={() => openProductDetails(product)}
                        aria-label={`View ${product.name}`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src =
                              "https://placehold.co/600x800/f5f5f5/555555?text=Footwear";
                          }}
                        />
                      </button>

                      <span className="footwear-product-badge">
                        {product.gender}
                      </span>

                      <button
                        type="button"
                        className={
                          wishlisted
                            ? "footwear-wishlist active"
                            : "footwear-wishlist"
                        }
                        onClick={() => handleWishlist(product.id)}
                        aria-label={
                          wishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        aria-pressed={wishlisted}
                      >
                        {wishlisted ? "♥" : "♡"}
                      </button>

                      <button
                        type="button"
                        className="footwear-quick-view"
                        onClick={() => openProductDetails(product)}
                      >
                        QUICK VIEW
                      </button>
                    </div>

                    <div className="footwear-product-info">
                      <p className="footwear-product-category">
                        {product.category} · {product.subcategory}
                      </p>

                      <button
                        type="button"
                        className="footwear-product-name"
                        onClick={() => openProductDetails(product)}
                      >
                        {product.name}
                      </button>

                      <p className="footwear-product-description">
                        {product.description}
                      </p>

                      <div className="footwear-product-bottom">
                        <strong>{formatPrice(product.price)}</strong>

                        <button
                          type="button"
                          onClick={() => openProductDetails(product)}
                        >
                          View Product →
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="footwear-empty-state">
              <div className="footwear-empty-icon">⌕</div>

              <h3>No footwear found</h3>

              <p>
                Try another search term or change your filters
                to discover more styles.
              </p>

              <button type="button" onClick={clearFilters}>
                View All Footwear
              </button>
            </div>
          )}
        </section>

        <section className="footwear-promo">
          <p>YOUR STYLE, YOUR EVERY STEP</p>

          <h2>Good Shoes Take You Places.</h2>

          <span>
            Discover your next favourite pair with COFIA.
          </span>

          <button type="button" onClick={clearFilters}>
            EXPLORE ALL STYLES
          </button>
        </section>
      </main>
    </>
  );
};

export default ShoesFootwear;