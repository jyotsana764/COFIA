import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home';
import ShopNow from './pages/ShopNow';
import EthnicWear from './pages/EthnicWear';
import ShoesFootwear from './pages/ShoesFootwear';
import CategoryCatalog from './pages/CategoryCatalog';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Blog from './pages/Blog';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer position="top-right" autoClose={2500} />

      <Navbar />
      <SearchBar />

      <Routes>
        {/* Home and shopping */}
        <Route path="/" element={<Home />} />
        <Route path="/shop-now" element={<ShopNow />} />
        <Route path="/ethnic-wear" element={<EthnicWear />} />
        <Route path="/jewellery" element={<CategoryCatalog category="Jewellery" />} />
        <Route path="/perfumes" element={<CategoryCatalog category="Perfumes" />} />

        {/* Shoes and footwear collection */}
        <Route
          path="/shoes-footwear"
          element={<ShoesFootwear />}
        />

        {/* General collection */}
        <Route
          path="/collection"
          element={<Collection />}
        />

        {/* Product and shopping cart */}
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />

        {/* Account */}
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Information */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Blog */}
        <Route path="/blog" element={<Blog />} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
