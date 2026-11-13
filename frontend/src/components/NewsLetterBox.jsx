
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NewsLetterBox = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const userEmail = email.trim();

    if (!userEmail) {
      toast.error('Please enter your email address.');
      return;
    }

    if (!backendUrl) {
      toast.error('Backend URL is missing. Check frontend/.env');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/subscribe`,
        { email: userEmail }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || 'Successfully subscribed to COFIA!'
        );
        setEmail('');
      } else {
        toast.error(response.data.message || 'Subscription failed.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);

      toast.error(
        error.response?.data?.message ||
          'Unable to subscribe. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now &amp; get 20% off
      </p>

      <p className="text-gray-400 mt-3">
        Stay ahead of fashion trends! Get exclusive access to new
        collections, seasonal styles, and member-only discounts.
        Be the first to discover our latest arrivals.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-0 mx-auto my-6 border border-gray-400"
      >
        <input
          className="flex-1 min-w-0 outline-none px-3 py-4"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white text-xs px-8 py-4 whitespace-nowrap hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
