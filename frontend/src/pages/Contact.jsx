
import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

const Contact = () => {
  return (
    <div>
      {/* Page Heading */}
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1="CONTACT" text2="US" />
      </div>

      {/* Contact Information */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px] object-cover"
          src={assets.contact_img}
          alt="Contact COFIA customer support"
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-700">
            COFIA Store
          </p>

          <p className="text-gray-500">
            Online Fashion &amp; Clothing Store
            <br />
            Bangalore, Karnataka, India
          </p>

          <p className="text-gray-500">
            Phone: +91 98765 43210
            <br />
            Email: support@cofia.in
          </p>

          <p className="font-semibold text-xl text-gray-700">
            Customer Support
          </p>

          <p className="text-gray-500">
            We're here to help! Contact COFIA for questions about
            products, orders, payments, delivery, returns, or refunds.
          </p>

          <p className="text-gray-500">
            <b>Working Hours:</b> Monday – Saturday
            <br />
            9:00 AM – 6:00 PM IST
          </p>

          <p className="text-gray-500">
            <b>Our Promise:</b> Your style, your confidence, your COFIA.
          </p>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <NewsLetterBox />
    </div>
  );
};

export default Contact;
