import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

export const products = [
  {
    id: 1,
    name: "Classic Maroon Embroidered Kurta",
    gender: "Men",
    category: "Kurtas",
    subcategory: "Short Kurtas",
    price: 1299,
    image: "/uploads/1741703232761.jpg",
  },
  {
    id: 2,
    name: "Festive Teal Embroidered Kurta",
    gender: "Men",
    category: "Kurtas",
    subcategory: "Embroidered Kurtas",
    price: 1899,
    image: "/uploads/1741703362279.jpg",
  },
  {
    id: 3,
    name: "Ivory Kurta-Pajama Set",
    gender: "Men",
    category: "Kurta-Pajama Sets",
    subcategory: "Cotton Sets",
    price: 1999,
    image: "/uploads/1741703947185.jpg",
  },
  {
    id: 4,
    name: "Blue Embroidered Kurta-Pajama Set",
    gender: "Men",
    category: "Kurta-Pajama Sets",
    subcategory: "Embroidered Sets",
    price: 2799,
    image: "/uploads/1741703979896.jpg",
  },
  {
    id: 5,
    name: "Pink Floral Lehenga Set",
    gender: "Women",
    category: "Lehengas",
    subcategory: "Festive Lehengas",
    price: 2299,
    image: "/uploads/1741704216964.jpg",
  },
  {
    id: 6,
    name: "Pastel Embroidered Lehenga",
    gender: "Women",
    category: "Lehengas",
    subcategory: "Embroidered Lehengas",
    price: 1599,
    image: "/uploads/1741704239159.jpg",
  },
  {
    id: 7,
    name: "Ivory Bridal Lehenga",
    gender: "Women",
    category: "Lehengas",
    subcategory: "Bridal Lehengas",
    price: 4999,
    image: "/uploads/1741704258496.jpg",
  },
  {
    id: 8,
    name: "Classic Ivory Pathani Suit",
    gender: "Men",
    category: "Pathani Suits",
    subcategory: "Classic Pathani Suits",
    price: 2499,
    image: "/uploads/1741704308704.jpg",
  },
  {
    id: 9,
    name: "Green Embroidered Indo-Western Set",
    gender: "Men",
    category: "Indo-Western Sets",
    subcategory: "Festive Indo-Western Sets",
    price: 3499,
    image: "/uploads/1741704335620.jpg",
  },
  {
    id: 10,
    name: "Ivory and Gold Embroidered Saree",
    gender: "Women",
    category: "Sarees",
    subcategory: "Silk Sarees",
    price: 3499,
    image: "/uploads/1741704407605.jpg",
  },
  {
    id: 30,
    name: "Traditional Red Embroidered Kurta Pajama for Boys",
    gender: "Kids",
    category: "Boys' Ethnic Wear",
    subcategory: "Kurta Pajama Sets",
    price: 999,
    image: "/uploads/01_red_kurta_boy.png",
  },
  {
    id: 11,
    name: "Banarasi Gold Festive Saree",
    gender: "Women",
    category: "Sarees",
    subcategory: "Banarasi Sarees",
    price: 3999,
    image: "/uploads/1741704426017.jpg",
  },
  {
    id: 12,
    name: "Red Bridal Lehenga Set",
    gender: "Women",
    category: "Lehengas",
    subcategory: "Bridal Lehengas",
    price: 4999,
    image: "/uploads/1741704460479.jpg",
  },
  {
    id: 13,
    name: "Pink Floral Embroidered Lehenga",
    gender: "Women",
    category: "Lehengas",
    subcategory: "Festive Lehengas",
    price: 3299,
    image: "/uploads/1741704486058.jpg",
  },
  {
    id: 31,
    name: "Royal Blue Embroidered Sherwani for Boys",
    gender: "Kids",
    category: "Boys' Ethnic Wear",
    subcategory: "Sherwani Sets",
    price: 2499,
    image: "/uploads/02_blue_sherwani_boy.png",
  },
  {
    id: 33,
    name: "Pink Floral Lehenga Choli for Girls",
    gender: "Kids",
    category: "Girls' Ethnic Wear",
    subcategory: "Lehenga Choli",
    price: 1799,
    image: "/uploads/04_pink_floral_lehenga_girl.png",
  },
  {
    id: 14,
    name: "Classic Olive Embroidered Kurta",
    gender: "Men",
    category: "Kurtas",
    subcategory: "Embroidered Kurtas",
    price: 2799,
    image: "/uploads/1741709954333.jpg",
  },
  {
    id: 15,
    name: "Plum Embroidered Regal Sherwani Set",
    gender: "Men",
    category: "Sherwanis",
    subcategory: "Groom Wear",
    price: 2199,
    image: "/uploads/1741709979637.jpg",
  },
  {
    id: 16,
    name: "Gold Embroidered Ethnic Gown",
    gender: "Women",
    category: "Traditional Gowns",
    subcategory: "Embroidered Gowns",
    price: 3799,
    image: "/uploads/1741710016927.jpg",
  },
  {
    id: 34,
    name: "Yellow Traditional Ghagra Choli for Girls",
    gender: "Kids",
    category: "Girls' Ethnic Wear",
    subcategory: "Ghagra Choli",
    price: 1499,
    image: "/uploads/05_yellow_ghagra_choli_girl.png",
  },
  {
    id: 17,
    name: "Embroidered Navratri Chaniya Choli",
    gender: "Women",
    category: "Chaniya Choli",
    subcategory: "Navratri Chaniya Choli",
    price: 2999,
    image: "/uploads/1741710176818.jpg",
  },
  {
    id: 35,
    name: "Red Embroidered Lehenga for Girls",
    gender: "Kids",
    category: "Girls' Ethnic Wear",
    subcategory: "Wedding Wear",
    price: 2299,
    image: "/uploads/06_red_lehenga_girl.png",
  },
  {
    id: 36,
    name: "Green Traditional Kurta Set for Boys",
    gender: "Kids",
    category: "Boys' Ethnic Wear",
    subcategory: "Festive Wear",
    price: 1299,
    image: "/uploads/07_green_kurta_boy.png",
  },
  {
    id: 37,
    name: "Peach Embroidered Anarkali Dress for Girls",
    gender: "Kids",
    category: "Girls' Ethnic Wear",
    subcategory: "Anarkali Dresses",
    price: 1699,
    image: "/uploads/08_peach_anarkali_girl.png",
  },
  {
    id: 18,
    name: "Festive Kurti-Palazzo Set",
    gender: "Women",
    category: "Kurti Sets",
    subcategory: "Kurti-Palazzo Sets",
    price: 1899,
    image: "/uploads/1741752086982.jpg",
  },
  {
    id: 19,
    name: "Luxury Embroidered Men's Sherwani Set",
    gender: "Men",
    category: "Sherwani Sets",
    subcategory: "Embroidered Sherwanis",
    price: 3199,
    image: "/uploads/1741752260984.jpg",
  },
  {
    id: 38,
    name: "Cream Traditional Dhoti Kurta Set for Boys",
    gender: "Kids",
    category: "Boys' Ethnic Wear",
    subcategory: "Dhoti Kurta Sets",
    price: 1399,
    image: "/uploads/01_cream_dhoti_kurta_boy.png",
  },
  {
    id: 39,
    name: "Mint Green Indo-Western Outfit for Boys",
    gender: "Kids",
    category: "Boys' Ethnic Wear",
    subcategory: "Indo-Western Sets",
    price: 1999,
    image: "/uploads/02_mint_indo_western_set_boy.png",
  },
  {
    id: 20,
    name: "Premium Floral Indo-Western Jacket Set",
    gender: "Men",
    category: "Indo-Western Sets",
    subcategory: "Jacket Trousers Sets",
    price: 3299,
    image: "/uploads/1741960603310.jpg",
  },
  {
    id: 21,
    name: "Intricate Embroidered Sharara Set",
    gender: "Women",
    category: "Sharara Sets",
    subcategory: "Embroidered Sharara Sets",
    price: 4999,
    image: "/uploads/1742793605001.jpg",
  },
  {
    id: 22,
    name: "Printed Floral Lehenga Choli Set",
    gender: "Women",
    category: "Lehenga Cholis",
    subcategory: "Printed Lehengas",
    price: 4599,
    image: "/uploads/1742793921382.jpg",
  },
  {
    id: 23,
    name: "Embellished Silk Lehenga Set",
    gender: "Women",
    category: "Lehenga Sets",
    subcategory: "Embellished Lehengas",
    price: 5199,
    image: "/uploads/1742793961953.jpg",
  },
  {
    id: 24,
    name: "Cream Embroidered Wedding Outfit",
    gender: "Women",
    category: "Ethnic Suits",
    subcategory: "Wedding Wear",
    price: 6495,
    image: "/uploads/1742794005759.jpg",
  },
  {
    id: 25,
    name: "Luxury Sequinned Lehenga Choli",
    gender: "Women",
    category: "Cholis",
    subcategory: "Heavy Work Lehengas",
    price: 7509,
    image: "/uploads/1742794045866.jpg",
  },
  {
    id: 40,
    name: "White and Red Traditional Dhoti Set for Boys",
    gender: "Kids",
    category: "Boys' Ethnic Wear",
    subcategory: "Traditional Dhoti Sets",
    price: 1299,
    image: "/uploads/03_white_red_dhoti_set_boy.png",
  },
  {
    id: 41,
    name: "Yellow Traditional Dhoti Set for Boys",
    gender: "Kids",
    category: "Boys' Ethnic Wear",
    subcategory: "Traditional Dhoti Sets",
    price: 1199,
    image: "/uploads/04_yellow_traditional_dhoti_set_boy.png",
  },
  {
    id: 42,
    name: "Lavender Embroidered Sharara Suit for Girls",
    gender: "Kids",
    category: "Girls' Ethnic Wear",
    subcategory: "Sharara Suits",
    price: 1899,
    image: "/uploads/05_lavender_sharara_suit_girl.png",
  },
  {
    id: 43,
    name: "Pink Traditional Punjabi Salwar Suit for Girls",
    gender: "Kids",
    category: "Girls' Ethnic Wear",
    subcategory: "Punjabi Suits",
    price: 1599,
    image: "/uploads/06_pink_punjabi_salwar_suit_girl.png",
  },
  {
    id: 44,
    name: "Colorful Gujarati Chaniya Choli for Girls",
    gender: "Kids",
    category: "Girls' Ethnic Wear",
    subcategory: "Chaniya Choli",
    price: 1999,
    image: "/uploads/07_colorful_gujarati_chaniya_choli_girl.png",
  },
  {
    id: 45,
    name: "Traditional Silk Pattu Pavadai for Girls",
    gender: "Kids",
    category: "Girls' Ethnic Wear",
    subcategory: "Pattu Pavadai",
    price: 2199,
    image: "/uploads/08_silk_pattu_pavadai_girl.png",
  },
  {
    id: 26,
    name: "Anita Dongre Faiyaz Silk Sherwani Set",
    gender: "Men",
    category: "Sherwani Sets",
    subcategory: "Embroidered Sherwanis",
    price: 2736,
    image: "/uploads/1742794110674.jpg",
  },
  {
    id: 27,
    name: "Anita Dongre Kulish Embroidered Sherwani Set",
    gender: "Men",
    category: "Sherwani Sets",
    subcategory: "Embroidered Sherwanis",
    price: 1699,
    image: "/uploads/1742794153949.jpg",
  },
  {
    id: 28,
    name: "Anita Dongre Navy Embroidered Bundi Set",
    gender: "Men",
    category: "Indo-Western Sets",
    subcategory: "Bundi Kurta Sets",
    price: 3699,
    image: "/uploads/1742794199842.jpg",
  },
  {
    id: 29,
    name: "Anita Dongre Cream Pichhwai Print Sherwani",
    gender: "Men",
    category: "Sherwani Sets",
    subcategory: "Printed Sherwanis",
    price: 2899,
    image: "/uploads/1742794352561.jpg",
  },
];

const getCartCount = (cart) => {
  if (Array.isArray(cart)) {
    return cart.reduce((total, item) => {
      const quantity = Number(item?.quantity ?? 1);

      return (
        total +
        (Number.isFinite(quantity) && quantity > 0 ? quantity : 0)
      );
    }, 0);
  }

  if (cart && typeof cart === "object") {
    return Object.values(cart).reduce((total, item) => {
      if (typeof item === "number") {
        return (
          total +
          (Number.isFinite(item) && item > 0 ? item : 0)
        );
      }

      const quantity = Number(item?.quantity ?? 1);

      return (
        total +
        (Number.isFinite(quantity) && quantity > 0 ? quantity : 0)
      );
    }, 0);
  }

  return 0;
};

const readCartCount = () => {
  try {
    return getCartCount(
      JSON.parse(localStorage.getItem("cofia-cart") || "[]")
    );
  } catch (error) {
    console.error("Unable to read cart count:", error);
    return 0;
  }
};

const EthnicWear = () => {
  const navigate = useNavigate();

  // Use the shared wishlist from ShopContext.
  const {
    wishlistItems = [],
    toggleWishlist,
  } = useContext(ShopContext);

  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(8000);
  const [sortBy, setSortBy] = useState("featured");
  const [cartCount, setCartCount] = useState(readCartCount);
  const [isTraditionalOpen, setIsTraditionalOpen] = useState(true);

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(readCartCount());
    };

    updateCartCount();

    window.addEventListener("focus", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("focus", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const availableCategories = useMemo(() => {
    const categories = products
      .filter(
        (product) =>
          selectedGender === "All" ||
          product.gender.toLowerCase() === selectedGender.toLowerCase()
      )
      .map((product) => product.category);

    return [...new Set(categories)];
  }, [selectedGender]);

  const availableSubcategories = useMemo(() => {
    const subcategories = products
      .filter(
        (product) =>
          (selectedGender === "All" ||
            product.gender.toLowerCase() === selectedGender.toLowerCase()) &&
          (selectedCategory === "All" ||
            product.category === selectedCategory)
      )
      .map((product) => product.subcategory);

    return [...new Set(subcategories)];
  }, [selectedGender, selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (product) =>
        (selectedGender === "All" ||
          product.gender.toLowerCase() === selectedGender.toLowerCase()) &&
        (selectedCategory === "All" ||
          product.category === selectedCategory) &&
        (selectedSubcategory === "All" ||
          product.subcategory === selectedSubcategory) &&
        product.price <= maxPrice
    );

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
    selectedSubcategory,
    maxPrice,
    sortBy,
  ]);

  const changeGender = (gender) => {
    setSelectedGender(gender);
    setSelectedCategory("All");
    setSelectedSubcategory("All");
  };

  const changeCategory = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("All");
  };

  const clearFilters = () => {
    setSelectedGender("All");
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setMaxPrice(8000);
    setSortBy("featured");
  };

  const openProductDetails = (product) => {
    navigate(`/product/${product.id}`, {
      state: { product },
    });
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
            COFIA · Indian Ethnic Fashion
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Traditional Wear Collection
          </h1>

          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Timeless traditional outfits for celebrations, weddings, and
            every special occasion.
          </p>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="mt-5 border border-black bg-black px-5 py-2.5 text-sm text-white transition hover:bg-gray-800"
          >
            🛒 My Cart ({cartCount})
          </button>
        </header>

        <nav
          className="mb-8 flex flex-wrap justify-center gap-3"
          aria-label="Choose collection"
        >
          <button
            type="button"
            onClick={() => changeGender("All")}
            className={`border px-6 py-2.5 text-sm transition ${
              selectedGender === "All"
                ? "border-black bg-black text-white"
                : "border-gray-300 bg-white hover:border-black"
            }`}
          >
            All Collections
          </button>

          {["Men", "Women", "Kids"].map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => changeGender(gender)}
              className={`border px-6 py-2.5 text-sm transition ${
                selectedGender === gender
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white hover:border-black"
              }`}
            >
              {gender}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-normal tracking-wide">
                FILTERS
              </h2>

              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-slate-500 underline hover:text-black"
              >
                Clear All
              </button>
            </div>

            <section className="border border-gray-300 px-6 py-5">
              <h3 className="mb-4 text-base font-semibold uppercase tracking-wide">
                Categories
              </h3>

              <div className="space-y-4">
                {["Men", "Women", "Kids"].map((gender) => (
                  <label
                    key={gender}
                    className="flex cursor-pointer items-center gap-3 text-base text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGender === gender}
                      onChange={() =>
                        changeGender(
                          selectedGender === gender ? "All" : gender
                        )
                      }
                      className="h-4 w-4 cursor-pointer accent-black"
                    />

                    <span>{gender}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="border border-gray-300">
              <button
                type="button"
                onClick={() =>
                  setIsTraditionalOpen((previous) => !previous)
                }
                aria-expanded={isTraditionalOpen}
                aria-controls="traditional-wear-options"
                className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-gray-50"
              >
                <span className="text-base font-semibold uppercase tracking-wide">
                  Traditional Wear
                </span>

                <svg
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                    isTraditionalOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    d="m6 9 6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isTraditionalOpen && (
                <div
                  id="traditional-wear-options"
                  className="border-t border-gray-200 px-6 py-4"
                >
                  <button
                    type="button"
                    onClick={() => changeCategory("All")}
                    className={`mb-3 block w-full rounded px-2 py-2 text-left text-sm ${
                      selectedCategory === "All"
                        ? "bg-gray-100 font-semibold text-black"
                        : "text-slate-700 hover:bg-gray-50"
                    }`}
                  >
                    All Traditional Wear
                  </button>

                  <div className="space-y-3">
                    {availableCategories.map((category) => (
                      <label
                        key={category}
                        className="flex cursor-pointer items-start gap-3 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategory === category}
                          onChange={() =>
                            changeCategory(
                              selectedCategory === category
                                ? "All"
                                : category
                            )
                          }
                          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-black"
                        />

                        <span>{category}</span>
                      </label>
                    ))}
                  </div>

                  {availableSubcategories.length > 0 && (
                    <div className="mt-5 border-t border-gray-200 pt-4">
                      <label
                        htmlFor="subcategory-filter"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                      >
                        Specific Style
                      </label>

                      <select
                        id="subcategory-filter"
                        value={selectedSubcategory}
                        onChange={(event) =>
                          setSelectedSubcategory(event.target.value)
                        }
                        className="w-full border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
                      >
                        <option value="All">All Styles</option>

                        {availableSubcategories.map((subcategory) => (
                          <option key={subcategory} value={subcategory}>
                            {subcategory}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className="border border-gray-300 px-6 py-5">
              <label
                htmlFor="price-filter"
                className="mb-3 block text-base font-semibold uppercase tracking-wide"
              >
                Price Range
              </label>

              <input
                id="price-filter"
                type="range"
                min="500"
                max="8000"
                step="100"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(Number(event.target.value))
                }
                className="w-full cursor-pointer accent-black"
              />

              <div className="mt-3 flex justify-between text-sm text-slate-600">
                <span>₹500</span>

                <span className="font-semibold text-black">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Products above this price will be hidden.
              </p>
            </section>
          </aside>

          <section>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedCategory !== "All"
                    ? selectedCategory
                    : selectedGender === "All"
                    ? "All Traditional Wear"
                    : `${selectedGender}'s Traditional Wear`}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredProducts.length} products found
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <span>Sort by:</span>

                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">
                    Price: Low to High
                  </option>
                  <option value="price-high-low">
                    Price: High to Low
                  </option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const productId = String(
                    product._id || product.id
                  );

                  const isWishlisted = wishlistItems.some(
                    (id) => String(id) === productId
                  );

                  return (
                    <article key={productId} className="group min-w-0">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <button
                          type="button"
                          onClick={() => openProductDetails(product)}
                          aria-label={`View details for ${product.name}`}
                          className="h-full w-full cursor-pointer"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                "https://placehold.co/600x800/f5f5f5/555555?text=Traditional+Wear";
                            }}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleWishlist(product._id || product.id)}
                          aria-label={
                            isWishlisted
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          aria-pressed={isWishlisted}
                          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl shadow-sm ${
                            isWishlisted
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {isWishlisted ? "♥" : "♡"}
                        </button>

                        <span className="pointer-events-none absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 text-xs">
                          {product.category}
                        </span>
                      </div>

                      <div className="pt-3">
                        <p className="text-xs text-slate-500">
                          {product.gender} · {product.category}
                        </p>

                        <button
                          type="button"
                          onClick={() => openProductDetails(product)}
                          className="mt-1 block text-left text-sm font-medium hover:underline"
                        >
                          {product.name}
                        </button>

                        <p className="mt-1 text-xs text-slate-500">
                          {product.subcategory}
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center border border-gray-200 px-5 py-12 text-center">
                <h3 className="text-lg font-semibold">
                  No products found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another category or increase your maximum price.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 border border-black bg-black px-5 py-2.5 text-sm text-white"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default EthnicWear;