
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { token } = useContext(ShopContext);

  const [userName, setUserName] = useState(
    () => localStorage.getItem('userName') || ''
  );

  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem('userEmail') || ''
  );

  useEffect(() => {
    const loadUserDetails = () => {
      setUserName(localStorage.getItem('userName') || '');
      setUserEmail(localStorage.getItem('userEmail') || '');
    };

    loadUserDetails();
  }, [token]);

  if (!token) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl mb-4">
          Please log in to view your profile
        </h2>

        <Link
          to="/login"
          className="inline-block bg-black text-white px-6 py-3"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl mb-2">My Profile</h1>

      <p className="text-gray-500 mb-8">
        Welcome{userName ? `, ${userName}` : ''} to your COFIA account.
      </p>

      <div className="border border-gray-200 p-6 rounded-md">
        <h2 className="text-xl mb-4">Account Information</h2>

        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium text-black">Name:</span>{' '}
            {userName || 'Name not available'}
          </p>

          <p>
            <span className="font-medium text-black">Email:</span>{' '}
            {userEmail || 'Email not available'}
          </p>

          <p>
            <span className="font-medium text-black">
              Account status:
            </span>{' '}
            Logged in
          </p>
        </div>

        <p className="text-gray-600 mt-4">
          Your account is active. You can browse collections,
          manage your shopping cart, and view your orders.
        </p>

        <Link
          to="/orders"
          className="inline-block mt-6 bg-black text-white px-6 py-3"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default Profile;
